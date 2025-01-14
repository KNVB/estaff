import { useParams } from 'react-router-dom';
import NonStandardWorkingHourForm from "./NonStandardWorkingHourForm.jsx";
import NonStandardWorkingHourList from "./NonStandardWorkingHourList.jsx";
export default function NonStandardWorkingHourManagement(){
    document.title="EMSTF Staff Non Standard Working Hour Management";
    const params = useParams();
    let obj;
    switch (params.action) {
      case "add":
      case "edit":
        obj = <NonStandardWorkingHourForm action={params.action}/>
        break;
      case "list":
        obj = <NonStandardWorkingHourList />
        break;
      default:
        break;  
    }
    return obj
}