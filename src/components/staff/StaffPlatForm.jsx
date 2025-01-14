import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import SideBar from "./sideBar/SideBar";
import ITOItemList from "./sideBar/ITOItemList";
import SITOItemList from "./sideBar/SITOItemList";
export default function StaffPlatForm({ identity }) {
    const navigate = useNavigate();
    let logout = () => {
        sessionStorage.clear();
        navigate("/login");
    }
    let itemList;
    switch (true) {
        case identity.title.startsWith("SITO"):
            itemList = <SITOItemList logout={logout}/>
            break;
        case identity.title.startsWith("ITO"):
            itemList = <ITOItemList logout={logout}/>
            break;
        default:
            alert("You are not allowed to access this page.");
            logout();
            break    
    }

    return <SideBar content={<Outlet />} id={identity} navItemList={itemList} />
}