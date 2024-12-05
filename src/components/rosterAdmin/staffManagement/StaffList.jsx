import { useStaffList } from "./useStaffList";
import handleAPIError from "../../common/handleAPIError.jsx";
import Loading from "../../common/Loading.jsx";
import StaffTable from "./StaffTable.jsx";
export default function StaffList(){
    const { error, isLoading, staffList } = useStaffList();
    let result;
    switch (true){
        case (error):
            result=handleAPIError(error);
            break;
        case (isLoading):
            result=<Loading />;
            break;
        default:
            document.title = "EMSTF Staff Info. Maintenance";
            result=<StaffTable staffList={staffList}/>
            break;
            
    }
    return result;
}