import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RosterViewer from "./components/rosterViewer/RosterViewer.jsx";

export default function App() {  
  return (
    <Router>
      <Routes>
        <Route path='/rosterWeb' element={<RosterViewer />} />
      </Routes>
    </Router>  
  )
}