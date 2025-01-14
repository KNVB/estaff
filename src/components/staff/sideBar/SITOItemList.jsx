import './ItemList.css';
export default function SITOItemList({logout}){
    return (
        <ul className='itemList'>
            <li>
                <a className="m-0" href="admin/rosterScheduler">Roster Scheduler</a>
            </li>
            <li>
                <a href="admin/itoManagement/list">ITO Management</a>
            </li>
            <li>
                <a href="admin/nonStandardWorkingHourManagement/list">Non Standard Working Hours Management</a>
            </li>
            <li>
                <span className='logout' onClick={logout}>
                    Logout
                </span>
            </li>    
        </ul>
    );
} 