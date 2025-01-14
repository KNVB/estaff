import './ItemList.css';
export default function ITOItemList({logout}){
    return (
        <ul className='itemList'>
            <li>
                <a className="m-0" href="o_and_t/">Apply OverTime or Time off</a>
            </li>
            <li>
                <a href="rosterReq/">Submit Roster Requirement</a>
            </li>            
            <li>
                <span className='logout' onClick={logout}>
                    Logout
                </span>
            </li>    
        </ul>
    );
} 