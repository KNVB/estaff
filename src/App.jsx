import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RosterAdminContent from "./components/rosterAdmin/RosterAdminContent.jsx";
import RosterScheduler from "./components/rosterAdmin/rosterScheduler/RosterScheduler.jsx";
import RosterViewer from "./components/rosterViewer/RosterViewer.jsx";
import StaffManagement from "./components/rosterAdmin/staffManagement/StaffManagement.jsx";
export default function App() {  
  return (
    <Router>
      <Routes>
        <Route path='/rosterWeb' element={<RosterViewer />}/>
          <Route path='/rosterWeb/admin/'element={<RosterAdminContent />}>
            <Route path="staffManagement/:action" element={<StaffManagement />} /> 
            <Route path="rosterScheduler" element={<RosterScheduler/>}/>
          </Route>        
      </Routes>
    </Router>  
  )
}