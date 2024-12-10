import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NonStandardWorkingHourManagement from "./components/admin/nonStandardWorkingHourManagement/NonStandardWorkingHourManagement.jsx";
import RosterAdminContent from "./components/admin/AdminContent.jsx";
import RosterScheduler from "./components/admin/rosterScheduler/RosterScheduler.jsx";
import RosterViewer from "./components/rosterViewer/RosterViewer.jsx";
import StaffManagement from "./components/admin/staffManagement/StaffManagement.jsx";
export default function App() {  
  return (
    <Router>
      <Routes>
        <Route path='/rosterWeb' element={<RosterViewer />}/>
          <Route path='/admin'element={<RosterAdminContent />}>
            <Route path="nonStandardWorkingHourManagement/:action" element={<NonStandardWorkingHourManagement/>}/>
            <Route path="staffManagement/:action" element={<StaffManagement />} /> 
            <Route path="rosterScheduler" element={<RosterScheduler/>}/>
          </Route>        
      </Routes>
    </Router>  
  )
}