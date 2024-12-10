export default class Utility {
    static dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    static dateTimeFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    static buildPreShift = (dateOfMonth, essentialShift, itoRoster, systemParam) => {
        let preShift = [];
        for (let j = dateOfMonth - systemParam.noOfPrevDate; j < dateOfMonth; j++) {
            if (itoRoster.shiftList[j]) {
                let shiftObj = itoRoster.shiftList[j];
                if ((essentialShift.indexOf(shiftObj) > -1) ||
                    (shiftObj === "O")
                ) {
                    preShift.push(shiftObj);
                }
            }
        }
        preShift = preShift.join(",");
        return preShift
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
    static isBlackListShift = (blackListShiftPattern, staffId, newShift) => {
        let result = false;
        if (blackListShiftPattern[staffId]) {
            for (let i = 0; i < blackListShiftPattern[staffId].length; i++) {
                let blackListShift = blackListShiftPattern[staffId][i];
                if (newShift.indexOf(blackListShift) > -1) {
                    result = true;
                    break;
                }
            }
        }
        return result;
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
    static getAllITOStat = (essentialShift, startDate, endDate, blackListShiftPattern, staffIdList, systemParam, roster) => {
        let essentialShiftList = new Set();
        let blackListShiftList = {};
        let duplicateShiftList = {};
        let vacantShiftList = {};
        let preShift = "";
        staffIdList.forEach(staffId => {
            blackListShiftList[staffId] = [];
            duplicateShiftList[staffId] = [];
        });
        for (let i = 0; i < essentialShift.length; i++) {
            essentialShiftList.add(essentialShift[i]);
        }
        for (let i = startDate; i <= endDate; i++) {
            let vacantShift = essentialShift;
            let assignedShiftList = [];
            staffIdList.forEach(staffId => {
                let shiftInfoList = roster[staffId].shiftList[i];
                
                shiftInfoList = shiftInfoList.split("+");
                for (let j = 0; j < shiftInfoList.length; j++) {
                    let shiftInfo;
                    if (shiftInfoList[j] === "b1") {
                        shiftInfo = "b";
                    } else {
                        shiftInfo = shiftInfoList[j];
                    }
                    //if the shift is an essential shift    
                    if (essentialShiftList.has(shiftInfo)) {
                        vacantShift = vacantShift.replace(shiftInfo, "");
                        if (assignedShiftList.includes(shiftInfo)) {
                            duplicateShiftList[staffId].push(i);
                        } else {
                            assignedShiftList.push(shiftInfo);
                        }

                        //if no black listed shift found in previous shift
                        if (!blackListShiftList[staffId].includes(i - 1)) {
                            preShift = Utility.buildPreShift(i, essentialShift, roster[staffId], systemParam);
                            //check if the black listed shift found
                            if (Utility.isBlackListShift(blackListShiftPattern, staffId, preShift + "," + shiftInfo)) {
                                blackListShiftList[staffId].push(i);
                            }
                        }
                    }
                }
            });
            //console.log("vacantShift="+vacantShift);
            // Check if vacant shift exists
            if (vacantShift !== '') {
                vacantShiftList[i] = vacantShift;
            }
        }

        return {
            blackListShiftList,
            duplicateShiftList,
            vacantShiftList
        }
    }
    static getDurationInHour = (startTime, endTime) => {
        return (endTime - startTime) / 1000 / 3600
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
    static shuffleArray(arr) {
        for (let i = 0; i < arr.length; i++) {
            let a = arr[i];
            let b = Math.floor(Math.random() * arr.length);
            arr[i] = arr[b];
            arr[b] = a;
        }
    }
}