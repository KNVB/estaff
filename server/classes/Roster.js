import Dbo from "../util/Dbo.js";
import StaffRoster from "./StaffRoster.js";
import Utility from "../util/Utility.js";
export default class Roster {
    getPreferredShiftList = async (year, month) => {
        let dboObj = new Dbo();
        let preferredShiftList = {};
        try {
            let results = await dboObj.getPreferredShiftList(year, month);
            console.log("Get (" + year + "," + month + ") Preferred Shift List successfully!");
            results.forEach(record => {
                if (preferredShiftList[record.staff_id] === undefined) {
                    preferredShiftList[record.staff_id] = {};
                }
                if (record.d) {
                    preferredShiftList[record.staff_id][record.d] = record.preferred_shift;
                }
            });
            return preferredShiftList;
        } catch (error) {
            console.log("Something wrong when getting Preferred shift list:" + error);
            throw (error);
        }
        finally {
            dboObj.close();
        };
    }
    getPreviousMonthShiftList = async (year, month, systemParam) => {
        let dboObj = new Dbo();
        let previousMonthShiftList = {};
        try {
            let results = await dboObj.getPreviousMonthShiftList(year, month, systemParam);
            results.forEach(record => {
                if (previousMonthShiftList[record.staff_id] === undefined) {
                    previousMonthShiftList[record.staff_id] = [];
                }
                if (record.shift) {
                    previousMonthShiftList[record.staff_id].push(record.shift);
                }
            });
            console.log("Get (" + year + "," + month + ") Previous Month Shift List successfully!");
            return previousMonthShiftList;
        } catch (error) {
            console.log("Something wrong when getting Previous month shift list:" + error);
            throw (error);
        }
        finally {
            dboObj.close();
        };
    }
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
    updateRoster = async (data) => {
        let rosterMonth = new Date(data.rosterMonth);
        let roster = data.roster;
        let preferredShiftList = data.preferredShiftList;
        let dbo = new Dbo();
        try {
            let result = await dbo.updateRoster(preferredShiftList, roster,rosterMonth);
            return result;
        } catch (error) {
            console.log("An error occur when saving roster data from DB.");
            console.log(error);
            throw (error);
        } finally {
            dbo.close();
        }
    }
}