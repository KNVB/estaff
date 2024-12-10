import { useEffect, useReducer } from "react";
import RosterSchedulerData from "../../../dataUtil/RosterSchedulerData";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "hideLoading":
            result.isLoading = false;
            break;
        case "init":
            result.rosterSchedulerData = action.rosterSchedulerData;
            result.isLoading = false;
            break;
        case "refresh":
            result.isLoading = false;
            break;
        case "setError":
            result.error = action.error;
            break;
        case "showLoading":
            result.isLoading = true;
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useRosterScheduler() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        rosterSchedulerData: null
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let rosterSchedulerData = new RosterSchedulerData();
            try {
                await rosterSchedulerData.load(2024, 9);
                //await rosterSchedulerData.load(rosterYear, rosterMonth);
                console.log(rosterSchedulerData);
                updateItemList({
                    rosterSchedulerData,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    let copyRosterData = copyRegion => {
        copyRegion.column.end -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        copyRegion.column.start -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        itemList.rosterSchedulerData.copy(copyRegion);
        updateItemList({ type: "refresh" });
    }
    let clearAllShiftData = e => {
        console.log("clearAllShiftData");
        itemList.rosterSchedulerData.clearAllShiftData();
        updateItemList({ type: "refresh" });
    }
    let deleteSelectedData = (selectedLocation) => {
        selectedLocation.column.end -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        selectedLocation.column.start -= itemList.rosterSchedulerData.systemParam.noOfPrevDate;
        itemList.rosterSchedulerData.deleteSelectedData(
            selectedLocation,
            itemList.rosterSchedulerData.noOfWorkingDay,
            itemList.rosterSchedulerData.calendarDateList.length);
        updateItemList({ type: "refresh" });
    }
    let exportRosterDataToExcel = e => {
        console.log("exportRosterDataToExcel");
        itemList.rosterSchedulerData.exportRosterDataToExcel();
    }
    let fillEmptyShiftWithO = e => {
        console.log("fillEmptyShiftWithO");
        itemList.rosterSchedulerData.fillEmptyShiftWithO();
        updateItemList({ type: "refresh" });
    }
    let getCopyDataRowCount = () => {
        return itemList.rosterSchedulerData.getCopyDataRowCount();
    }
    let getShiftCssClassName = (staffId, shiftType) => {
        return itemList.rosterSchedulerData.getShiftCssClassName(staffId, shiftType);
    }
    let handleEscKeyEvent = () => {
        itemList.rosterSchedulerData.clearCopiedData();
        updateItemList({ type: "refresh" });
    }
    let hideLoading = () => {
        updateItemList({
            "type": "hideLoading"
        });
    }
    let isBlackListedShift = (dateOfMonth, staffId) => {
        return itemList.rosterSchedulerData.isBlackListedShift(dateOfMonth, staffId);
    }
    let isDuplicateShift = (dateOfMonth, staffId) => {
        return itemList.rosterSchedulerData.isDuplicateShift(dateOfMonth, staffId);
    }
    let load = newRosterData => {
        //console.log(newRosterData);
        itemList.rosterSchedulerData.updateShiftFromAutoPlan(newRosterData);
        updateItemList({ type: "refresh" });
    }
    let paste = (dateOfMonth, rosterRowIdList, selectedLocation) => {
        itemList.rosterSchedulerData.paste(dateOfMonth, rosterRowIdList, selectedLocation);
        updateItemList({ type: "refresh" });
    }
    let reDo = () => {
        itemList.rosterSchedulerData.reDo();
        updateItemList({ type: "refresh" });
    }
    let saveRosterToDB = async () => {
        try {
            showLoading();
            await itemList.rosterSchedulerData.saveToDB();
            alert("Roster Data is saved to DB successfully.");
        } catch (error) {
            updateItemList({ "error": error, "type": "setError" });
        } finally {
            hideLoading();
        }
    }
    let showLoading = () => {
        updateItemList({ "type": "showLoading" });
    }
    let updateRosterMonth = async newRosterMonth => {
        try {
            updateItemList({ "type": "showLoading" });
            await itemList.rosterSchedulerData.reload(newRosterMonth);
            updateItemList({
                type: "refresh"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        } finally {
            hideLoading();
        }
    }
    let updateShiftFromAutoPlan = planResult => {
        itemList.rosterSchedulerData.updateShiftFromAutoPlan(planResult);
        updateItemList({ "type": "refresh" });
    }
    let updatePreferredShiftFromTable = (itoId, date, newPreferredShift) => {
        itemList.rosterSchedulerData.updatePreferredShiftFromTable(itoId, date, newPreferredShift);
        updateItemList({ "type": "refresh" });
    }
    let updateShiftFromTable = (staffId, date, newShift) => {
        itemList.rosterSchedulerData.updateShiftFromTable(staffId, date, newShift);
        updateItemList({ "type": "refresh" });
    }
    let unDo = () => {
        itemList.rosterSchedulerData.unDo();
        updateItemList({ type: "refresh" });
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        rosterSchedulerData: itemList.rosterSchedulerData,
        dataAction: {
            clearAllShiftData,
            copyRosterData,
            deleteSelectedData,
            exportRosterDataToExcel,
            fillEmptyShiftWithO,
            getCopyDataRowCount,
            getShiftCssClassName,
            handleEscKeyEvent,
            hideLoading,
            isBlackListedShift,
            isDuplicateShift,
            load,
            paste,
            reDo,
            saveRosterToDB,
            showLoading,
            updatePreferredShiftFromTable,
            updateRosterMonth,
            updateShiftFromAutoPlan,
            updateShiftFromTable,
            unDo
        }
    }
}