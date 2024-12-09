export default function Staff(){
    return {
        availableShift: ["a","b","c","d1","O"],
        blackListedShiftPattern:[""],
        dutyPattern:"operator",        
        hkoAdUser:"",
        joinDate:(new Date()).toLocaleDateString("en-CA"),
        leaveDate:"2099-12-31",
        staffId:"",
        staffName:"",
        staffPost:"",
        workingHourPerDay:""
    }
}