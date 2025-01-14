import Utility from "../util/Utility";
export default class AutoPlanner {
    #activeShiftList;
    #calendarDateList;
    #essentialShift;
    #essentialShiftList;
    #blackListShiftPattern;
    #staffIdList;
    #nonStandardWorkingHourSummary;
    #noOfWorkingDay;
    #preferredShiftList;
    #previousMonthShiftList;
    #roster;
    #rosterMonth;
    #systemParam;
    constructor(startDate, endDate) {
        this.endDate = endDate;
        this.startDate = startDate;
    }
    setRosterSchedulerData = (rosterSchedulerData) => {
        this.#activeShiftList = structuredClone(rosterSchedulerData.activeShiftList);
        this.#calendarDateList = structuredClone(rosterSchedulerData.calendarDateList);
        this.#essentialShift = rosterSchedulerData.essentialShift;
        this.#blackListShiftPattern = structuredClone(rosterSchedulerData.blackListShiftPattern);
        this.#staffIdList = structuredClone(rosterSchedulerData.staffIdList);
        this.#nonStandardWorkingHourSummary = structuredClone(rosterSchedulerData.nonStandardWorkingHourSummary);
        this.#noOfWorkingDay = rosterSchedulerData.noOfWorkingDay;
        this.#preferredShiftList = structuredClone(rosterSchedulerData.preferredShiftList);
        this.#previousMonthShiftList = structuredClone(rosterSchedulerData.previousMonthShiftList);
        this.#roster = structuredClone(rosterSchedulerData.roster);
        this.#rosterMonth = structuredClone(rosterSchedulerData.rosterMonth);
        this.#systemParam = structuredClone(rosterSchedulerData.systemParam);
        this.#essentialShiftList = [];
        for (let i = 0; i < this.#essentialShift.length; i++) {
            this.#essentialShiftList.push(this.#essentialShift[i]);
        }
    }
    start = () => {
        let finalResult = structuredClone(this.#roster);
        let planResult = this.#doAutoPlan();
        Object.keys(planResult).forEach(staffId => {
            let shiftList = planResult[staffId].shiftList;
            Object.keys(shiftList).forEach(dateOfMonth => {
                finalResult[staffId].shiftList[dateOfMonth] = shiftList[dateOfMonth];
            });
        });
        //finalResult = Utility.genITOStat(this.#activeShiftList, this.#noOfWorkingDay, finalResult, this.#nonStandardWorkingHourSummary);
        Utility.updateStaffStat(this.#activeShiftList, finalResult, this.#nonStandardWorkingHourSummary);
        let tempResult = Utility.getAllITOStat(this.#essentialShift, 1, this.#calendarDateList.length, this.#blackListShiftPattern,this.#staffIdList,this.#systemParam, finalResult);
        //console.log(tempResult);
        return {
            duplicateShiftList: structuredClone(tempResult.duplicateShiftList),
            roster: finalResult,
            vacantShiftList: structuredClone(tempResult.vacantShiftList)
        };
    }
    //======================================================================================================
    #buildAvailableShift = staffId => {
        let result = {};
        let staffRoster = this.#roster[staffId];
        for (let dateOfMonth = this.startDate; dateOfMonth <= this.endDate; dateOfMonth++) {
            let theDate = new Date(this.#rosterMonth.getFullYear(), this.#rosterMonth.getMonth(), dateOfMonth);
            if (theDate < staffRoster.joinDate) {
                result[dateOfMonth] = "O"
            } else {
                if (this.#preferredShiftList[staffId][dateOfMonth]) {
                    result[dateOfMonth] = this.#processPreferredShiftList(staffId, dateOfMonth);
                } else {
                    result[dateOfMonth] = structuredClone(this.#essentialShiftList);
                }
            }
        }
        return result;
    }
    #buildTempResult = staffId => {
        let item, preIndex;
        let result = {};
        let lastIndex = this.startDate - this.#systemParam.noOfPrevDate;
        for (let i = lastIndex; i < this.startDate; i++) {
            if (i < 1) {
                preIndex = i + Object.keys(this.#previousMonthShiftList[staffId]).length - 1;
                item = this.#previousMonthShiftList[staffId][preIndex];
            } else {
                item = this.#roster[staffId].shiftList[i];
            }
            result[i] = item;
        }
        return result;
    }
    #doAutoPlan = () => {
        let assignedShift = "";
        let finalResult = {};
        let previousMonthShiftCount = (this.#systemParam.noOfPrevDate - this.startDate) + 1;
        let availableShiftList = {};
        let isAssigned = false;
        this.#staffIdList.forEach(staffId => {
            finalResult[staffId] = {
                availableShiftList: this.#roster[staffId].availableShiftList,
                workingHourPerDay: this.#roster[staffId].workingHourPerDay,
                shiftList: this.#buildTempResult(staffId, previousMonthShiftCount)
            }
            availableShiftList[staffId] = this.#buildAvailableShift(staffId);
            //console.log(staffId,finalResult[staffId].shiftList);
        });
        for (let dateOfMonth = this.startDate; dateOfMonth <= this.endDate; dateOfMonth++) {
            assignedShift = "";
            let shuffledStaffIdList = structuredClone(this.#staffIdList);
            Utility.shuffleArray(shuffledStaffIdList);
            isAssigned = false;
            for (let i = 0; i < shuffledStaffIdList.length; i++) {
                let staffId = shuffledStaffIdList[i];
                let itoAvailableShift = availableShiftList[staffId][dateOfMonth];

                isAssigned = false;
                for (let j = 0; j < itoAvailableShift.length; j++) {
                    let shift = itoAvailableShift[j];
                    if (this.#isAssignable(assignedShift, dateOfMonth, staffId, finalResult[staffId], shift)) {
                        finalResult[staffId].shiftList[dateOfMonth] = shift;
                        assignedShift += shift;
                        isAssigned = true;
                        break;
                    }
                }
                if (!isAssigned) {
                    if (this.#roster[staffId].dutyPattern === "operator") {
                        finalResult[staffId].shiftList[dateOfMonth] = "O";
                    } else {
                        finalResult[staffId].shiftList[dateOfMonth] = "";
                    }
                }
            }
        }
        for (const [staffId, rosterObj] of Object.entries(finalResult)) {
            let dateList = Object.keys(rosterObj.shiftList);
            dateList.sort((a, b) => {
                let result;
                switch (true) {
                    case (Number(a) > Number(b)):
                        result = 1;
                        break;
                    case (Number(a) < Number(b)):
                        result = -1;
                        break;
                    default:
                        result = 0;
                        break
                }
                return result;
            });
            for (let i = 0; i < this.#systemParam.noOfPrevDate; i++) {
                delete finalResult[staffId].shiftList[dateList[i]];
            }
        }
        return finalResult;
    }
    #getNoOfWorkingDay = (dateOfMonth, shiftList) => {
        let count = 0;
        for (let i = this.startDate; i < dateOfMonth; i++) {
            if (shiftList[i]) {
                let shiftObj = shiftList[i];
                if (this.#essentialShift.indexOf(shiftObj) > -1) {
                    count++
                }
            }
        }
        return count
    }
    #isAssignable = (assignedShift, dateOfMonth, staffId, staffRoster, targetShift) => {
        let result = false;
        let rosterObj = this.#roster[staffId];
        //console.log("staffId=" + staffId + ",dateOfMonth=" + dateOfMonth + ",isUnderMaxConsecutiveWorkingDay=" + this.#isUnderMaxConsecutiveWorkingDay(staffRoster.shiftList, dateOfMonth) + ",noOfWorkingDay=" + this.#getNoOfWorkingDay(dateOfMonth, staffRoster.shiftList));

        if (rosterObj.dutyPattern === "operator") {
            switch (targetShift) {
                case "d":
                case "d1":
                case "d2":
                case "d3":
                case "O":
                    result = true;
                    break;
                default:
                    let preShift, temp;
                    if (assignedShift.indexOf(targetShift) === -1) {
                        if (this.#getNoOfWorkingDay(dateOfMonth, staffRoster.shiftList) < this.#noOfWorkingDay) {
                            if (this.#isUnderMaxConsecutiveWorkingDay(dateOfMonth, staffRoster.shiftList)) {
                                if (this.#essentialShift.indexOf(targetShift) > -1) {
                                    preShift = Utility.buildPreShift(dateOfMonth, this.#essentialShift, staffRoster, this.#systemParam);
                                    temp = preShift + "," + targetShift;
                                    if (!Utility.isBlackListShift(this.#blackListShiftPattern, staffId, temp)) {
                                        result = true;
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
        }
        return result;
    }
    #isUnderMaxConsecutiveWorkingDay = (dateOfMonth, shiftList) => {
        let count = 0;
        let result = true;
        let firstIndex = dateOfMonth - this.#systemParam.maxConsecutiveWorkingDay;
        if (shiftList[firstIndex]) {
            for (let i = firstIndex; i < dateOfMonth; i++) {
                //console.log(firstIndex, shiftList[i]);
                if (shiftList[i]) {
                    switch (shiftList[i]) {
                        case "d":
                        case "d1":
                        case "d2":
                        case "d3":
                        case "O":
                            count--;
                            break;
                        default:
                            if (this.#essentialShift.indexOf(shiftList[i]) > -1) {
                                count++
                            }
                            break;
                    }
                }
            }
            result = (count < this.#systemParam.maxConsecutiveWorkingDay);
        }
        return result;
    }
    #processPreferredShiftList = (staffId, dateOfMonth) => {
        let result = [];
        let temp = this.#preferredShiftList[staffId][dateOfMonth];
        temp = temp.trim();
        if (temp.startsWith("n")) {
            result = this.#roster[staffId].availableShiftList.filter(shift => {
                let bResult = true
                for (let j = 1; j < temp.length; j++) {
                    if ((shift === temp[j]) || (this.#essentialShift.indexOf(shift) === -1)) {
                        bResult = false;
                    }
                }
                return bResult;
            });
        } else {
            result = this.#roster[staffId].availableShiftList.filter(shift => {
                let aResult = false;
                switch (true) {
                    case (shift === temp):
                        aResult = true;
                        break;
                    case ((shift === "b") && (temp.startsWith("b"))):
                        aResult = true;
                        break;
                    case (((shift === "d") || (shift === "d1") || (shift === "d2") || (shift === "d3")) && (temp === "al")):
                        aResult = true;
                        break;
                    case ((shift === "O") && (temp === "o")):
                        aResult = true;
                        break;
                    default:
                        break;
                }
                return aResult;
            });
        }
        return result
    }
}

