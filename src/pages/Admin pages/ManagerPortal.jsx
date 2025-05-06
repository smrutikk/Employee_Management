// ManagerPortal.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import {managers} from '../../components/manager-portal/data';
import { 
  FiUsers, 
  FiPieChart, 
  FiSettings, 
  FiPlus, 
  FiBarChart2,
  FiSearch,
  FiUser,
  FiChevronDown // Add if used in other components
} from 'react-icons/fi'
import Navbar from '../../components/Navbar';
import { navLinks } from '../../components/navbarConfig';
import ManagerDirectory from '../../components/manager-portal/ManagerDirectory';
import AnalyticsTab from '../../components/manager-portal/AnalyticsTab';
import { Dialog } from '@headlessui/react';
import { saveAs } from 'file-saver';


const ManagerPortal = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [isNavOpen, setIsNavOpen] = useState(true);

  const [selectedManager, setSelectedManager] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: '', department: '', teamSize: 0 });
  const [managerList, setManagerList] = useState(managers);

  const [selectedManagerForAssignment, setSelectedManagerForAssignment] = useState(null);
const [unassignedEmployees, setUnassignedEmployees] = useState([
  { id: 1, name: 'John Doe', role: 'Developer' },
  { id: 2, name: 'Jane Smith', role: 'Designer' },
  { id: 3, name: 'Mike Johnson', role: 'Tester' },
  { id: 4, name: 'Sarah Williams', role: 'Analyst' }
]);
const [unassignedSearch, setUnassignedSearch] = useState('');
  

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

  const handleAssignEmployee = (employeeId) => {
    const employee = unassignedEmployees.find(e => e.id === employeeId);
    
    setManagerList(prev => prev.map(manager => 
      manager.id === selectedManagerForAssignment.id
        ? { 
            ...manager, 
            teamSize: manager.teamSize + 1,
            teamMembers: [...(manager.teamMembers || []), employee]
          }
        : manager
    ));
  
    setUnassignedEmployees(prev => prev.filter(e => e.id !== employeeId));
    setSelectedManagerForAssignment(null);
  };

  const filteredUnassignedEmployees = unassignedEmployees.filter(employee =>
    employee.name.toLowerCase().includes(unassignedSearch.toLowerCase()) ||
    employee.role.toLowerCase().includes(unassignedSearch.toLowerCase())
  );

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const generateCSVReport = () => {
    const header = "Name,Department,Team Size\n";
    const rows = managerList.map(m => `${m.name},${m.department},${m.teamSize}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "manager_report.csv");
  };
  

<Dialog open={isAddManagerOpen} onClose={() => setIsAddManagerOpen(false)} className="fixed z-50 inset-0 flex items-center justify-center">
  <div className="bg-gray-800 rounded-lg p-6 shadow-2xl max-w-md w-full mx-auto">
    <h2 className="text-xl font-bold mb-4 text-purple-400">Add New Manager</h2>
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Manager Name"
        className="w-full p-2 rounded bg-gray-700 text-white"
        value={newManager.name}
        onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Department"
        className="w-full p-2 rounded bg-gray-700 text-white"
        value={newManager.department}
        onChange={(e) => setNewManager({ ...newManager, department: e.target.value })}
      />
      <input
        type="number"
        placeholder="Team Size"
        className="w-full p-2 rounded bg-gray-700 text-white"
        value={newManager.teamSize}
        onChange={(e) => setNewManager({ ...newManager, teamSize: parseInt(e.target.value) })}
      />
      <div className="flex justify-end gap-2">
        <button onClick={() => setIsAddManagerOpen(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
        <button
          onClick={() => {
            setManagerList([...managerList, {
              ...newManager,
              id: Date.now(),
              avatar: 'https://via.placeholder.com/40'
            }]);
            setNewManager({ name: '', department: '', teamSize: 0 });
            setIsAddManagerOpen(false);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</Dialog>


  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar />
      
      <motion.div className="flex-1 overflow-y-auto relative"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        <div className="max-w-7xl mx-auto p-6">
          <motion.div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Manager Portal
            </h1>
            
            <div className="flex gap-4 w-full md:w-auto">
            <motion.button 
              onClick={() => setIsAddManagerOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 flex items-center gap-2 w-full md:w-auto justify-center"
            >
             <FiPlus />
             <span>Add Manager</span>
           </motion.button>
           <Dialog 
  open={isAddManagerOpen} 
  onClose={() => setIsAddManagerOpen(false)} 
  className="fixed z-50 inset-0 flex items-center justify-center"
>
  <div className="bg-gray-800 rounded-lg p-6 shadow-2xl max-w-md w-full mx-auto">
    <h2 className="text-xl font-bold mb-4 text-purple-400">Add New Manager</h2>
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Manager Name*"
        className="w-full p-2 rounded bg-gray-700 text-white"
        value={newManager.name}
        onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Department*"
        className="w-full p-2 rounded bg-gray-700 text-white"
        value={newManager.department}
        onChange={(e) => setNewManager({ ...newManager, department: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Team Size*"
        className="w-full p-2 rounded bg-gray-700 text-white"
        value={newManager.teamSize || ''}
        onChange={(e) => setNewManager({ ...newManager, teamSize: Math.max(0, parseInt(e.target.value)) })}
        min="0"
        required
      />
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => {
            setIsAddManagerOpen(false);
            setNewManager({ name: '', department: '', teamSize: 0 });
          }} 
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!newManager.name || !newManager.department) {
              alert('Please fill all required fields');
              return;
            }
            setManagerList([...managerList, {
              ...newManager,
              id: Date.now(),
              avatar: 'https://via.placeholder.com/40',
              teamSize: newManager.teamSize || 0
            }]);
            setNewManager({ name: '', department: '', teamSize: 0 });
            setIsAddManagerOpen(false);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
        >
          Add Manager
        </button>
      </div>
    </div>
  </div>
</Dialog>
           <motion.button 
              onClick={generateCSVReport}
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
          <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            
            {activeTab === 'directory' && <ManagerDirectory
      selectedManager={selectedManager}
      setSelectedManager={setSelectedManager}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      departmentFilter={departmentFilter}
      setDepartmentFilter={setDepartmentFilter}
    />}
            {activeTab === 'analytics' && <AnalyticsTab />}
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
            {managerList.map((manager) => (
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
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedManagerForAssignment(manager);
                    }}
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

    {/* Add Members Dialog */}
    <Dialog 
      open={!!selectedManagerForAssignment} 
      onClose={() => setSelectedManagerForAssignment(null)}
      className="fixed z-50 inset-0 flex items-center justify-center"
    >
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl max-w-md w-full">
        <h3 className="text-lg font-bold mb-4 text-purple-400">
          Assign Employees to {selectedManagerForAssignment?.name}
        </h3>
        <div className="space-y-4">
          {unassignedEmployees.map(employee => (
            <div key={employee.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
              <div>
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm text-gray-300">{employee.role}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-sm"
                onClick={() => handleAssignEmployee(employee.id)}
              >
                Assign
              </motion.button>
            </div>
          ))}
          {unassignedEmployees.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              No unassigned employees available
            </div>
          )}
        </div>
      </div>
    </Dialog>

    {/* Unassigned Employees */}
    <div className="bg-gray-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-green-400">
          Unassigned Employees ({unassignedEmployees.length})
        </h3>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            className="pl-10 pr-4 py-2 bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={unassignedSearch}
            onChange={(e) => setUnassignedSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnassignedEmployees.map((employee) => (
          <motion.div
            key={employee.id}
            className="bg-gray-600 rounded-lg p-4 flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-500 mr-3 flex items-center justify-center">
                <FiUser className="text-gray-300" />
              </div>
              <div>
                <div className="font-medium">{employee.name}</div>
                <div className="text-sm text-gray-300">{employee.role}</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center"
              onClick={() => setSelectedManagerForAssignment(null)}
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