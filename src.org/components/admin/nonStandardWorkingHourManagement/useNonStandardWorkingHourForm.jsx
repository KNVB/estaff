import { useReducer } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import NonStandardWorkingHourUtil from "../../../dataUtil/NonStandardWorkingHourUtil";
import Utility from "../../../util/Utility";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "setDescription":
            result.record.description = action.description;
            break;
        case "setEndTime":
            result.record.endTime = action.endTime;
            result.record.durationInHour = Utility.getDurationInHour(result.record.startTime, result.record.endTime).toFixed(2);
            break;
        case "setStartTime":
            result.record.startTime = action.startTime;
            result.record.durationInHour = Utility.getDurationInHour(result.record.startTime, result.record.endTime).toFixed(2);
            break;
        default:
            break;
    }
    return result;
}
export default function useNonStandardWorkingHourForm() {
    let data = useLocation();
    let navigate = useNavigate();
    //console.log(data.state);
    const [itemList, updateItemList] = useReducer(reducer, {
        nonStandardWorkingHourUtil: new NonStandardWorkingHourUtil(),
        record: data.state.record
    });
    let backToRecordlList = e => {
        navigate("../nonStandardWorkingHourManagement/list");
    }
    let deleteRecord=async id=>{
        if (confirm("Are you sure to delete this record?")){
            await itemList.nonStandardWorkingHourUtil.deleteRecord(id);
            backToRecordlList();
        }
    }
    let setDescription = desc => {
        updateItemList({
            "description":desc,
            "type": "setDescription"
        });
    }
    let setEndTime = endTime => {
        updateItemList({
            endTime,
            "type": "setEndTime"
        });
    }
    let setStartTime = startTime => {
        updateItemList({
            startTime,
            "type": "setStartTime"
        });
    }
    let submit=async (action)=>{
        switch (action) {
            case "add":
                await itemList.nonStandardWorkingHourUtil.addRecord(itemList.record);
                alert("A non standard working hour record is added.");
                backToRecordlList();
                break;
            case "edit":
                await itemList.nonStandardWorkingHourUtil.updateRecord(itemList.record);                
                alert("The non standard working hour record is updated.");
                backToRecordlList();
                break;
            default:
                break;    
        }
    }
    return {
        record: itemList.record,
        formAction: {
            backToRecordlList,
            deleteRecord,
            setDescription,
            setEndTime,
            setStartTime,
            submit
        }
    }
}