import { Navigate } from 'react-router-dom';
import StaffPlatForm from '../staff/StaffPlatForm';
export default function AdminGateKeeper(){
    let identity = JSON.parse(sessionStorage.getItem("accessToken"));
    let finalComponent;
    if (identity) {
        switch (true){
            case (identity.title.startsWith("ITO")):
                finalComponent = <StaffPlatForm identity={id} />
                break;
            case (identity.title.startsWith("SITO")):
                finalComponent = <AdminPlatForm identity={id} />
                break;
            default:
                sessionStorage.clear();
                alert("You are not allow to access this page");
                finalComponent = <Navigate to="/login" />
                break;
        }
    }else {
        finalComponent = <Navigate to="/login" />
    }
    return finalComponent;
}