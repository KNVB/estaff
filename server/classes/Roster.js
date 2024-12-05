import Dbo from "../util/Dbo.js";
import StaffRoster from "./StaffRoster.js";
import Utility from "../util/Utility.js";
export default class Roster {
    getRoster = async (year, month) => {
        let dbo = new Dbo();
        let staffRosterList = {};
        try {
            let results = await dbo.getRoster(year, month);
            console.log("Get (" + year + "," + month + ") Roster successfully!");
            results.forEach(record => {
                if (staffRosterList[record.staff_id] === undefined) {
                    let staffRoster=new StaffRoster();
                    staffRoster.availableShiftList = record.available_shift.split(",");
                    staffRoster.dutyPattern = record.duty_pattern;
                    staffRoster.staffName = record.staff_name;
                    staffRoster.staffPost = record.staff_post;
                    staffRoster.joinDate = record.join_date;
                    staffRoster.workingHourPerDay = parseFloat(record.working_hour_per_day);
                    if (record.balance) {
                        staffRoster.lastMonthBalance = parseFloat(record.balance);
                    }
                    staffRosterList[record.staff_id] = staffRoster;
                }
                if (record.d) {
                    if (staffRosterList[record.staff_id].shiftList[record.d]) {
                        staffRosterList[record.staff_id].shiftList[record.d] += "+" + record.shift;
                    } else {
                        staffRosterList[record.staff_id].shiftList[record.d] = record.shift;
                    }
                }
            });
            let endDate = Utility.getEndDate(year, month);
            Object.keys(staffRosterList).forEach(staffId => {
                let staffRoster = staffRosterList[staffId];
                for (let i = 0; i < endDate; i++) {
                    if (staffRoster.shiftList[i + 1] === undefined) {
                        staffRosterList[staffId].shiftList[i + 1] = "";
                    }
                }
            });
            return staffRosterList;
        }
        catch (error) {
            console.log("An error occur when getting roster list from DB.");
            console.log(error);
            throw (error);
        } finally {
            dbo.close();
        }
    }
}