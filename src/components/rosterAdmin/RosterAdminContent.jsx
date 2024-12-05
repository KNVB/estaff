import { Outlet } from 'react-router-dom';
import ItemList from './ItemList.jsx';
import SideBar from "./sideBar/SideBar.jsx";
export default function RosterAdminContent(){
    return <SideBar content={<Outlet/>} navItemList={<ItemList/>}/>    
}