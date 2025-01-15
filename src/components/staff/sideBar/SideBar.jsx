import './SideBar.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import ITOItemList from "./ITOItemList";
import SITOItemList from "./SITOItemList";
export default function SideBar({ id }) {
    const [navCss, setNavCss] = useState("item hideNav");
    const navigate = useNavigate();
    let logout = () => {
        sessionStorage.clear();
        navigate("/login");
    }
    let hideNav = () => {
        setNavCss("item hideNav");
    }
    let showNav = () => {
        setNavCss("item showNav");
    }
    return (
        <div className="m-0 p-0 bg-danger">
            <div className={navCss}>
                <div className="closebtn" onClick={hideNav}>&times;</div>
                <div>
                    <ul className='itemList'>
                        <ITOItemList />
                        {
                            id.title.startsWith("SITO") && 
                            <SITOItemList />
                        }
                        <li>
                            <span className='logout' onClick={logout}>
                                Logout
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="item main">
                <div className='hamburger' onClick={showNav}>
                    ☰
                </div>
                <div className="content">
                    <div className="d-flex justify-content-center m-0">
                        <h1 className='m-0'>EMSTF Staff Page</h1>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}