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
import LeaveRequest from './pages/Employee pages/LeaveRequest';
import TimeTracker from './pages/Employee pages/TimeTracker'; 
import ObjectivesPage from './pages/Employee pages/Objectives';
import FeedbackPortal from './pages/Employee pages/FeedbackPortal';
import EmployeeSettings from './pages/Employee pages/Settings';
import NotificationsPage from './pages/Employee pages/Em_Notification';

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

        {/*Emplyee pages Routing */}
        <Route path='/apply-leave' element={<LeaveRequest />} />
        <Route path='/time-tracker' element={<TimeTracker />} />
        <Route path='/my-tasks' element={<ObjectivesPage />} />
        <Route path='/feedback' element={<FeedbackPortal />} />
        <Route path='/emp-settings' element={<EmployeeSettings/>} />
        <Route path='/em_notifications' element={<NotificationsPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  
  )
}

export default App
