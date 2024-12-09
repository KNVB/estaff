import { useEffect, useReducer } from "react";
import RosterSchedulerTableUtil from "../../../dataUtil/RosterSchedulerTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterSchedulerTableUtil.init(
                action.calendarDateList,
                action.staffIdList,
                action.systemParam);
            break
        default:
            break;
    }
    return result;
}
export default function useRosterSchedulerTable (rosterSchedulerData) {
    const [itemList, updateItemList] = useReducer(reducer, {
        rosterSchedulerTableUtil: new RosterSchedulerTableUtil(),
    });
    useEffect(()=>{
        if (rosterSchedulerData){
            updateItemList({
                calendarDateList:rosterSchedulerData.calendarDateList,
                staffIdList:rosterSchedulerData.staffIdList,
                systemParam:rosterSchedulerData.systemParam,
                "type":"init"
            })
        }
    },[rosterSchedulerData]);
    let endSelect = () => {
        itemList.rosterSchedulerTableUtil.endSelect();
        updateItemList({ type: "refresh" });
    }
    let getCopyRegionLocation = () => {
        return itemList.rosterSchedulerTableUtil.getCopyRegionLocation();
    }
    let getRosterRowIdList=()=>{
        return itemList.rosterSchedulerTableUtil.rosterRowIdList;
    }
    let getRowIndex = rowName => {
        return itemList.rosterSchedulerTableUtil.getRowIndex(rowName);
    }
    let getSelectedCssClass = (cellIndex, rowIndex) => {
        return itemList.rosterSchedulerTableUtil.getSelectedCssClass(cellIndex, rowIndex);
    }
    let getSelectedLocation = () =>{
        return itemList.rosterSchedulerTableUtil.getSelectedLocation();
    }
    let handleArrowKeyEvent=(cell, xOffset, yOffset)=>{
        let nextCell = itemList.rosterSchedulerTableUtil.getNextCell(cell, xOffset, yOffset);
        itemList.rosterSchedulerTableUtil.selectCell(nextCell.cellIndex, nextCell.rowIndex);
        itemList.rosterSchedulerTableUtil.select(nextCell.cellIndex, nextCell.rowIndex);
        updateItemList({ type: "refresh" });
    }
    let handleEscKeyEvent = () => {
        itemList.rosterSchedulerTableUtil.clearCopiedRegion();        
        updateItemList({ type: "refresh" });
    }
    let isHighLightCol = cellIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightCol(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterSchedulerTableUtil.isHighLightRow(rowIndex);
    }
    let setFocusCell =e =>{
        return itemList.rosterSchedulerTableUtil.setFocusCell(e);
    }
    let startSelect = e => {
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        //console.log(cell.cellIndex, rowIndex)
        e.preventDefault();
        itemList.rosterSchedulerTableUtil.selectCell(cell.cellIndex, rowIndex);
        itemList.rosterSchedulerTableUtil.startSelect(cell.cellIndex, rowIndex);
        updateItemList({ type: "refresh" });
    }
    let updateHighLightCell = (cellIndex, rowIndex) => {
        itemList.rosterSchedulerTableUtil.updateHighLightCell(cellIndex, rowIndex);
        updateItemList({ cellIndex, rowIndex, type: "refresh" });
    }
    return {
        endSelect,
        getCopyRegionLocation,
        getRosterRowIdList,
        getRowIndex,
        getSelectedCssClass,
        getSelectedLocation,
        handleArrowKeyEvent,
        handleEscKeyEvent,
        isHighLightCol,
        isHighLightRow,
        setFocusCell,
        startSelect,
        updateHighLightCell
    }
}