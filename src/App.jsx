import { useState, useEffect, getDoc, doc} from 'react'
import { auth, db } from './FirebaseConfig/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css'
import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calender';
import ManagerPortal from './pages/Admin pages/ManagerPortal';
import LeaveManagement from './pages/Admin pages/LeaveManagement';
import AttendanceManagement from './pages/Admin pages/AttendanceManagement';
import NotificationModule from './pages/Notification';
import TeamOverview from './pages/TeamOverview';
import { TaskManagement } from './pages/TeamOverview subpages/TaskManagement';
import OnboardingExit from './pages/Admin pages/Onbording';
import SystemSettings from './pages/Admin pages/SystemSettings';
import { RequireAuth } from './components/RequireAuth';

function App() {
  const [count, setCount] = useState(0)

  return (

    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/managers" element={<ManagerPortal />} />
        <Route path='/logout' element={<AuthPage />} />
        <Route path='/leaves' element={<LeaveManagement />} />
        <Route path='/attendance' element={<AttendanceManagement />} />
        <Route path='/notifications' element={<NotificationModule />} />
        <Route path='/my-team' element={<TeamOverview />} />
        <Route path='/assign-tasks' element={<TaskManagement />} />
        <Route path='/onbording' element={<OnboardingExit />} />
        <Route path='/settings' element= { <RequireAuth requiredRole="Admin"> <SystemSettings /> </RequireAuth>} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  
  )
}

export default App
