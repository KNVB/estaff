import { Navigate } from "react-router-dom";
export default function handleAPIError(error){
    alert(error.message);    
    if (error.status === 401) {
        return <Navigate to="/login" />
    }
}