export default function Staff(){
    return {
        availableShift: ["a","b","c","d1","O"],
        blackListedShiftPattern:[""],
        dutyPattern:"operator",
        staffId:"",
        joinDate:(new Date()).toLocaleDateString("en-CA"),
        leaveDate:"2099-12-31",
        staffName:"",
        staffPost:"",
        workingHourPerDay:""
    }
}