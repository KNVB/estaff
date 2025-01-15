import SideBar from "./sideBar/SideBar";
export default function StaffPlatForm({ identity }) {
    if (!identity.title.startsWith("SITO") && !identity.title.startsWith("ITO")){
        alert("You are not allowed to access this page.");
        logout();
    }else {
        return <SideBar id={identity}/>
    }
}