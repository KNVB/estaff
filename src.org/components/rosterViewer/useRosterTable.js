import { useReducer } from "react";
import RosterTableUtil from "../../dataUtil/RosterTableUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        default:
            break;
    }
    return result;
}
export default function useRosterTable() {
    const [itemList, updateItemList] = useReducer(reducer, {
        rosterTableUtil: new RosterTableUtil(),
    });
    let isHighLightCol = cellIndex => {
        return itemList.rosterTableUtil.isHighLightCol(cellIndex);
    }
    let isHighLightRow = rowIndex => {
        return itemList.rosterTableUtil.isHighLightRow(rowIndex);
    }
    let updateHighLightCell = (cellIndex, rowIndex) => {
        itemList.rosterTableUtil.updateHighLightCell(cellIndex, rowIndex);
        updateItemList({ cellIndex, rowIndex, type: "refresh" });
    }
    return {
        isHighLightCol,
        isHighLightRow,
        updateHighLightCell
    }
}