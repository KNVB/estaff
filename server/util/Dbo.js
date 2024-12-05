import { DbConfig } from './DbConfig.js';
import mysql from 'mysql2';
import Utility from './Utility.js';
export default class Dbo {
    #connection;
    #sqlString;
    constructor() {
        this.#connection = mysql.createConnection(DbConfig);
    }
    getActiveShiftList = async () => {
        this.#sqlString = "select * from shift_info where active=1 order by shift_type";
        return await this.#executeQuery(this.#sqlString);
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
        this.#sqlString += " order by Cast(replace(staff_post,\"ITO\",\"\") as unsigned)";
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
        this.#sqlString += "ORDER  BY Cast(replace(staff_post,\"ITO\",\"\") as unsigned),";
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
        this.#sqlString += "staff_post,working_hour_per_day ";
        this.#sqlString += "from emstf_staff_info a ";
        this.#sqlString += "left join black_list_pattern b on a.staff_id = b.staff_id ";
        this.#sqlString += "order by leave_date desc,Cast(replace(staff_post,\"ITO\",\"\") as unsigned)";
        return await this.#executeQuery(this.#sqlString);
    }
    getSystemParam = async () => {
        this.#sqlString = "select * from system_param order by param_type,param_key,param_value";
        return await this.#executeQuery(this.#sqlString);
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