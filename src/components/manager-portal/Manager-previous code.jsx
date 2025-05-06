import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiUsers, FiPieChart, FiSettings, FiUser, FiPlus, FiSearch, FiChevronDown, FiBarChart2, FiCalendar, FiMail, FiClock } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { navLinks } from '../components/navbarConfig';

const ManagerPortal = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [selectedManager, setSelectedManager] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [isNavOpen, setIsNavOpen] = useState(true); // Added for responsive nav
  const { role } = location.state || { role: 'Employee' };
  
  // Sample data - replace with your actual data
  const managers = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'HR Manager',
      department: 'Human Resources',
      teamSize: 12,
      status: 'active',
      email: 'alex.johnson@company.com',
      performance: 4.8,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Project Manager',
      department: 'Engineering',
      teamSize: 8,
      status: 'active',
      email: 'sarah.williams@company.com',
      performance: 4.5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Operations Manager',
      department: 'Operations',
      teamSize: 15,
      status: 'active',
      email: 'michael.chen@company.com',
      performance: 4.2,
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Marketing Manager',
      department: 'Marketing',
      teamSize: 6,
      status: 'inactive',
      email: 'emily.davis@company.com',
      performance: 3.9,
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    }
  ];

  const departments = [...new Set(managers.map(manager => manager.department))];

  const filteredManagers = managers.filter(manager => {
    const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         manager.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || manager.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const performanceData = [
    { month: 'Jan', rating: 4.2 },
    { month: 'Feb', rating: 4.5 },
    { month: 'Mar', rating: 4.7 },
    { month: 'Apr', rating: 4.8 },
    { month: 'May', rating: 4.6 },
    { month: 'Jun', rating: 4.9 },
  ];

  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Developer', status: 'active' },
    { id: 2, name: 'Jane Smith', role: 'Designer', status: 'active' },
    { id: 3, name: 'Robert Brown', role: 'QA Engineer', status: 'active' },
    { id: 4, name: 'Lisa Ray', role: 'Product Owner', status: 'active' },
  ];

  const approvals = [
    { id: 1, type: 'Leave Request', employee: 'John Doe', date: '2023-06-15', status: 'approved' },
    { id: 2, type: 'Expense Report', employee: 'Jane Smith', date: '2023-06-18', status: 'pending' },
  ];

  const tasks = [
    { id: 1, title: 'Quarterly Review', dueDate: '2023-06-30', status: 'in-progress' },
    { id: 2, title: 'Team Building Event', dueDate: '2023-07-15', status: 'not-started' },
  ];

  const feedback = [
    { id: 1, from: 'John Doe', rating: 5, comment: 'Great leadership and support', date: '2023-06-10' },
    { id: 2, from: 'Jane Smith', rating: 4, comment: 'Clear communication', date: '2023-06-12' },
  ];

  const timeline = [
    { id: 1, action: 'Hired new team member', date: '2023-05-20', details: 'Hired Robert Brown as QA Engineer' },
    { id: 2, action: 'Team reassignment', date: '2023-05-28', details: 'Reassigned Lisa to Product Owner role' },
    { id: 3, action: 'Performance review', date: '2023-06-05', details: 'Completed quarterly performance reviews' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
      transition: { duration: 0.3 }
    }
  };

  const combinedVariants = {
    ...itemVariants,
    ...cardVariants,
  };
  
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
    {/* Fixed Sidebar */}
    
      <Navbar 
        navLinks={navLinks} 
        isNavOpen={isNavOpen} 
        setIsNavOpen={setIsNavOpen} 
      />
    
    <motion.div 
      className="flex-1 overflow-y-auto relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Manager Portal
          </h1>
          <div className="flex gap-4 w-full md:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <FiPlus />
              <span>Add Manager</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <FiBarChart2 />
              <span>Generate Reports</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="flex space-x-2 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-t-lg ${activeTab === 'directory' ? 'bg-gray-800 text-purple-400' : 'bg-gray-800/50 hover:bg-gray-800/70'}`}
            onClick={() => setActiveTab('directory')}
          >
            <div className="flex items-center space-x-2">
              <FiUsers />
              <span>Manager Directory</span>
            </div>
          </motion.button>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-t-lg ${activeTab === 'analytics' ? 'bg-gray-800 text-green-400' : 'bg-gray-800/50 hover:bg-gray-800/70'}`}
            onClick={() => setActiveTab('analytics')}
          >
            <div className="flex items-center space-x-2">
              <FiPieChart />
              <span>Performance Analytics</span>
            </div>
          </motion.button>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-t-lg ${activeTab === 'assignment' ? 'bg-gray-800 text-blue-400' : 'bg-gray-800/50 hover:bg-gray-800/70'}`}
            onClick={() => setActiveTab('assignment')}
          >
            <div className="flex items-center space-x-2">
              <FiSettings />
              <span>Team Assignment</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {activeTab === 'directory' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div 
                  className="relative flex-1"
                  whileHover={{ scale: 1.01 }}
                >
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search managers..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.01 }}
                >
                  <label className="text-gray-300">Department:</label>
                  <select
                    className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </motion.div>
              </div>

              {/* Manager Directory */}
              {selectedManager ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Back button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mb-4 flex items-center text-blue-400 hover:text-blue-300"
                    onClick={() => setSelectedManager(null)}
                  >
                    <FiChevronDown className="transform rotate-90 mr-1" />
                    Back to directory
                  </motion.button>

                  {/* Manager Profile */}
                  <div className="bg-gray-700 rounded-xl p-6 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Sidebar */}
                      <div className="md:w-1/3 space-y-4">
                        <div className="flex flex-col items-center">
                          <motion.div 
                            className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500"
                            whileHover={{ scale: 1.05 }}
                          >
                            <img 
                              src={selectedManager.avatar} 
                              alt={selectedManager.name} 
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <h2 className="text-2xl font-bold mt-4">{selectedManager.name}</h2>
                          <div className="text-purple-400">{selectedManager.role}</div>
                          <div className="text-gray-300">{selectedManager.department}</div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-2 text-blue-400">Quick Stats</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Team Size:</span>
                              <span className="text-yellow-400">{selectedManager.teamSize}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Performance:</span>
                              <span className="text-green-400">{selectedManager.performance}/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Status:</span>
                              <span className={`${selectedManager.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                                {selectedManager.status.charAt(0).toUpperCase() + selectedManager.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
                          >
                            Edit Profile
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                          >
                            Message
                          </motion.button>
                        </div>
                      </div>

                      {/* Profile Content */}
                      <div className="md:w-2/3 space-y-6">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-600">
                          <button className="px-4 py-2 border-b-2 border-purple-500 text-purple-400">Overview</button>
                          <button className="px-4 py-2 text-gray-400 hover:text-white">Assigned Team</button>
                          <button className="px-4 py-2 text-gray-400 hover:text-white">Approvals</button>
                          <button className="px-4 py-2 text-gray-400 hover:text-white">Tasks</button>
                          <button className="px-4 py-2 text-gray-400 hover:text-white">Feedback</button>
                        </div>

                        {/* Overview */}
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-blue-400">Performance Overview</h3>
                          <div className="bg-gray-800 rounded-lg p-4 h-64">
                            {/* Chart placeholder - replace with actual chart */}
                            <div className="flex items-end h-40 space-x-2 mt-4">
                              {performanceData.map((data, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${data.rating * 20}%` }}
                                  transition={{ duration: 0.8, delay: index * 0.1 }}
                                  className="w-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t flex items-end justify-center"
                                  whileHover={{ scaleY: 1.1 }}
                                >
                                  <span className="text-xs mb-1 transform translate-y-5">{data.month}</span>
                                </motion.div>
                              ))}
                            </div>
                            <div className="text-center mt-2 text-gray-300">
                              Performance trend over last 6 months
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div>
                          <h3 className="text-xl font-semibold mb-4 text-green-400">Recent Activity Timeline</h3>
                          <div className="space-y-4">
                            {timeline.map((item) => (
                              <motion.div
                                key={item.id}
                                className="flex items-start"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 mr-3"></div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">{item.action}</h4>
                                    <span className="text-gray-400 text-sm">{item.date}</span>
                                  </div>
                                  <p className="text-gray-300 text-sm">{item.details}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  
                  {filteredManagers.map((manager) => (
                    
                    <motion.div
                      key={manager.id}
                      whileHover="hover"
                      variants={combinedVariants}
                      className="bg-gray-700 rounded-xl p-6 shadow-lg cursor-pointer"
                      onClick={() => setSelectedManager(manager)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img 
                            src={manager.avatar} 
                            alt={manager.name} 
                            className="w-16 h-16 rounded-full border-2 border-purple-500"
                          />
                          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-700 ${manager.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{manager.name}</h3>
                          <div className="text-purple-400">{manager.role}</div>
                          <div className="text-gray-300 text-sm">{manager.department}</div>
                          <div className="flex justify-between mt-2">
                            <div className="flex items-center text-sm text-gray-400">
                              <FiUsers className="mr-1" />
                              <span>{manager.teamSize} team members</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-yellow-400">{manager.performance}</span>
                              <span className="text-gray-400 ml-1">/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4 pt-4 border-t border-gray-600">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view profile action
                          }}
                        >
                          View
                        </motion.button>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle promote/demote action
                            }}
                          >
                            {manager.role.includes('Senior') ? 'Demote' : 'Promote'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1 rounded-lg text-sm ${manager.status === 'active' ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle activate/deactivate action
                            }}
                          >
                            {manager.status === 'active' ? 'Deactivate' : 'Activate'}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-green-400">Manager Performance Analytics</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-6 rounded-xl border border-purple-500/20"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-300">Average Rating</div>
                      <div className="text-3xl font-bold text-purple-400">4.5</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <FiBarChart2 className="text-purple-400 text-xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-green-400 flex items-center">
                    <span>↑ 12% from last month</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 p-6 rounded-xl border border-blue-500/20"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-300">Avg Response Time</div>
                      <div className="text-3xl font-bold text-blue-400">1.2 days</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <FiClock className="text-blue-400 text-xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-green-400 flex items-center">
                    <span>↓ 0.3 days from last month</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-pink-600/30 to-pink-800/30 p-6 rounded-xl border border-pink-500/20"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-300">Team Satisfaction</div>
                      <div className="text-3xl font-bold text-pink-400">88%</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <FiUser className="text-pink-400 text-xl" />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-green-400 flex items-center">
                    <span>↑ 5% from last quarter</span>
                  </div>
                </motion.div>
              </div>

              {/* Department Comparison */}
              <div className="bg-gray-700 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">Department Comparison</h3>
                <div className="h-64">
                  {/* Chart placeholder - replace with actual comparison chart */}
                  <div className="flex items-end h-40 space-x-4 mt-4">
                    {departments.map((dept, index) => (
                      <motion.div
                        key={dept}
                        initial={{ height: 0 }}
                        animate={{ height: `${(index + 1) * 15 + 20}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`flex-1 rounded-t-lg flex items-end justify-center ${index % 3 === 0 ? 'bg-gradient-to-t from-purple-500 to-pink-500' : index % 3 === 1 ? 'bg-gradient-to-t from-blue-500 to-cyan-500' : 'bg-gradient-to-t from-green-500 to-teal-500'}`}
                        whileHover={{ scaleY: 1.1 }}
                      >
                        <span className="text-xs mb-1 transform translate-y-5">{dept.split(' ')[0]}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Report Cards */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">Monthly Report Cards</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-600">
                        <th className="pb-2">Manager</th>
                        <th className="pb-2">Department</th>
                        <th className="pb-2">Rating</th>
                        <th className="pb-2">Productivity</th>
                        <th className="pb-2">Leadership</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managers.map((manager) => (
                        <motion.tr 
                          key={manager.id}
                          className="border-b border-gray-700 hover:bg-gray-600/30"
                          whileHover={{ x: 5 }}
                        >
                          <td className="py-3 flex items-center">
                            <img src={manager.avatar} alt={manager.name} className="w-8 h-8 rounded-full mr-2" />
                            {manager.name}
                          </td>
                          <td>{manager.department}</td>
                          <td>
                            <div className="flex items-center">
                              <span className="text-yellow-400">{manager.performance}</span>
                              <span className="text-gray-400 ml-1">/5</span>
                            </div>
                          </td>
                          <td>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${manager.performance * 20}%` }}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(manager.performance - 0.5) * 20}%` }}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <button className="text-purple-400 hover:text-purple-300 text-sm">
                              View Report
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'assignment' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Team Assignment Manager</h2>
              
              {/* Assignment Matrix */}
              <div className="bg-gray-700 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Manager-to-Team Assignment Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-600">
                        <th className="pb-2">Manager</th>
                        <th className="pb-2">Department</th>
                        <th className="pb-2">Current Team</th>
                        <th className="pb-2">Capacity</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managers.map((manager) => (
                        <motion.tr 
                          key={manager.id}
                          className="border-b border-gray-700 hover:bg-gray-600/30"
                          whileHover={{ x: 5 }}
                        >
                          <td className="py-3 flex items-center">
                            <img src={manager.avatar} alt={manager.name} className="w-8 h-8 rounded-full mr-2" />
                            {manager.name}
                          </td>
                          <td>{manager.department}</td>
                          <td>{manager.teamSize} members</td>
                          <td>
                            <div className="flex items-center">
                              <div className="w-24 bg-gray-600 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${manager.teamSize > 10 ? 'bg-red-500' : manager.teamSize > 5 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                                  style={{ width: `${Math.min(manager.teamSize * 8, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-300">
                                {manager.teamSize > 10 ? 'High' : manager.teamSize > 5 ? 'Medium' : 'Low'} load
                              </span>
                            </div>
                          </td>
                          <td>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm mr-2"
                            >
                              Reassign
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm"
                            >
                              Add Members
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Unassigned Employees */}
              <div className="bg-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-green-400">Unassigned Employees</h3>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      className="pl-10 pr-4 py-2 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="bg-gray-600 rounded-lg p-4 flex items-center justify-between"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-500 mr-3 flex items-center justify-center">
                          <FiUser className="text-gray-300" />
                        </div>
                        <div>
                          <div className="font-medium">Employee {i}</div>
                          <div className="text-sm text-gray-300">Role {i}</div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center"
                      >
                        <FiPlus />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
    </div>
  );
};

export default ManagerPortal;