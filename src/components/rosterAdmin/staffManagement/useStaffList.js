import { useEffect, useReducer } from "react";
import Staff from "../../../dataUtil/Staff";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.staffList = action.staffList;
            result.isLoading = false;
            break
        case "setError":
            result.error = action.error;
            break;
        default:
            break;
    }
    return result;
}
export function useStaffList() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        staff: new Staff(),
        staffList: {}
    });
    useEffect(() => {
        let getData = async () => {
            try {
                let staffList = await itemList.staff.getStaffList();
                updateItemList({
                    staffList,
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
        error: itemList.error,
        isLoading: itemList.isLoading,
        staffList: itemList.staffList,
    }
}