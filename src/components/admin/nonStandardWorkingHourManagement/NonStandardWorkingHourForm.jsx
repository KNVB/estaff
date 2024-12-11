import { useLocation, useNavigate } from 'react-router-dom';
export default function NonStandardWorkingHourForm(){
    let data = useLocation();
    let navigate = useNavigate();
    console.log(data.state);
}