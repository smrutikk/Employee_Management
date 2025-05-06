import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUser, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { navLinks } from '../../components/navbarConfig';

const LeaveManagement = () => {
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
  const [leaveData, setLeaveData] = useState([
    {
      id: 1,
      employee: 'John Doe',
      role: 'Developer',
      type: 'Medical',
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      status: 'pending',
      reason: 'Medical emergency'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      role: 'Designer',
      type: 'Vacation',
      startDate: '2024-04-01',
      endDate: '2024-04-07',
      status: 'approved',
      reason: 'Family vacation'
    },
    {
        id: 3,
        employee: 'Michael Johnson',
        role: 'Project Manager',
        type: 'Sick Leave',
        startDate: '2024-04-10',
        endDate: '2024-04-12',
        status: 'approved',
        reason: 'Flu and fever'
      },
      {
        id: 4,
        employee: 'Emily Davis',
        role: 'QA Engineer',
        type: 'Personal',
        startDate: '2024-05-02',
        endDate: '2024-05-03',
        status: 'pending',
        reason: 'Family emergency'
      },
      {
        id: 5,
        employee: 'David Lee',
        role: 'Backend Developer',
        type: 'Vacation',
        startDate: '2024-05-20',
        endDate: '2024-05-30',
        status: 'rejected',
        reason: 'Leave quota exceeded'
      },
      {
        id: 6,
        employee: 'Sophia Turner',
        role: 'HR Executive',
        type: 'Maternity',
        startDate: '2024-06-01',
        endDate: '2024-08-30',
        status: 'approved',
        reason: 'Maternity leave'
      },
      {
        id: 7,
        employee: 'Daniel Kim',
        role: 'UI/UX Designer',
        type: 'Sick Leave',
        startDate: '2024-04-22',
        endDate: '2024-04-25',
        status: 'pending',
        reason: 'Migraine issues'
      },
      {
        id: 8,
        employee: 'Olivia Brown',
        role: 'Marketing Lead',
        type: 'Vacation',
        startDate: '2024-07-15',
        endDate: '2024-07-25',
        status: 'approved',
        reason: 'Trip to Europe'
      },
      {
        id: 9,
        employee: 'Chris Evans',
        role: 'DevOps Engineer',
        type: 'Personal',
        startDate: '2024-06-10',
        endDate: '2024-06-12',
        status: 'rejected',
        reason: 'Insufficient documentation'
      },
      {
        id: 10,
        employee: 'Natalie White',
        role: 'Content Strategist',
        type: 'Medical',
        startDate: '2024-04-18',
        endDate: '2024-04-20',
        status: 'approved',
        reason: 'Scheduled surgery recovery'
      }
  ]);

  const statusColors = {
    pending: 'text-yellow-400',
    approved: 'text-green-400',
    rejected: 'text-red-400'
  };

  const filteredLeaves = leaveData.filter(leave => {
    const matchesSearch = leave.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          leave.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    
    // Date filtering logic
    const leaveDate = new Date(leave.startDate);
    const now = new Date();
    const matchesDate = (() => {
      switch(dateFilter) {
        case 'today':
          return leaveDate.toDateString() === now.toDateString();
        case 'thisWeek':
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          return leaveDate >= startOfWeek;
        case 'thisMonth':
          return leaveDate.getMonth() === now.getMonth() && 
                 leaveDate.getFullYear() === now.getFullYear();
        case 'recent':
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return leaveDate >= thirtyDaysAgo;
        case 'custom':
          if (!customStartDate || !customEndDate) return true;
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          return leaveDate >= start && leaveDate <= end;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = (id, newStatus) => {
    setLeaveData(prev => 
      prev.map(leave => 
        leave.id === id ? { ...leave, status: newStatus } : leave
      )
    );
    setSelectedLeave(null);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar navLinks={navLinks} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
      
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Leave Management
            </h1>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <motion.div 
                className="relative flex-1"
                whileHover={{ scale: 1.01 }}
              >
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leaves..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
              
              <div className="flex gap-2">
                <select
                  className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <div className="relative">
                  <select
                    className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="recent">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          {dateFilter === 'custom' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-4"
            >
              <div className="flex items-center gap-2">
                <label className="text-gray-300">From:</label>
                <input
                  type="date"
                  className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-300">To:</label>
                <input
                  type="date"
                  className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Pending Leaves"
              value={leaveData.filter(l => l.status === 'pending').length}
              icon={<FiAlertCircle />}
              color="yellow"
            />
            <StatCard
              title="Approved"
              value={leaveData.filter(l => l.status === 'approved').length}
              icon={<FiCheck />}
              color="green"
            />
            <StatCard
              title="Rejected"
              value={leaveData.filter(l => l.status === 'rejected').length}
              icon={<FiX />}
              color="red"
            />
            <StatCard
              title="Total Requests"
              value={leaveData.length}
              icon={<FiUser />}
              color="blue"
            />
          </div>


          {/* Leave Requests Table */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-600">
                    {['Employee', 'Role', 'Leave Type', 'Dates', 'Status', 'Actions'].map((header) => (
                      <th key={header} className="pb-3 px-2">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((leave) => (
                    <motion.tr
                      key={leave.id}
                      className="border-b border-gray-700 hover:bg-gray-700/20"
                      whileHover={{ x: 5 }}
                    >
                      <td className="py-4 px-2 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex items-center justify-center">
                          <FiUser className="text-gray-300" />
                        </div>
                        {leave.employee}
                      </td>
                      <td className="px-2">{leave.role}</td>
                      <td className="px-2">{leave.type}</td>
                      <td className="px-2">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-blue-400" />
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-2">
                        <span className={`${statusColors[leave.status]} px-2 py-1 rounded-full`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-2">
                        <div className="flex gap-2">
                          {leave.status === 'pending' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="text-green-400 hover:text-green-300"
                                onClick={() => handleStatusChange(leave.id, 'approved')}
                              >
                                <FiCheck size={20} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleStatusChange(leave.id, 'rejected')}
                              >
                                <FiX size={20} />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => setSelectedLeave(leave)}
                          >
                            <FiAlertCircle size={20} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave Details Dialog */}
          <Dialog
            open={!!selectedLeave}
            onClose={() => setSelectedLeave(null)}
            className="fixed z-50 inset-0 flex items-center justify-center"
          >
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
              <Dialog.Title className="text-xl font-bold mb-4 text-blue-400">
                Leave Request Details
              </Dialog.Title>
              
              {selectedLeave && (
                <div className="space-y-4">
                  <DetailItem label="Employee" value={selectedLeave.employee} />
                  <DetailItem label="Role" value={selectedLeave.role} />
                  <DetailItem label="Leave Type" value={selectedLeave.type} />
                  <DetailItem 
                    label="Dates" 
                    value={`${new Date(selectedLeave.startDate).toLocaleDateString()} - 
                           ${new Date(selectedLeave.endDate).toLocaleDateString()}`} 
                  />
                  <DetailItem 
                    label="Status" 
                    value={
                      <span className={`${statusColors[selectedLeave.status]} px-2 py-1 rounded-full`}>
                        {selectedLeave.status.charAt(0).toUpperCase() + selectedLeave.status.slice(1)}
                      </span>
                    } 
                  />
                  <div>
                    <label className="text-gray-300 mb-2 block">Reason:</label>
                    <p className="bg-gray-700 rounded-lg p-3">{selectedLeave.reason}</p>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                      onClick={() => setSelectedLeave(null)}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
};

// Helper components (remain the same)
const StatCard = ({ title, value, icon, color }) => (
    <motion.div 
      className={`bg-gradient-to-br from-${color}-600/30 to-${color}-800/30 p-4 rounded-xl border border-${color}-500/20`}
      whileHover={{ y: -3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-300 text-sm">{title}</div>
          <div className={`text-2xl font-bold text-${color}-400`}>{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}:</span>
      <span className="text-gray-100">{value}</span>
    </div>
  );

export default LeaveManagement;