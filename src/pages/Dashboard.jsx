import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import Navbar from '../components/Navbar';
import { navLinks } from '../components/navbarConfig'; // Adjust the import path as necessary

import { 
  FaUsers, 
  FaBuilding, 
  FaUserCheck, 
  FaBullhorn, 
  FaCalendarAlt,
  FaPlus,
  FaUserCog,
  FaChartLine,
  FaBell,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import { RiLogoutCircleLine } from 'react-icons/ri';

const roleConfig = {
  Admin: {
    stats: {
      totalEmployees: 245,
      departments: 12,
      active: 238,
      onLeave: 7
    },
    quickActions: [
      { id: 1, title: 'Manage Users', icon: <FaUserCog />, color: 'from-purple-500 to-blue-500' },
      { id: 2, title: 'System Settings', icon: <FaCog />, color: 'from-green-500 to-teal-500' },
      { id: 3, title: 'View Analytics', icon: <FaChartLine />, color: 'from-pink-500 to-red-500' }
    ],
    announcements: [
      { id: 1, text: 'System maintenance scheduled', date: '1h ago', category: 'System' },
      { id: 2, text: 'New admin permissions available', date: '3h ago', category: 'Security' }
    ],
    recentActivities: [
      { id: 1, action: 'Updated user permissions', time: '9:30 AM' },
      { id: 2, action: 'Reviewed system logs', time: 'Yesterday' }
    ]
  },
  Manager: {
    stats: {
      totalEmployees: 45,
      departments: 3,
      active: 42,
      onLeave: 3
    },
    quickActions: [
      { id: 1, title: 'Team Reports', icon: <FaChartLine />, color: 'from-blue-500 to-purple-500' },
      { id: 2, title: 'Schedule Shifts', icon: <FaCalendarAlt />, color: 'from-green-500 to-teal-500' },
      { id: 3, title: 'Approve Requests', icon: <FaUserCheck />, color: 'from-yellow-500 to-orange-500' }
    ],
    announcements: [
      { id: 1, text: 'Team meeting at 2 PM', date: '1h ago', category: 'Meeting' },
      { id: 2, text: 'New budget allocated', date: '4h ago', category: 'Finance' }
    ],
    recentActivities: [
      { id: 1, action: 'Approved vacation request', time: '10:00 AM' },
      { id: 2, action: 'Updated project timeline', time: 'Yesterday' }
    ]
  },
  Employee: {
    stats: {
      totalEmployees: 152,
      departments: 7,
      active: 129,
      onLeave: 23
    },
    quickActions: [
      { id: 1, title: 'Request Time Off', icon: <FaCalendarAlt />, color: 'from-blue-500 to-purple-500' },
      { id: 2, title: 'Submit Report', icon: <FaChartLine />, color: 'from-green-500 to-teal-500' },
      { id: 3, title: 'Training Modules', icon: <FaUserCheck />, color: 'from-yellow-500 to-orange-500' }
    ],
    announcements: [
      { id: 1, text: 'Wellness program launched', date: '2h ago', category: 'HR' },
      { id: 2, text: 'Office closure notice', date: '1d ago', category: 'General' }
    ],
    recentActivities: [
      { id: 1, action: 'Completed safety training', time: '9:30 AM' },
      { id: 2, action: 'Submitted weekly report', time: 'Yesterday' }
    ]
  }
};

export default function Dashboard() {
 
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true); // Added for responsive nav
  const { role } = location.state || { role: 'Employee' };
  const { stats, quickActions, recentActivities, announcements } = roleConfig[role];
  
 
  useEffect(() => {
   
  }, []);
  

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden flex">
      {/* Sidebar Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <motion.div 
          className="max-w-7xl mx-auto h-full flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {role}</h1>
              <p className="text-white/70">Here's your daily overview</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <FaBell className="text-xl" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                >
                  JD
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white/5 backdrop-blur-xl rounded-xl p-2 border border-white/10"
                    >
                      <button className="w-full p-3 hover:bg-white/10 rounded-lg flex items-center gap-2">
                        <FaCog /> Settings
                      </button>
                      <button className="w-full p-3 hover:bg-white/10 rounded-lg flex items-center gap-2">
                        <RiLogoutCircleLine /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-auto">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    icon={<FaUsers />} 
                    title="Total Employees" 
                    value={stats.totalEmployees} 
                    trend="+12%"
                    color="from-purple-500 to-purple-700" 
                  />
                  <StatCard 
                    icon={<FaBuilding />} 
                    title="Departments" 
                    value={stats.departments} 
                    trend="+2"
                    color="from-blue-500 to-blue-700" 
                  />
                  <StatCard 
                    icon={<FaUserCheck />} 
                    title="Active" 
                    value={stats.active} 
                    trend="98%"
                    color="from-green-500 to-green-700" 
                  />
                  <StatCard 
                    icon={<FaUserCheck />} 
                    title="On Leave" 
                    value={stats.onLeave} 
                    trend="-5%"
                    color="from-yellow-500 to-yellow-700" 
                  />
                </div>
              )}

              {/* Quick Actions */}
              {quickActions && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <motion.div
                    key={action.id}
                    whileHover={{ y: -5 }}
                    className={`bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 cursor-pointer transition-all group ${action.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-4">
                        <div className={`w-12 h-12 flex items-center justify-center text-white text-xl rounded-lg bg-gradient-to-br ${action.color}`}>
                          {action.icon}
                        </div>
                        <h3 className="text-xl font-semibold">{action.title}</h3>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaPlus className="text-2xl transform rotate-45" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              )}

              {/* Recent Activities */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span>{activity.action}</span>
                      <span className="text-white/50 text-sm">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Calendar Widget */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Calendar</h2>
                  <FaCalendarAlt className="text-xl text-purple-400" />
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(31)].map((_, i) => (
                    <div 
                      key={i}
                      className={`aspect-square flex items-center justify-center rounded-lg 
                        ${i === 14 ? 'bg-purple-500/30 border border-purple-400' : 'hover:bg-white/10'}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaBullhorn className="text-yellow-400" />
                    Announcements
                  </h2>
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">3</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {announcements.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ x: 5 }}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-purple-300">{item.category}</span>
                        <span className="text-xs text-white/50">{item.date}</span>
                      </div>
                      <p className="text-white/90">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, color }) {
  return (
    <motion.div 
      className={`bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 relative overflow-hidden group`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity ${color}`} />
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <p className="text-white/70 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="relative z-10 mt-3 text-sm font-medium text-green-400">
          ↑ {trend}
        </div>
      )}
    </motion.div>
  );
}