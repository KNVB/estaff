import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import ActiveShiftList from "../../../dataUtil/ActiveShiftList";
import StaffUtil from "../../../dataUtil/StaffUtil";
let reducer = (state, action) => {
    let result = { ...state };
    let temp;
    switch (action.type) {
        case "addShiftPattern":
            temp = JSON.parse(JSON.stringify(result.staffInfo.blackListedShiftPattern));
            temp.push("");
            result.staffInfo.blackListedShiftPattern = temp;
            break;
        case "init":
            result.activeShiftList = action.activeShiftList;
            result.isLoading = false;
            break
        case "removeShiftPattern":
            temp = [];
            result.staffInfo.blackListedShiftPattern.forEach((pattern, index) => {
                if (index !== action.index) {
                    temp.push(pattern);
                }
            });
            result.staffInfo.blackListedShiftPattern = temp;
        case "setError":
            result.error = action.error;
            break;
        case "updateAvailableShift":
            result.staffInfo.availableShift = action.value;
            break
        case "updateDate":
            result.staffInfo[action.fieldName] = action.value;
            break;
        case "updateDutyPattern":
            result.staffInfo.dutyPattern = action.value;
            result.staffInfo.availableShift = action.availableShift;
            break
        case "updateShiftPattern":
            temp = JSON.parse(JSON.stringify(result.staffInfo.blackListedShiftPattern));
            temp[action.index] = action.value;
            result.staffInfo.blackListedShiftPattern = temp;
            break;
        case "updateTextField":
            result.staffInfo[action.fieldName] = action.value;
            break;
        default:
            break;
    }
    return result;
}
export function useStaffForm() {
    let data = useLocation();
    let navigate = useNavigate();
    const [itemList, updateItemList] = useReducer(reducer, {
        activeShiftList: null,
        isLoading: true,
        staffInfo: data.state.staff,
        staffUtil: new StaffUtil(),
        error: null,
    });
    let addShiftPattern = () => {
        updateItemList({ type: "addShiftPattern" });
    }
    let backToITOlList = e => {
        navigate("../staffManagement/list");
    }
    let doUpdate = async (form, action) => {
        if (form.reportValidity()) {
            if (isAvailableShiftValid()) {
                switch (action) {
                    case "add":
                        await itemList.staffUtil.addStaffInfo(itemList.staffInfo);
                        alert("A New Staff Info is added.");
                        backToITOlList();
                        break;
                    case "edit":
                        await itemList.staffUtil.updateStaffInfo(itemList.staffInfo);
                        alert("The Staff info. has been saved.");
                        backToITOlList();
                        break;
                    default:
                        break;
                }
            }
        }
    }
    let isAvailableShiftValid = () => {
        let result = false;
        let isIncludeAShift = itemList.staffInfo.availableShift.includes("a");
        let isIncludeBxShift = itemList.staffInfo.availableShift.includes("b") || itemList.staffInfo.availableShift.includes("b1");
        let isIncludeCShift = itemList.staffInfo.availableShift.includes("c");
        let isIncludeDxShift = itemList.staffInfo.availableShift.includes("d") || itemList.staffInfo.availableShift.includes("d1") || itemList.stafInfo.availableShift.includes("d2") || itemList.staffInfo.availableShift.includes("d3");

        if (itemList.staffInfo.dutyPattern === "day") {
            if (!isIncludeDxShift) {
                alert("Missing dx shift in available shift.");
                return result
            }
            return true
        } else {
            if (itemList.staffInfo.dutyPattern === "operator") {
                if (!isIncludeAShift) {
                    alert("Missing A Shift in available shift.");
                    return result
                }
                if (!isIncludeBxShift) {
                    alert("Missing bx Shift in available shift.");
                    return result
                }
                if (!isIncludeCShift) {
                    alert("Missing c Shift in available shift.");
                    return result
                }
                if (!isIncludeDxShift) {
                    alert("Missing dx Shift in available shift.");
                    return result
                }
                return true
            }
        }
    }
    let removeShiftPattern = index => {
        updateItemList({
            index: index,
            type: "removeShiftPattern"
        });
    }
    let updateAvailableShift = e => {
        let temp;
        let field = e.target;
        if (field.checked) {
            temp = JSON.parse(JSON.stringify(itemList.staffInfo.availableShift));
            temp.push(field.value);
        } else {
            temp = itemList.staffInfo.availableShift.filter(shift => shift !== field.value);
        }
        updateItemList({ type: "updateAvailableShift", value: temp });
    }
    let updateDate = (fieldName, value) => {
        updateItemList({
            fieldName,
            "value": value.toLocaleDateString("en-CA"),
            type: "updateDate"
        });
    }
    let updateDutyPattern = e => {
        let availableShift = ["a", "b", "c", "d1", "d2", "O"];
        let value = e.target.value;
        if (value === "day") {
            availableShift = ["d1", "d2", "O"];
        }
        updateItemList({
            availableShift,
            type: "updateDutyPattern",
            value
        });
    }
    let updateShiftPattern = e => {
        let field = e.target;
        let index = Number(field.name.replace("blackListedShiftPattern_", ""));
        updateItemList({
            index: index,
            value: field.value,
            type: "updateShiftPattern"
        });
    }
    let updateTextField = e => {
        let field = e.target;
        updateItemList({
            fieldName: field.name,
            value: field.value,
            type: "updateTextField"
        })
    }
    useEffect(() => {
        let getData = async () => {
            try {
                let activeShiftList = await ActiveShiftList();
                updateItemList({
                    activeShiftList,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    return {
        activeShiftList: itemList.activeShiftList,
        addShiftPattern,
        backToITOlList,
        doUpdate,
        error: itemList.error,
        isLoading: itemList.isLoading,
        removeShiftPattern,
        staffInfo: itemList.staffInfo,
        updateAvailableShift,
        updateDate,
        updateDutyPattern,
        updateShiftPattern,
        updateTextField
    }
}