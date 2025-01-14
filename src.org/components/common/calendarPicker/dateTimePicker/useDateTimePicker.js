import { useEffect, useReducer } from "react";
import Utility from "../Utility";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "closePicker":
            result.isShowPicker = false;
            break;
        case "init":
            result.hasNextMonth = action.hasNextMonth;
            result.hasNextYear = action.hasNextYear;
            result.hasPrevMonth = action.hasPrevMonth;
            result.hasPrevYear = action.hasPrevYear;
            result.maxDate = action.maxDate;
            result.minDate = action.minDate;
            result.result = action.result;
            result.tempValue = action.result;
            result.monthlyCalendar = Utility.genMonthlyCalendar(action.result);
            break;
        case "updateTempValue":
            console.log(action);
            result.hasNextMonth = action.hasNextMonth;
            result.hasNextYear = action.hasNextYear;
            result.hasPrevMonth = action.hasPrevMonth;
            result.hasPrevYear = action.hasPrevYear;
            result.tempValue = action.newTempValue;
            result.monthlyCalendar = Utility.genMonthlyCalendar(action.newTempValue);
            break
        case "updateValue":
            result.hasNextMonth = action.hasNextMonth;
            result.hasNextYear = action.hasNextYear;
            result.hasPrevMonth = action.hasPrevMonth;
            result.hasPrevYear = action.hasPrevYear;
            result.result = action.newValue;
            result.monthlyCalendar = Utility.genMonthlyCalendar(action.newValue);
            break
        case "togglePicker":
            result.isShowPicker = !result.isShowPicker;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useDateTimePicker(defaultValue, maxDate, minDate) {
    let initObj = {
        isShowPicker: false,
        hasNextMonth: true,
        hasNextYear: true,
        hasPrevMonth: true,
        hasPrevYear: true,
        maxDate: null,
        minDate: null,
        monthFullNameList: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        monthlyCalendar: Utility.genMonthlyCalendar(defaultValue ?? new Date()),
        result: (defaultValue ?? new Date()),
        tempValue: (defaultValue ?? new Date()),
        weekDayNameList: ["Su", "M", "T", "W", "Th", "F", "S"]
    };

    const [itemList, updateItemList] = useReducer(reducer, initObj);
    useEffect(() => {
        if (Utility.isNull(defaultValue)) {
            defaultValue = new Date();
        }
        if (Utility.isNull(maxDate)) {
            maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 100);
        }
        if (Utility.isNull(minDate)) {
            minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - 100);
        }
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(defaultValue, maxDate, minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, maxDate, minDate, "result": defaultValue, "type": "init" });
    }, [defaultValue, maxDate, minDate])
    let closePicker = () => {
        updateItemList({ "type": "closePicker" })
    }
    let prevMonth = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setMonth(temp.getMonth() - 1);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "newTempValue": temp, "type": "updateTempValue" });
    }
    let prevYear = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setFullYear(temp.getFullYear() - 1);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "newTempValue": temp, "type": "updateTempValue" });
    }
    let nextMonth = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setMonth(temp.getMonth() + 1);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "newTempValue": temp, "type": "updateTempValue" });
    }
    let nextYear = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setFullYear(temp.getFullYear() + 1);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "newTempValue": temp, "type": "updateTempValue" });
    }
    let selectToday = () => {
        let temp = new Date();
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "newTempValue": temp, "type": "updateTempValue" });
    }
    let togglePicker = () => {
        updateItemList({ "type": "togglePicker" })
    }
    let updateDateValue = date => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setDate(date);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "newTempValue": temp, "type": "updateTempValue" });
    }
    let updateValue = date => {
        let temp = new Date(itemList.result.getTime());
        temp.setDate(date);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "newValue": temp, "type": "updateValue" });
    }
    let updateTempValue = dateObj => {
        let temp = new Date(dateObj.getTime());
        console.log(temp);
        let { hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear } = Utility.genPreNext(temp, itemList.maxDate, itemList.minDate);
        updateItemList({ hasNextMonth, hasNextYear, hasPrevMonth, hasPrevYear, "newTempValue": temp, "type": "updateTempValue" });
    }
    return {
        isShowPicker: itemList.isShowPicker,
        hasNextMonth: itemList.hasNextMonth,
        hasNextYear: itemList.hasNextYear,
        hasPrevMonth: itemList.hasPrevMonth,
        hasPrevYear: itemList.hasPrevYear,
        monthFullNameList: itemList.monthFullNameList,
        monthlyCalendar: itemList.monthlyCalendar,
        result: itemList.result,
        tempValue: itemList.tempValue,
        weekDayNameList: itemList.weekDayNameList,
        action: {
            closePicker,
            prevMonth,
            prevYear,
            nextMonth,
            nextYear,
            selectToday,
            togglePicker,
            updateDateValue,
            updateTempValue,
            updateValue,
        }
    }
}