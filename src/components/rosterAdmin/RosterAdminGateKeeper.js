import { Navigate } from 'react-router-dom';
import RosterAdminContent from "./RosterAdminContent";
export default function RosterAdminGateKeeper(){
    let finalComponent;
    if (sessionStorage.getItem("accessToken")){
        finalComponent=<RosterAdminContent/>
    } else {
        finalComponent=<Navigate to="/login"/>
    }
    return finalComponent;
}