import { useEffect, useReducer } from "react";
import RosterViewerData from "../../dataUtil/RosterViewerData";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.rosterViewerData = action.rosterViewerData;
            result.isLoading = false;
            break;
        case "refresh":
            result.isLoading = false;
            break;
        case "showLoading":
            result.isLoading =true;
            break;
        default:
            break;
    }   
    return result;
}
export default function useRosterViewer() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        rosterViewerData: null
    });
    useEffect(() => {
        let getData = async () => {
            let now = new Date();
            let rosterYear = now.getFullYear();
            let rosterMonth = now.getMonth();
            let rosterViewerData = new RosterViewerData();
            try {
                //await rosterViewerData.load(rosterYear, rosterMonth);
                //await rosterViewerData.load(2018, 8);  
                await rosterViewerData.load(2024, 9);
                updateItemList({
                    rosterViewerData,
                    type: "init"
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    let getShiftCssClassName = shiftType => {
        return itemList.rosterViewerData.getShiftCssClassName(shiftType);
    }
    let updateRosterMonth = async newRosterMonth => {
        try {
            updateItemList({"type":"showLoading"});
            await itemList.rosterViewerData.reload(newRosterMonth);
            updateItemList({
                type: "refresh"
            });
        } catch (error) {
            console.log(error);
            updateItemList({ "error": error, "type": "setError" });
        }
    }
    return {
        error: itemList.error,
        isLoading: itemList.isLoading,
        isShowShiftDetail: itemList.isShowShiftDetail,
        rosterViewerData: itemList.rosterViewerData,
        selectedShift: itemList.selectedShift,
        dataAction: {
            getShiftCssClassName,         
            updateRosterMonth
        }
    }
}