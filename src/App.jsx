//import './App.css'
import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GateKeeper from './GateKeeper';
import Login from "./components/loginForm/LoginForm";
import RosterViewer from "./components/rosterViewer/RosterViewer";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/rosterWeb' element={<RosterViewer/>} />
        <Route path='/staff' element={<GateKeeper />}>
          <Route index element={<GateKeeper />} />
            <Route path='admin' element={<SITOGateKeeper />} >
              <Route index element={<SITOGateKeeper />} />
            </Route>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}