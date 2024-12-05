export default class Utility{
    static dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    static isNull = obj => {
        if ((obj === undefined) || (obj === null)) {
            return true
        }
        return false
    }
    static isWithinTheRange = (thisDate, maxDate, minDate) => {
        return thisDate >= minDate && thisDate <= maxDate;
    };
    static monthNameList = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
}