import { useEffect, useReducer } from "react";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "updateResult":
            temp = genObj(new Date(action.newValue.getTime()));
            temp.selectedItem = result.selectedItem;
            result = temp;
            break;
        case "updateSelectedItem":
            result.selectedItem = action.item;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
let genObj = value => {
    let timeString = timeFormatter.format(value);
    return {
        aPM: timeString.substring(timeString.length - 2).toUpperCase().trim(),
        hour: timeString.substring(0, 2),
        minute: timeString.substring(3, 5),
        result: value
    }
}
let timeFormatter = new Intl.DateTimeFormat('en-ZA', {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit"
});
export default function useTimeSelector(defaultValue) {
    let temp = defaultValue ?? new Date();
    let initObj = genObj(temp);
    initObj.selectedItem = "hour";
    //console.log(defaultValue);
    const [itemList, updateItemList] = useReducer(reducer, initObj);
    useEffect(() => {
        updateItemList({ "newValue": defaultValue, "type": "updateResult" })
    }, [defaultValue]);
    let downHour = () => {
        let temp = new Date(itemList.result);
        temp.setHours(temp.getHours() - 1);
        return temp;
    }
    let downMin = () => {
        let temp = new Date(itemList.result);
        temp.setMinutes(temp.getMinutes() - 1);
        return temp;
    }
    let toggleAPM = () => {
        let timeString = timeFormatter.format(itemList.result);
        let aPM = timeString.substring(timeString.length - 2).toUpperCase().trim();
        let temp = new Date(itemList.result.getTime());
        if (aPM === "AM") {
            temp.setHours(temp.getHours() + 12);
        } else {
            temp.setHours(temp.getHours() - 12);
        }
        return temp
    }
    let updateSelectedItem = item => {
        updateItemList({
            "item": item,
            "type": "updateSelectedItem"
        })
    };
    let updateTimeFieldValue = (fieldName, value) => {
        console.log(fieldName, value);
        let difference;
        let temp = new Date(itemList.result);
        switch (fieldName) {
            case "hour":
                difference = itemList.hour - value;
                temp.setHours(temp.getHours() - difference);
                break;
            case "minute":
                difference = itemList.minute - value;
                temp.setMinutes(temp.getMinutes() - difference);
                break;
            default:
                break
        }
        return temp;
    }
    let upHour = () => {
        let temp = new Date(itemList.result);
        temp.setHours(temp.getHours() + 1);
        return temp;
    }
    let upMin = () => {
        let temp = new Date(itemList.result);
        temp.setMinutes(temp.getMinutes() + 1);
        return temp;
    }

    return {
        aPM: itemList.aPM,
        hour: itemList.hour,
        minute: itemList.minute,
        selectedItem: itemList.selectedItem,
        action: {
            downHour,
            downMin,
            timeFormatter,
            toggleAPM,
            upHour,
            upMin,
            updateSelectedItem,
            updateTimeFieldValue
        }
    }
}