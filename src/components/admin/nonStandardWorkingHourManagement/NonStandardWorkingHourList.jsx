import handleAPIError from "../../common/handleAPIError.jsx";
import Loading from "../../common/Loading.jsx";
import NonStandardWorkingHourTable from "./NonStandardWorkingHourTable.jsx";
import useNonStandardWorkingHourList from "./useNonStandardWorkingHourList.jsx";
export default function NonStandardWorkingHourList() {
    const { deleteRecord, error, isLoading, list, month, year, updatePeriod } = useNonStandardWorkingHourList();
    let result;
    switch (true) {
        case (error):
            result = handleAPIError(error);
            break;
        case (isLoading):
            result = <Loading />;
            break;
        default:
            document.title = "EMSTF Staff Non Standard Working Hour List";
            result = <NonStandardWorkingHourTable deleteRecord={deleteRecord} list={list} month={month} year={year} updatePeriod={updatePeriod} />
            break;
    }
    return result;
}