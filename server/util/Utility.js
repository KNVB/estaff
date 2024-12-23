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
        let tokenLen = 10;
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < tokenLen; ++i)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }    
}