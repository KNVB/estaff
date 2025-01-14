export default class Utility {
    static decodeJWT = token => {
        return decodeURIComponent(atob(token.split('.')[1].replace('-', '+').replace('_', '/')).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
    }
    static getExpectedWorkingHour = (itoRoster, firstDayObj, monthlyCalendar) => {
        let result = monthlyCalendar.noOfWorkingDay;
        if (itoRoster.joinDate > firstDayObj) {
            for (let i = 0; i < (itoRoster.joinDate.getDate() - 1); i++) {
                let calendarDate = monthlyCalendar.calendarDateList[i];
                if ((calendarDate.dayOfWeek > 0) &&
                    (calendarDate.dayOfWeek < 6) &&
                    (!calendarDate.isPublicHoliday)) {
                    result--;
                }
            }
        }
        result *= itoRoster.workingHourPerDay;
        return result;
    }
    
    static initRoster = (monthlyCalendar, rosterData, rosterMonth) => {
        let result = {};
        let staffIdList = Object.keys(rosterData);
        for (let i = 0; i < staffIdList.length; i++) {
            let staffRoster = structuredClone(rosterData[staffIdList[i]]);
            staffRoster.actualWorkingDayCount = 0;
            staffRoster.actualWorkingHour = 0.0;
            staffRoster.aShiftCount = 0; staffRoster.bxShiftCount = 0;
            staffRoster.cShiftCount = 0; staffRoster.dxShiftCount = 0;
            staffRoster.totalBalance = 0; staffRoster.joinDate = new Date(staffRoster.joinDate);
            staffRoster.expectedWorkingHour = Utility.getExpectedWorkingHour(staffRoster, rosterMonth, monthlyCalendar);
            result[staffIdList[i]] = staffRoster;
        }
        return result;
    }
    static updateStaffStat = (activeShiftList, roster, nonStandardWorkingHourSummary) => {
        Object.keys(roster).forEach(staffId => {
            let staffRoster = roster[staffId];
            staffRoster.actualWorkingDayCount = 0;
            staffRoster.actualWorkingHour = 0.0;
            staffRoster.aShiftCount = 0; staffRoster.bxShiftCount = 0;
            staffRoster.cShiftCount = 0; staffRoster.dxShiftCount = 0;
            staffRoster.totalBalance = 0;
            Object.keys(staffRoster.shiftList).forEach(date => {
                let item = staffRoster.shiftList[date];
                let shiftTypeList = item.split("+");
                shiftTypeList.forEach(shiftType => {
                    if (staffRoster.availableShiftList.includes(shiftType)) {
                        if (activeShiftList[shiftType]) {
                            staffRoster.actualWorkingHour += activeShiftList[shiftType].duration;
                            switch (shiftType) {
                                case "a":
                                    staffRoster.aShiftCount++;
                                    staffRoster.actualWorkingDayCount++;
                                    break;
                                case "b":
                                case "b1":
                                    staffRoster.bxShiftCount++;
                                    staffRoster.actualWorkingDayCount++
                                    break;
                                case "c":
                                    staffRoster.cShiftCount++;
                                    staffRoster.actualWorkingDayCount++
                                    break;
                                case "d":
                                case "d1":
                                case "d2":
                                case "d3":
                                    staffRoster.dxShiftCount++;
                                    staffRoster.actualWorkingDayCount++
                                    break;
                                default:
                                    break
                            }
                        }
                    }
                });
            });
            staffRoster.thisMonthBalance = staffRoster.actualWorkingHour - staffRoster.expectedWorkingHour;
            staffRoster.totalBalance += staffRoster.lastMonthBalance + staffRoster.thisMonthBalance;
            staffRoster.totalBalance += nonStandardWorkingHourSummary[staffId];
        });
    }
}