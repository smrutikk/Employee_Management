// navbarConfig.js
import {
  FaHome, FaUser, FaBell, FaCalendarAlt, FaUsers, FaBuilding, 
  FaUserCog, FaCog, FaChartLine, FaClipboardList, FaUserCheck, 
  FaTasks, FaCommentAlt, FaSignOutAlt, FaChevronLeft, FaChevronRight,FaBullhorn, FaUserPlus
} from 'react-icons/fa';


export const coreNavigation = [
  { label: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
  { label: 'Calendar', path: '/calendar', icon: <FaCalendarAlt /> },
  { label: 'Notifications', path: '/notifications', icon: <FaBell /> },
];

export const roleBasedNavigation = {
  Admin: [
      { label: 'Leave Management', path: '/leaves', icon: <FaUsers /> },
      { label: 'Attendance', path: '/attendance', icon: <FaBuilding /> },
      { label: 'Team Overview', path: '/my-team', icon: <FaUsers /> },
      { label: 'Onboarding', path: '/onbording', icon: <FaUserPlus /> },
      { label: 'Task Manager', path: '/assign-tasks', icon: <FaTasks />},
  ],
  Employee: [
      { label: 'Time Tracker', path: '/time-tracker', icon: <FaUserCheck />},
      { label: 'Leave Request', path: '/apply-leave', icon: <FaClipboardList />},
      { label: 'My Objectives', path: '/my-tasks', icon: <FaTasks />},
      { label: 'Feedback Portal', path: '/feedback', icon: <FaCommentAlt /> },
  ],
  commonEnd: [
      { label: 'Settings', path: '/settings', icon: <FaCog/> },
      { label: 'Logout', path: '/logout', icon: <FaSignOutAlt /> }
  ]
};

export const navLinks = {
  Admin: [
    { label: 'Leave Management', path: '/leaves', icon: <FaUsers /> },
    { label: 'Attendance', path: '/attendance', icon: <FaBuilding /> },
    { label: 'Team Overview', path: '/my-team', icon: <FaUsers /> },
    { label: 'Onboarding', path: '/onbording', icon: <FaUserPlus /> },
    { label: 'Task Manager', path: '/assign-tasks', icon: <FaTasks />},
],
Employee: [
    { label: 'Time Tracker', path: '/time-tracker', icon: <FaUserCheck />},
    { label: 'Leave Request', path: '/apply-leave', icon: <FaClipboardList />},
    { label: 'My Objectives', path: '/my-tasks', icon: <FaTasks />},
    { label: 'Feedback Portal', path: '/feedback', icon: <FaCommentAlt /> },
],
commonEnd: [
    { label: 'Settings', path: '/settings', icon: <FaCog/> },
    { label: 'Logout', path: '/logout', icon: <FaSignOutAlt /> }
]
};