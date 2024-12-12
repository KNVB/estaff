export default class Utility {
    static getEndDate(year,month){
        let tempDate = new Date(year + "-" + month + "-1");
        tempDate.setMonth(month);
        tempDate.setDate(0);
        return tempDate.getDate();
    }
    static getStartEndDateString(year, month) {
        let tempDate = new Date(year + "-" + month + "-1");
        let startDateString = tempDate.toLocaleDateString("en-CA");
        tempDate.setMonth(month);
        tempDate.setDate(0);
        let endDateString = tempDate.toLocaleDateString("en-CA");
        return { "startDateString": startDateString, "endDateString": endDateString };
    }
    static getUID(){
        let characters="abcdefghijklmnopqrstuvwxyz0123456789";
        let uid="";
        for (let i=0;i<10;i++){
            let index=Math.floor(Math.random() * (characters.length-1));
            uid+=characters[index];
        }
        return uid;    
    }    
}