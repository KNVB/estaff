import { Navigate } from 'react-router-dom';
import StaffPlatForm from './components/staff/StaffPlatForm.jsx';
export default function GateKeeper() {
    let finalComponent;
    if (sessionStorage.getItem("accessToken")) {
        let id = JSON.parse(sessionStorage.getItem("accessToken"));
        finalComponent = <StaffPlatForm identity={id} />
    } else {
        finalComponent = <Navigate to="/login" />
    }
    return finalComponent;
}