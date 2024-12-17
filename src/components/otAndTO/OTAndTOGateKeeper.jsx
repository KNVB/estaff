import { Navigate, Outlet } from 'react-router-dom';
export default function OTAndTOGateKeeper(){
    let finalComponent;
    if (sessionStorage.getItem("accessToken")){
        finalComponent=<Outlet/>
    } else {        
        finalComponent=<Navigate to="./login" replace/>
    }
    return finalComponent;
}