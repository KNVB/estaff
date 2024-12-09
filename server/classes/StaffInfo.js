import Dbo from "../util/Dbo.js";
export default class StaffInfo{
    #dboObj;
    constructor() {
        this.#dboObj = new Dbo();
    }
    addStaffInfo = async staffInfo=>{
        staffInfo.staffId=staffInfo.staffPost+"_"+staffInfo.joinDate;
        try {
            return await this.#dboObj.addStaffInfo(staffInfo);
        } catch (error) {
            console.log("Something wrong when adding a staff info to DB:" + error);
            throw (error);
        }
        finally {
            this.#dboObj.close();
        };
    }
    getStaffList= async () => {
        try {
            let queryResult = await this.#dboObj.getStaffList();
            let result = {};
            queryResult.forEach(record => {
                if (result[record.staff_id] === undefined) {
                    result[record.staff_id] = {
                        availableShift: record.available_shift.split(","),                       
                        dutyPattern: record.duty_pattern,
                        hkoAdUser:record.hko_ad_user,
                        staffId: record.staff_id,
                        joinDate: record.join_date,
                        leaveDate: record.leave_date,
                        staffName: record.staff_name,
                        staffPost: record.staff_post,
                        workingHourPerDay: record.working_hour_per_day
                    };
                    if (record.black_list_pattern)
                        result[record.staff_id].blackListedShiftPattern=[record.black_list_pattern];
                    else 
                        result[record.staff_id].blackListedShiftPattern=[];
                }else{
                    result[record.staff_id].blackListedShiftPattern.push(record.black_list_pattern);
                }
            });
            return result;
        } catch (error) {
            console.log("Something wrong when getting Staff list:" + error);
            throw (error);
        }
        finally {
            this.#dboObj.close();
        };
    }
    updateStaffInfo = async staffInfo=>{
        try {
            return await this.#dboObj.updateStaffInfo(staffInfo);
        } catch (error) {
            console.log("Something wrong when updating a staff info to DB:" + error);
            throw (error);
        }
        finally {
            this.#dboObj.close();
        };
    }
}