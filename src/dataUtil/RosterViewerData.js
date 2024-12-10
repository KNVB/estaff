import FetchAPI from "../util/FetchAPI";
import CalendarUtility from "../util/calendar/CalendarUtility";
import Utility from "../util/Utility";
export default class RosterViewerData {
    #calendarUtility;
    constructor() {
        this.#calendarUtility = new CalendarUtility();
    }
    getShiftCssClassName(staffId, shiftType) {
        let availableShiftList = this.roster[staffId].availableShiftList;        
        if (availableShiftList.includes(shiftType)) {
            if (this.activeShiftList[shiftType])
                return this.activeShiftList[shiftType].cssClassName;
        }
        return "";
    }
    async load(year, month) {
        let monthlyCalendar = this.#calendarUtility.getMonthlyCalendar(year, month);
        let fetchAPI = new FetchAPI();
        let temp = await fetchAPI.getRosterViewerData(year, month + 1);
        this.activeShiftList = structuredClone(temp.activeShiftList);
        this.calendarDateList = monthlyCalendar.calendarDateList;
        this.nonStandardWorkingHourSummary = structuredClone(temp.nonStandardWorkingHourSummary);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
        this.rosterMonth = new Date(year, month, 1);
        this.systemParam = structuredClone(temp.systemParam);
        this.systemParam.monthPickerMinDate = new Date(this.systemParam.monthPickerMinDate);
        this.systemParam.noOfPrevDate = 0;
        let rosterData = structuredClone(temp.rosterData);
        this.roster = Utility.initRoster(monthlyCalendar, rosterData, this.rosterMonth);
        Utility.updateStaffStat(this.activeShiftList, this.roster, this.nonStandardWorkingHourSummary);
        //console.log(this.roster);
    }
    async reload(newRosterMonth) {
        let fetchAPI = new FetchAPI();
        let rosterYear = newRosterMonth.getFullYear(), rosterMonth = newRosterMonth.getMonth();
        let monthlyCalendar = this.#calendarUtility.getMonthlyCalendar(rosterYear, rosterMonth);
        let temp = await fetchAPI.getRosterViewerData(rosterYear, rosterMonth + 1);
        this.calendarDateList = monthlyCalendar.calendarDateList;
        this.nonStandardWorkingHourSummary = structuredClone(temp.nonStandardWorkingHourSummary);
        this.noOfWorkingDay = monthlyCalendar.noOfWorkingDay;
        this.rosterMonth = new Date(rosterYear, rosterMonth, 1);
        let rosterData = structuredClone(temp.rosterData);
        this.roster = Utility.initRoster(monthlyCalendar, rosterData, this.rosterMonth);
        Utility.updateStaffStat(this.activeShiftList, this.roster, this.nonStandardWorkingHourSummary);
    }
}