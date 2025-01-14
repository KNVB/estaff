export default class Utility {
    static dateFormatter = new Intl.DateTimeFormat('en-ZA', {
        day: "2-digit",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    static genPreNext = (newValue, maxDate, minDate) => {
        let nextMonth = new Date(newValue.getFullYear(), newValue.getMonth() + 1, 1);
        let nextYear = new Date(newValue.getFullYear() + 1, 0, 1);
        let prevMonth = new Date(newValue.getFullYear(), newValue.getMonth() - 1, 1);
        /*******************************************************************
        * if the last day of the previous year does not within the range, *
        * the previous year button should be disabled.                    *
        *******************************************************************/
        let prevYear = new Date(newValue.getFullYear() - 1, 11, 31);

        /*******************************************************************
        * if the last day of the previous month does not within the range, *
        * the previous month button should be disabled.                    *
        *******************************************************************/
        prevMonth.setDate(prevMonth.getDate() - 1);
        let hasNextMonth = (nextMonth >= minDate && nextMonth <= maxDate);
        let hasNextYear = (nextYear >= minDate && nextYear <= maxDate)
        let hasPrevMonth = (prevMonth >= minDate && prevMonth <= maxDate);
        let hasPrevYear = (prevYear >= minDate && prevYear <= maxDate);

        return {
            hasNextMonth, hasNextYear,
            hasPrevMonth, hasPrevYear
        }
    }
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
    static genDateObj = (date, weekDay, selectedDate) => {
        let className = [];
        if (date === selectedDate.getDate()) {
            className.push("selectedItem");
        }
        switch (weekDay) {
            case 0:
            case 6:
                className.push("ph");
                break;
            default:
                break;
        }
        let result = { "value": date };
        if (className.length === 0) {
            result.className = null;
        } else {
            result.className = className.join(" ");
        }
        return result;
    }
    static genMonthlyCalendar = selectedDate => {
        let temp = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        /*
        console.log("===================");
        console.log("selectedDate:" + selectedDate);
        console.log("temp:" + temp);
        console.log("===================");
        */
        let monthEndDate = temp.getDate();
        let monthlyCalendar = { rowList: [] };
        temp = new Date(selectedDate.getTime());
        temp.setDate(1);
        let date = 1, firstWeekday = temp.getDay();
        let weekRow = [];
        for (let i = 0; i < firstWeekday; i++) {
            weekRow.push({ className: null, value: "" });
        }
        for (let i = firstWeekday; i <= 6; i++) {
            weekRow.push(Utility.genDateObj(date++, i, selectedDate));
        }
        monthlyCalendar.rowList.push(structuredClone(weekRow));
        weekRow = [];
        //console.log(monthlyCalendar);
        temp = new Date(selectedDate.getTime());
        while (date <= monthEndDate) {
            temp.setDate(date);
            weekRow.push(Utility.genDateObj(date++, temp.getDay(), selectedDate));
            if (temp.getDay() === 6) {
                monthlyCalendar.rowList.push(structuredClone(weekRow));
                weekRow = [];
            }
        }
        if (temp.getDay() < 6) {
            for (let i = temp.getDay(); i < 6; i++) {
                weekRow.push({ value: "" });
            }
            //weekRow[weekRow.length - 1].className = "ph";
            monthlyCalendar.rowList.push(structuredClone(weekRow));
        }
        //console.log(monthlyCalendar);
        return monthlyCalendar;
    }
}