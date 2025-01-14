import { Navigate } from 'react-router-dom';
import RosterAdminContent from "./AdminContent";
export default function AdminGateKeeper(){
    let finalComponent;
    if (sessionStorage.getItem("accessToken")){
        finalComponent=<RosterAdminContent/>
    } else {
        finalComponent=<Navigate to="/login"/>
    }
    return finalComponent;
}