import { useEffect, useReducer } from "react";
import NonStandardWorkingHourUtil from "../../../dataUtil/NonStandardWorkingHourUtil";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "init":
            result.month = action.month;
            result.list = action.list;
            result.isLoading = false;
            result.year = action.year;
            break
        case "setError":
            result.error = action.error;
            break;
        default:
            break;
    }
    return result;
}
export default function useNonStandardWorkingHourList() {
    const [itemList, updateItemList] = useReducer(reducer, {
        error: null,
        isLoading: true,
        month: 0,
        nonStandardWorkingHourUtil: new NonStandardWorkingHourUtil(),
        list: {},
        year: 0
    });
    useEffect(() => {
        let getData = async () => {
            try {
                let now = new Date();
                //let year = now.getFullYear();
                //let month = now.getMonth();
                let month=8;
                let year=2024;

                let list = await itemList.nonStandardWorkingHourUtil.getNonStandardWorkingHourList(year, month);
                updateItemList({
                    month,
                    list,
                    type: "init",
                    year
                });
            } catch (error) {
                console.log(error);
                updateItemList({ "error": error, "type": "setError" });
            }
        }
        getData();
    }, []);
    return {
        error:itemList.error,
        isLoading:itemList.isLoading,
        list:itemList.list,
        month:itemList.month,
        year:itemList.year
    }
}