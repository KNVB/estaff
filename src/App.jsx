//import './App.css'
import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ADGateKeeper from './components/gateKeeper/ADGateKeeper';
import AdminGateKeeper from './components/gateKeeper/AdminGateKeeper';
import Login from "./components/loginForm/LoginForm";
import RosterScheduler from "./components/admin/rosterScheduler/RosterScheduler";
import RosterViewer from "./components/rosterViewer/RosterViewer";
import StaffManagement from "./components/admin/staffManagement/StaffManagement";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/rosterWeb' element={<RosterViewer/>} />
        <Route path='/staff' element={<ADGateKeeper />}>
          <Route index element={<ADGateKeeper />} />
            <Route path='admin' element={<AdminGateKeeper />} >
              <Route index element={<AdminGateKeeper />} />
              <Route path="staffManagement/:action" element={<StaffManagement />} />
              <Route path="rosterScheduler" element={<RosterScheduler/>}/>              
            </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}