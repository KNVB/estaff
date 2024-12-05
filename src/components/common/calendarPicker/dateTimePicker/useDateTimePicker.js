import { useEffect, useReducer } from "react";
import Utility from "../Utility";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "closePicker":
            result.isShowPicker = false;
            break;
        case "init":
            result.result = action.result;
            result.tempValue = action.result;
            result.monthlyCalendar = Utility.genMonthlyCalendar(action.result);
            break;
        case "updateTempValue":
            console.log(action);
            result.tempValue = action.newTempValue;
            result.monthlyCalendar = Utility.genMonthlyCalendar(action.newTempValue);
            break
        case "updateValue":
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
export default function useDateTimePicker(defaultValue) {
    let initObj = {
        isShowPicker: false,
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
        monthlyCalendar: genMonthlyCalendar(defaultValue ?? new Date()),
        result: (defaultValue ?? new Date()),
        tempValue: (defaultValue ?? new Date()),
        weekDayNameList: ["Su", "M", "T", "W", "Th", "F", "S"]
    };

    const [itemList, updateItemList] = useReducer(reducer, initObj);
    useEffect(() => {
        updateItemList({ "result": defaultValue, "type": "init" });
    }, [defaultValue])
    let closePicker = () => {
        updateItemList({ "type": "closePicker" })
    }
    let prevMonth = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setMonth(temp.getMonth() - 1);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let prevYear = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setFullYear(temp.getFullYear() - 1);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let nextMonth = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setMonth(temp.getMonth() + 1);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let nextYear = () => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setFullYear(temp.getFullYear() + 1);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let selectToday = () => {
        let temp = new Date();
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let togglePicker = () => {
        updateItemList({ "type": "togglePicker" })
    }
    let updateDateValue = date => {
        let temp = new Date(itemList.tempValue.getTime());
        temp.setDate(date);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    let updateValue = date => {
        let temp = new Date(itemList.result.getTime());
        temp.setDate(date);
        updateItemList({ "newValue": temp, "type": "updateValue" });
    }
    let updateTempValue = dateObj => {
        let temp = new Date(dateObj.getTime());
        console.log(temp);
        updateItemList({ "newTempValue": temp, "type": "updateTempValue" });
    }
    return {
        isShowPicker: itemList.isShowPicker,
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