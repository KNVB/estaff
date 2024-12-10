import { useParams } from 'react-router-dom';
import StaffForm from "./StaffForm.jsx";
import StaffList from "./StaffList.jsx";
export default function StaffManagement(){
    document.title="EMSTF Staff Info. Maintenance";
    const params = useParams();
    let obj;
    switch (params.action) {
      case "add":
      case "edit":
        obj = <StaffForm staffAction={params.action}/>
        break;
      case "list":
        obj = <StaffList />
        break;
      default:
        break;  
    }
    return obj
}