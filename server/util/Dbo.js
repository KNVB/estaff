import { DbConfig } from './DbConfig.js';
import mysql from 'mysql2';
import Utility from './Utility.js';
export default class Dbo {
    #connection;
    #sqlString;
    constructor() {
        this.#connection = mysql.createConnection(DbConfig);
    }
    addNonStandardWorkingHourRecord = async record => {
        try {
            await this.#connection.promise().beginTransaction();
            console.log("Add Non Standard Working Hour Record transaction start.");
            console.log("===============================");
            this.#sqlString = "insert into non_standard_working_hour (claim_type,description,end_time,id,no_of_hour_applied_for,staff_id,start_time)";
            this.#sqlString += "values (?,?,?,?,?,?,?)";
            //console.log(record);
            let startTime = new Date(record.startTime);
            await this.#executeQuery(this.#sqlString,
                [
                    record.claimType,
                    record.description,
                    new Date(record.endTime),
                    record.id,
                    record.durationInHour,
                    record.staffId,
                    startTime
                ]);

            let nextMonth = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            let dataArray = [
                Number(record.durationInHour),
                nextMonth,
                record.staffId
            ];

            this.#sqlString = "select balance from last_month_balance where shift_month=? and staff_id=?";
            let result = await this.#executeQuery(this.#sqlString, [
                nextMonth,
                record.staffId
            ]);
            //console.log(nextMonth, result);
            if (result.length === 0) {
                this.#sqlString = "insert into last_month_balance (balance,shift_month,staff_id) values(?,?,?)";
            } else {
                this.#sqlString = "update last_month_balance set balance=balance + ? where shift_month>=? and staff_id=?";
            }
            await this.#executeQuery(this.#sqlString, dataArray);
            await this.#connection.promise().commit();
            console.log("An Non Standard Working Hour Record is added successfully.");
            console.log("===============================");
            return true;
        } catch (error) {
            if (this.#connection) {
                await this.#connection.promise().rollback();
            }
            throw error;
        }
    }
    addStaffInfo = async staffInfo => {
        try {
            await this.#connection.promise().beginTransaction();
            console.log("Add EMSTF info. transaction start.");
            console.log("===============================");
            console.log(staffInfo);
            this.#sqlString = "insert into emstf_staff_info (available_Shift,duty_pattern,hko_ad_user,staff_Id,";
            this.#sqlString += "join_date,leave_date,staff_name,staff_post,working_hour_per_day)";
            this.#sqlString += "values(?,?,?,?,?,?,?,?,?)";
            await this.#executeQuery(this.#sqlString, [
                staffInfo.availableShift.join(","),
                staffInfo.dutyPattern,
                staffInfo.hkoAdUser,
                staffInfo.staffId,
                staffInfo.joinDate,
                staffInfo.leaveDate,
                staffInfo.staffName,
                staffInfo.staffPost,
                staffInfo.workingHourPerDay
            ]);
            this.#sqlString = "insert into black_list_pattern (staff_Id, black_list_pattern) values(?,?)";
            for (let i = 0; i < staffInfo.blackListedShiftPattern.length; i++) {
                let shiftPattern = staffInfo.blackListedShiftPattern[i];
                await this.#executeQuery(this.#sqlString, [staffInfo.staffId, shiftPattern]);
            }
            await this.#connection.promise().commit();
            console.log("An EMSTF staff info is added successfully.");
            console.log("===============================");
            return true;
        } catch (error) {
            if (this.#connection) {
                await this.#connection.promise().rollback();
            }
            throw error;
        }
    }
    deleteNonStandardWorkingHourRecord = async recordId => {
        try {
            await this.#connection.promise().beginTransaction();
            console.log("Deleted Non Standard Working Hour Record transaction start.");
            console.log("===============================");
            this.#sqlString = "select * from non_standard_working_hour where id=?";
            let result = await this.#executeQuery(this.#sqlString, [recordId]);
            let record = result[0];

            let shiftMonth = new Date(record.start_time.getFullYear(), record.start_time.getMonth(), 1);
            shiftMonth.setMonth(shiftMonth.getMonth() + 1);
            //console.log(result, record.no_of_hour_applied_for, shiftMonth, record.staff_id);
            this.#sqlString = "update last_month_balance set balance=balance - ? where shift_month>=? and staff_id=?";
            result = await this.#executeQuery(this.#sqlString, [
                Number(record.no_of_hour_applied_for),
                shiftMonth,
                record.staff_id
            ]);
            
            this.#sqlString = "delete from non_standard_working_hour where id=?";
            result = await this.#executeQuery(this.#sqlString, [recordId]);

            await this.#connection.promise().commit();
            console.log("An Non Standard Working Hour Record is deleted successfully.");
            console.log("===============================");
            return true;
        } catch (error) {
            if (this.#connection) {
                await this.#connection.promise().rollback();
            }
            throw error;
        }
    }
    getActiveShiftList = async () => {
        this.#sqlString = "select * from shift_info where active=1 order by shift_type";
        return await this.#executeQuery(this.#sqlString);
    }
    getBlackListShiftPattern = async (year, month) => {
        let result = Utility.getStartEndDateString(year, month);
        this.#sqlString = "select v.staff_id,black_list_pattern ";
        this.#sqlString += "from ";
        this.#sqlString += "(SELECT staff_id , staff_post";
        this.#sqlString += "    FROM   emstf_staff_info ";
        this.#sqlString += "    WHERE  join_date <=?";
        this.#sqlString += "    AND leave_date >=?)as v ";
        this.#sqlString += "left join ";
        this.#sqlString += "(select staff_id, black_list_pattern ";
        this.#sqlString += "from black_list_pattern) k ";
        this.#sqlString += "on v.staff_id=k.staff_id ";
        this.#sqlString += "order by Cast(replace(staff_post,\"ITO\",\"\") as unsigned)";
        return await this.#executeQuery(this.#sqlString, [
            result.endDateString, result.startDateString
        ]);
    }
    getPreferredShiftList = async (year, month) => {
        let result = Utility.getStartEndDateString(year, month);
        this.#sqlString = "select  v.staff_id,preferred_shift,d from";
        this.#sqlString += "(SELECT staff_id , staff_post ";
        this.#sqlString += "    FROM   emstf_staff_info ";
        this.#sqlString += "    WHERE  join_date <= ?";
        this.#sqlString += "    AND leave_date >= ?)as v ";
        this.#sqlString += "left join ";
        this.#sqlString += "(SELECT staff_id,preferred_shift,day(shift_date) as d ";
        this.#sqlString += "FROM preferred_shift ";
        this.#sqlString += "where shift_date between ? and ?) as k ";
        this.#sqlString += "on v.staff_id=k.staff_id ";
        this.#sqlString += "order by Cast(replace(staff_post,\"ITO\",\"\") as unsigned), d";
        return await this.#executeQuery(this.#sqlString, [
            result.endDateString, result.startDateString,
            result.startDateString, result.endDateString
        ]);
    }
    getPreviousMonthShiftList = async (year, month, systemParam) => {
        let result = Utility.getStartEndDateString(year, month);
        //this.#sqlString = "select ito_id,shift from shift_record where shift_date >= ? and shift_date < ? order by ito_id,shift_date";

        this.#sqlString = "SELECT v.staff_id, shift ";
        this.#sqlString += "FROM   (SELECT staff_id ";
        this.#sqlString += "FROM   emstf_staff_info ";
        this.#sqlString += "WHERE  join_date <= ? ";
        this.#sqlString += "AND  leave_date >= ?) as v ";
        this.#sqlString += "LEFT JOIN shift_record ";
        this.#sqlString += "ON shift_record.staff_id = v.staff_id ";
        this.#sqlString += "AND shift_date >= ? ";
        this.#sqlString += "AND shift_date < ? ";
        this.#sqlString += "order by v.staff_id,shift_date";

        let lastMonthEndDate = result.startDateString;
        let tempDate = new Date(result.startDateString);
        tempDate.setTime(tempDate.getTime() - systemParam.maxConsecutiveWorkingDay * 86400000);
        let lastMonthStartDate = tempDate.toLocaleDateString("en-CA");
        //console.log(result.startDateString, result.endDateString,lastMonthStartDate,lastMonthEndDate);
        return await this.#executeQuery(this.#sqlString, [result.endDateString, result.startDateString, lastMonthStartDate, lastMonthEndDate]);
    }
    getNonStandardWorkingHourList = async (year, month) => {
        let result = Utility.getStartEndDateString(year, month);
        this.#sqlString = "select v.staff_id,staff_post,staff_name,";
        this.#sqlString += "k.end_Time,k.start_time,k.no_of_hour_applied_for,";
        this.#sqlString += "description,id,status,claim_type ";
        this.#sqlString += "from ";
        this.#sqlString += "		(SELECT ";
        this.#sqlString += "               staff_id,";
        this.#sqlString += "               staff_name,";
        this.#sqlString += "               staff_post";
        this.#sqlString += "        FROM   emstf_staff_info";
        this.#sqlString += "        WHERE  join_date <= ?";
        this.#sqlString += "               AND leave_date >= ?) v";
        this.#sqlString += "		left join ";
        this.#sqlString += "(SELECT  *";
        this.#sqlString += " FROM non_standard_working_hour";
        this.#sqlString += " where ";
        this.#sqlString += " start_time  <= ? ";
        this.#sqlString += " and end_time>= ?)k";
        this.#sqlString += "			on v.staff_id=k.staff_id ";
        this.#sqlString += " order by  Cast(replace(staff_post,\"ITO\",\"\") as unsigned)";
        return await this.#executeQuery(this.#sqlString,
            [
                result.endDateString,
                result.startDateString,
                result.endDateString,
                result.startDateString
            ]
        );
    }
    getNonStandardWorkingHourSummary = async (year, month) => {
        let result = Utility.getStartEndDateString(year, month);
        this.#sqlString = "select v.staff_id,sum(k.no_of_hour_applied_for) as 'sum'";
        this.#sqlString += "from ";
        this.#sqlString += "		(SELECT ";
        this.#sqlString += "               emstf_staff_info.staff_id,";
        this.#sqlString += "               staff_post";
        this.#sqlString += "        FROM   emstf_staff_info";
        this.#sqlString += "        WHERE  join_date <= ?";
        this.#sqlString += "               AND leave_date >= ?) v";
        this.#sqlString += "		left join ";
        this.#sqlString += "(SELECT staff_id,no_of_hour_applied_for ";
        this.#sqlString += " FROM non_standard_working_hour";
        this.#sqlString += " where ";
        this.#sqlString += " start_time  <= ? ";
        this.#sqlString += " and end_time>= ?)k";
        this.#sqlString += "			on v.staff_id=k.staff_id ";
        this.#sqlString += " group by v.staff_id ";
        this.#sqlString += "order by left(staff_post,1)  desc ,cast(replace(staff_post,\"SITO\",\"\") as unsigned),";
        this.#sqlString += "cast(replace(staff_post,\"ITO\",\"\") as unsigned)";
        return await this.#executeQuery(this.#sqlString,
            [
                result.endDateString,
                result.startDateString,
                result.endDateString,
                result.startDateString
            ]
        );
    }
    getRoster = async (year, month) => {
        let result = Utility.getStartEndDateString(year, month);
        this.#sqlString = "SELECT v.available_shift,";
        this.#sqlString += "	   balance,";
        this.#sqlString += "	   Day(shift_date) AS d,";
        this.#sqlString += "	   duty_pattern,";
        this.#sqlString += "	   v.staff_id,";
        this.#sqlString += "	   staff_name,";
        this.#sqlString += "       join_date,";
        this.#sqlString += "	   staff_post,";
        this.#sqlString += "	   shift,";
        this.#sqlString += "	   working_hour_per_day ";
        this.#sqlString += "FROM   (SELECT available_shift,";
        this.#sqlString += "	           duty_pattern,";
        this.#sqlString += "			   staff_name,";
        this.#sqlString += "			   emstf_staff_info.staff_id,";
        this.#sqlString += "               join_date,";
        this.#sqlString += "			   staff_post,";
        this.#sqlString += "			   working_hour_per_day ";
        this.#sqlString += "		FROM   emstf_staff_info ";
        this.#sqlString += "		WHERE  emstf_staff_info.join_date <= ?";
        this.#sqlString += "			   AND emstf_staff_info.leave_date >= ?) AS v";
        this.#sqlString += "	   LEFT JOIN shift_record";
        this.#sqlString += "			  ON v.staff_id = shift_record.staff_id";
        this.#sqlString += "				 AND ( shift_record.shift_date BETWEEN";
        this.#sqlString += "					   ? AND ? )";
        this.#sqlString += "	   LEFT JOIN last_month_balance";
        this.#sqlString += "			  ON v.staff_id = last_month_balance.staff_id";
        this.#sqlString += "				 AND shift_month = ?";
        this.#sqlString += "ORDER  BY duty_pattern,left(staff_post,1)  desc ,cast(replace(staff_post,\"SITO\",\"\") as unsigned),";
        this.#sqlString += "          cast(replace(staff_post,\"ITO\",\"\") as unsigned),";
        this.#sqlString += "		  shift_date,";
        this.#sqlString += "		  shift";
        return await this.#executeQuery(this.#sqlString,
            [
                result.endDateString,
                result.startDateString,
                result.startDateString,
                result.endDateString,
                result.startDateString
            ]
        );
    }
    getStaffList = async () => {
        this.#sqlString = "select a.staff_id,a.staff_name,a.available_shift,";
        this.#sqlString += "b.black_list_pattern,duty_pattern,";
        this.#sqlString += "DATE_FORMAT(join_date,\"%Y-%m-%d\") as join_date,";
        this.#sqlString += "DATE_FORMAT(leave_Date ,\"%Y-%m-%d\") as leave_date,";
        this.#sqlString += "staff_post,working_hour_per_day,hko_ad_user ";
        this.#sqlString += "from emstf_staff_info a ";
        this.#sqlString += "left join black_list_pattern b on a.staff_id = b.staff_id ";
        this.#sqlString += "order by leave_date desc,left(staff_post,1)  desc ,cast(replace(staff_post,\"SITO\",\"\") as unsigned),";
        this.#sqlString += "cast(replace(staff_post,\"ITO\",\"\") as unsigned)";
        return await this.#executeQuery(this.#sqlString);
    }
    getSystemParam = async () => {
        this.#sqlString = "select * from system_param order by param_type,param_key,param_value";
        return await this.#executeQuery(this.#sqlString);
    }
    updateNonStandardWorkingHourRecord = async record => {
        try {
            await this.#connection.promise().beginTransaction();
            console.log("update Non Standard Working Hour Record transaction start.");
            console.log("===============================");

            this.#sqlString = "select start_time,no_of_hour_applied_for from non_standard_working_hour where id=?";
            let result = await this.#executeQuery(this.#sqlString, [record.id]);
            let startTime = result[0].start_time;
            let nextMonth = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            this.#sqlString = "update last_month_balance set balance=balance - ? where shift_month>=? and staff_id=?";
            await this.#executeQuery(this.#sqlString,
                [
                    Number(result[0].no_of_hour_applied_for),
                    nextMonth,
                    record.staffId
                ]
            );
            startTime = new Date(record.startTime);
            nextMonth = new Date(startTime.getFullYear(), startTime.getMonth(), 1);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            this.#sqlString = "update non_standard_working_hour set claim_type=?,description=?,end_time=?,";
            this.#sqlString += "no_of_hour_applied_for=?,staff_id=?,start_time=? where id=?";
            await this.#executeQuery(this.#sqlString,
                [
                    record.claimType,
                    record.description,
                    new Date(record.endTime),
                    record.durationInHour,
                    record.staffId,
                    startTime,
                    record.id
                ]
            );
            this.#sqlString = "select * from last_month_balance where shift_month=? and staff_id=?";
            result = await this.#executeQuery(this.#sqlString,
                [
                    nextMonth,
                    record.staffId
                ]);
            if (result.length === 0) {
                this.#sqlString = "insert into last_month_balance (balance,shift_month,staff_id) values (?,?,?)";
                await this.#executeQuery(this.#sqlString,
                    [
                        Number(record.durationInHour),
                        nextMonth,
                        record.staffId
                    ]
                );
                this.#sqlString = "update last_month_balance set balance=balance +? where shift_month>? and staff_id=?";
                await this.#executeQuery(this.#sqlString,
                    [
                        Number(record.durationInHour),
                        nextMonth,
                        record.staffId
                    ]
                );
            } else {
                this.#sqlString = "update last_month_balance set balance=balance +? where shift_month>=? and staff_id=?";
            }
            await this.#executeQuery(this.#sqlString,
                [
                    Number(record.durationInHour),
                    nextMonth,
                    record.staffId
                ]
            );
            await this.#connection.promise().commit();
            console.log("An Non Standard Working Hour Record is updated successfully.");
            console.log("===============================");
            return true;
        } catch (error) {
            if (this.#connection) {
                await this.#connection.promise().rollback();
            }
            throw error;
        }
    }
    updateStaffInfo = async staffInfo => {
        try {
            await this.#connection.promise().beginTransaction();
            console.log("Update EMSD Staff (" + staffInfo.staffId + ") info. transaction start.");
            console.log("===============================");
            console.log(staffInfo);
            this.#sqlString = "update emstf_staff_info set available_Shift=?,duty_pattern=?,hko_ad_user=?,join_date=?,";
            this.#sqlString += "leave_date=?,staff_name=?,staff_post=?,working_hour_per_day=?";
            this.#sqlString += " where staff_Id=?";
            await this.#executeQuery(this.#sqlString, [
                staffInfo.availableShift.join(","),
                staffInfo.dutyPattern,
                staffInfo.hkoAdUser,
                staffInfo.joinDate,
                staffInfo.leaveDate,
                staffInfo.staffName,
                staffInfo.staffPost,
                staffInfo.workingHourPerDay,
                staffInfo.staffId
            ]);
            this.#sqlString = "delete from black_list_pattern where staff_Id=?";
            await this.#executeQuery(this.#sqlString, [staffInfo.staffId]);
            this.#sqlString = "insert into black_list_pattern (staff_Id, black_list_pattern) values(?,?)";
            for (let i = 0; i < staffInfo.blackListedShiftPattern.length; i++) {
                let shiftPattern = staffInfo.blackListedShiftPattern[i];
                await this.#executeQuery(this.#sqlString, [staffInfo.staffId, shiftPattern]);
            }
            await this.#connection.promise().commit();
            console.log("EMSTF Staff (" + staffInfo.staffId + ")info updated successfully.");
            console.log("===============================");
            return true;
        } catch (error) {
            if (this.#connection) {
                await this.#connection.promise().rollback();
            }
            throw error;
        }
    }
    updateRoster = async (preferredShiftList, roster, rosterMonth) => {
        try {
            let month = rosterMonth.getMonth() + 1;
            let year = rosterMonth.getFullYear();
            let nextMonth = structuredClone(rosterMonth);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            await this.#connection.promise().beginTransaction();
            console.log("Update roster data transaction start.");
            console.log("===============================");
            console.log("year=" + rosterMonth.getFullYear() + ",month=" + (rosterMonth.getMonth() + 1));
            console.log(rosterMonth.toLocaleDateString("en-CA"));
            for (const [staffId, staffRoster] of Object.entries(roster)) {
                this.#sqlString = "replace into last_month_balance (staff_id,shift_month,balance) values (?,?,?)";
                await this.#executeQuery(this.#sqlString, [staffId, nextMonth, staffRoster.totalBalance]);
                this.#sqlString = "delete from shift_record where staff_id=? and month(shift_date)=? and year(shift_date)=?";
                await this.#executeQuery(this.#sqlString, [staffId, month, year]);
                console.log("delete " + staffId + " shift record for:" + month + "/" + year);
                console.log(staffId + " Shift List:");
                this.#sqlString = "replace into shift_record (staff_id,shift_date,shift,state) values (?,?,?,?)";
                let dateList = Object.keys(staffRoster.shiftList);
                for (let i = 0; i < dateList.length; i++) {
                    let shiftList = staffRoster.shiftList[dateList[i]].split("+");
                    for (let j = 0; j < shiftList.length; j++) {
                        await this.#executeQuery(this.#sqlString, [staffId, year + "-" + month + "-" + dateList[i], shiftList[j], "A"]);
                    }
                }
                console.log("update " + staffId + " shift record for:" + month + "/" + year);
                this.#sqlString = "delete from preferred_shift where staff_id=? and month(shift_date)=? and year(shift_date)=?";
                console.log("delete " + staffId + " preferred shift data for:" + month + "/" + year);
                this.#sqlString = "replace into preferred_shift (staff_id,preferred_shift,shift_date) values (?,?,?)";
                for (let date in preferredShiftList[staffId]) {
                    await this.#executeQuery(this.#sqlString, [staffId, preferredShiftList[staffId][date], year + "-" + month + "-" + date]);
                }
                console.log("update " + staffId + " preferred shift record for:" + month + "/" + year);
                console.log(staffId + " roster data update completed.");
                console.log("===============================");
            }
            await this.#connection.promise().commit();
            return true;
        } catch (error) {
            if (this.#connection) {
                await this.#connection.promise().rollback();
            }
            throw error;
        }
    }
    close() {
        this.#connection.end(err => {
            if (err) throw err;
            console.log("Disconnect from " + DbConfig["host"] + " successfully!");
        });
    }
    //=========================================================================================================================
    async #executeQuery(sql, para) {
        try {
            const [rows] = await this.#connection.promise().query(sql, para);
            return rows;
        } catch (err) {
            throw (err);
        }
    }
}