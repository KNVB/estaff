import { Navigate } from 'react-router-dom';
import StaffPlatForm from '../staff/StaffPlatForm.jsx';
export default function ADGateKeeper() {
    let finalComponent;
    if (sessionStorage.getItem("identity")) {
        let id = JSON.parse(sessionStorage.getItem("identity"));
        finalComponent = <StaffPlatForm identity={id} />
    } else {
        finalComponent = <Navigate to="/login" />
    }
    return finalComponent;
}