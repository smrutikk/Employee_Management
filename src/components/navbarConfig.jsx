import {
  FaHome, FaBell, FaCalendarAlt, FaUsers, FaBuilding, 
  FaUserPlus, FaTasks, FaCog, FaUserCheck, FaClipboardList,
  FaCommentAlt, FaSignOutAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

export const coreNavigation = [
  { label: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
  { label: 'Calendar', path: '/calendar', icon: <FaCalendarAlt /> },
];

export const roleBasedNavigation = {
  Admin: [
    { label: 'Notifications', path: '/notifications', icon: <FaBell /> },
    { label: 'Leave Management', path: '/leaves', icon: <FaUsers /> },
    { label: 'Attendance', path: '/attendance', icon: <FaBuilding /> },
    { label: 'Team Overview', path: '/team', icon: <FaUsers /> },
    { label: 'Onboarding', path: '/onboarding', icon: <FaUserPlus /> },
    { label: 'Task Manager', path: '/tasks', icon: <FaTasks /> },
    { label: 'Settings', path: '/settings', icon: <FaCog /> },
  ],
  Employee: [
    { label: 'Notifications', path: '/notifications', icon: <FaBell /> },
    { label: 'Time Tracker', path: '/time-tracker', icon: <FaUserCheck /> },
    { label: 'Leave Request', path: '/leave-request', icon: <FaClipboardList /> },
    { label: 'My Objectives', path: '/objectives', icon: <FaTasks /> },
    { label: 'Feedback Portal', path: '/feedback', icon: <FaCommentAlt /> },
    { label: 'Settings', path: '/settings', icon: <FaCog /> },
  ],
  commonEnd: [
    { label: 'Logout', path: '/logout', icon: <FaSignOutAlt /> }
  ]
};

export const navLinks = {
  Admin: [
    { label: 'Notifications', path: '/notifications', icon: <FaBell /> },
      { label: 'Leave Management', path: '/leaves', icon: <FaUsers /> },
      { label: 'Attendance', path: '/attendance', icon: <FaBuilding /> },
      { label: 'Team Overview', path: '/my-team', icon: <FaUsers /> },
      { label: 'Onboarding', path: '/onbording', icon: <FaUserPlus /> },
      { label: 'Task Manager', path: '/assign-tasks', icon: <FaTasks />},
      { label: 'Settings', path: '/settings', icon: <FaCog/> },
  ],
  Employee: [
    { label: 'Notifications', path: '/em_notifications', icon: <FaBell /> },
      { label: 'Time Tracker', path: '/time-tracker', icon: <FaUserCheck />},
      { label: 'Leave Request', path: '/apply-leave', icon: <FaClipboardList />},
      { label: 'My Objectives', path: '/my-tasks', icon: <FaTasks />},
      { label: 'Feedback Portal', path: '/feedback', icon: <FaCommentAlt /> },
      { label: 'Settings', path: '/emp-settings', icon: <FaCog/> },
  ],
  commonEnd: [
      { label: 'Logout', path: '/logout', icon: <FaSignOutAlt /> }
  ]
};