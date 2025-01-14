export default class StaffRoster {
    constructor() {
        this.availableShiftList = [];
        this.dutyPattern = "";
        this.staffName = "";
        this.staffPost = "";
        this.joinDate=null;
        this.lastMonthBalance = 0.0;
        this.shiftList = {};
        this.thisMonthBalance = 0.0;
    }
}