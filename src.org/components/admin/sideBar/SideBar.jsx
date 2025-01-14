import './SideBar.css';
import { useState } from 'react';
export default function SideBar({ navItemList, content }) {
    const [navCss, setNavCss] = useState("item hideNav");
    let hideNav = () => {
        setNavCss("item hideNav");
    }
    let showNav = () => {
        setNavCss("item showNav");
    }
    document.title = "EMSTF Admin. Page";
    return (
        <div className="m-0 p-0 bg-danger">
            <div className={navCss}>
                <div className="closebtn" onClick={hideNav}>&times;</div>
                {navItemList}
            </div>
            <div className="item main">
                <div className='hamburger' onClick={showNav}>
                    ☰
                </div>
                <div className="content">
                    <div className="d-flex justify-content-center m-0">
                        <h1 className='m-0'>EMSTF Admin. Page</h1>
                    </div>
                    {content}
                </div>
            </div>
        </div>
    )
}