import { useStaffForm } from "./useStaffForm";
import handleAPIError from "../../common/handleAPIError";
import Loading from "../../common/Loading";
import StaffInfoTable from "./StaffInfoTable";
export default function StaffForm({staffAction}){
    const formItem=useStaffForm();
    let result;    
    switch (true){
        case (formItem.error):
            result=handleAPIError(error);
            break;
        case (formItem.isLoading):
            result=<Loading />;
            break;
        default:
            result=<StaffInfoTable formItem={formItem} staffAction={staffAction}/>
            break;    
    }
    return result;
}