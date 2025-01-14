import { useEffect, useReducer } from "react";
import AutoPlanner from "../../../../dataUtil/AutoPlanner";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.autoPlanner.setRosterSchedulerData(action.rosterSchedulerData);
            result.isReady = true;
            break;
        case "updateEndDate":
            result.autoPlanner.endDate = parseInt(action.value);
            break;
        case "updateIterationCount":
            result.iterationCount = action.value;
            break;
        case "updatePlanResult":
            result.planResult = structuredClone(action.planResult);
            break;
        case "updateStartDate":
            result.autoPlanner.startDate = parseInt(action.value);
            break;
        default:
            break;
    }
    //console.log(result);
    return result;
}
export default function useAutoPlanForm(rosterSchedulerData, dataAction) {
    const [itemList, updateItemList] = useReducer(reducer, {
        autoPlanner: new AutoPlanner(1, rosterSchedulerData.calendarDateList.length),
        isReady: false,
        iterationCount: 1,
        planResult: []
    });
    useEffect(() => {
        updateItemList({
            rosterSchedulerData,
            "type": "init"
        });
    }, [rosterSchedulerData, dataAction]);
    let autoPlan = () => {
        dataAction.showLoading();
        let temp = [];
        for (let i = 0; i < itemList.iterationCount; i++) {
            let tempResult = itemList.autoPlanner.start();
            temp.push(tempResult);
        }        
        temp.sort((a, b) => {
            let result;
            switch (true) {
                case (Object.keys(a.vacantShiftList).length > Object.keys(b.vacantShiftList).length):
                    result = 1;
                    break;
                case (Object.keys(a.vacantShiftList).length < Object.keys(b.vacantShiftList).length):
                    result = -1;
                    break;
                default:
                    result = 0;
                    break;
            }
            return result;
        });
        let planResult = [];
        for (let i = 0; i < 3; i++) {
            if (temp[i]) {
                planResult.push(temp[i]);
            }
        }
        updateItemList({
            planResult,
            "type": "updatePlanResult",
        });
        dataAction.hideLoading();
    }
    let updateEndDate = e => {
        updateItemList({
            "type": "updateEndDate",
            "value": e.target.value
        });
    }
    let updateIterationCount = e => {
        updateItemList({
            "type": "updateIterationCount",
            "value": e.target.value
        });
    }
    let updateStartDate = e => {
        updateItemList({
            "type": "updateStartDate",
            "value": e.target.value
        });
    }
    return {
        planResult: itemList.planResult,
        startDate: itemList.autoPlanner.startDate,
        endDate: itemList.autoPlanner.endDate,
        isReady: itemList.isReady,
        iterationCount: itemList.iterationCount,
        action: {
            autoPlan,
            updateEndDate,
            updateIterationCount,
            updateStartDate
        }
    }
}