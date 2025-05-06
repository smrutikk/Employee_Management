// components/ManagerDirectory.jsx
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FiSearch, FiChevronDown, FiUsers, FiEdit, FiMessageSquare, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import { managers, departments, performanceData, timeline } from './data';

const ManagerDirectory = ({ selectedManager, setSelectedManager, searchTerm, 
  setSearchTerm, departmentFilter, setDepartmentFilter,
  setManagerList }) => {
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedManager, setEditedManager] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [newTask, setNewTask] = useState('');
  const [newFeedback, setNewFeedback] = useState('');
  const [newMember, setNewMember] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [managerToDeactivate, setManagerToDeactivate] = useState(null);


  const filteredManagers = managers.filter(manager => {
    const search = (searchTerm || '').toLowerCase();
    const name = (manager.name || '').toLowerCase();
    const role = (manager.role || '').toLowerCase();
    const department = (manager.department || '').toLowerCase();

    const matchesSearch = name.includes(search) || role.includes(search);
    const matchesDepartment = departmentFilter === 'all' || 
      department === departmentFilter.toLowerCase();

    return matchesSearch && matchesDepartment;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hover: { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.3)", transition: { duration: 0.3 } }
  };

  const handleDeactivateClick = (manager) => {
    setManagerToDeactivate(manager);
    setIsConfirmOpen(true);
  };
  

  const handleStatusToggle = (id, e) => {
    e.stopPropagation();
    const manager = managers.find(m => m.id === id);
    
    if (manager.status === 'active') {
      // For deactivation, show confirmation dialog
      setManagerToDeactivate(manager);
      setIsConfirmOpen(true);
    } else {
      // For activation, proceed immediately
      updateManagerStatus(id, 'active');
    }
  };

  const confirmDeactivation = () => {
    if (!managerToDeactivate) return;
  
    // Optionally: prevent re-deactivation
    if (managerToDeactivate.status === 'inactive') {
      setIsConfirmOpen(false);
      setManagerToDeactivate(null);
      return;
    }
  
    // Update the status of the selected manager
    setManagerList(prevManagers =>
      prevManagers.map(manager =>
        manager.id === managerToDeactivate.id
          ? { ...manager, status: 'inactive' }
          : manager
      )
    );
  
    // Close the modal and clear selected manager
    setIsConfirmOpen(false);
    setManagerToDeactivate(null);
  };
  
  

  const cancelDeactivation = () => {
    setIsConfirmOpen(false);
    setManagerToDeactivate(null);
  };
  

  const updateManagerStatus = (id, newStatus) => {
    setManagerList(prev =>
      prev.map(manager => {
        if (manager.id === id) {
          return { ...manager, status: newStatus };
        }
        return manager;
      })
    );

    // If we're currently viewing the manager being updated, update the selectedManager
    if (selectedManager && selectedManager.id === id) {
      setSelectedManager({ ...selectedManager, status: newStatus });
    }
  };

  // Edit Profile Functions
  const handleEdit = (manager) => {
    setEditedManager({...manager});
    setIsEditOpen(true);
  };

  const saveEdits = () => {
    setManagerList(prev => 
      prev.map(m => m.id === editedManager.id ? editedManager : m)
    );
    setIsEditOpen(false);
  };

  // Team Management Functions
  const handleAddTeamMember = () => {
    if (!newMember.trim()) return;
  
    const newId = Date.now();
    const updatedManager = {
      ...selectedManager,
      teamMembers: [
        ...selectedManager.teamMembers,
        { id: newId, name: newMember.trim() }
      ]
    };
  
    setSelectedManager(updatedManager);
    setManagerList(prev =>
      prev.map(manager =>
        manager.id === selectedManager.id ? updatedManager : manager
      )
    );
    setNewMember('');
  };

  // Task Management Functions
  const handleAddTask = () => {
    if (!newTask.trim()) return;
  
    const updatedTasks = [
      ...selectedManager.tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
      },
    ];
  
    const updatedManager = {
      ...selectedManager,
      tasks: updatedTasks,
    };
  
    setSelectedManager(updatedManager);
    setManagerList((prev) =>
      prev.map((manager) =>
        manager.id === selectedManager.id ? updatedManager : manager
      )
    );
    setNewTask('');
  };
  
  const handleToggleTask = (taskId) => {
    const updatedTasks = selectedManager.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
  
    const updatedManager = {
      ...selectedManager,
      tasks: updatedTasks,
    };
  
    setSelectedManager(updatedManager);
    setManagerList((prev) =>
      prev.map((manager) =>
        manager.id === selectedManager.id ? updatedManager : manager
      )
    );
  };

  const handleRemoveTeamMember = (memberId) => {
    if (!selectedManager) return;
  
    const updatedManager = {
      ...selectedManager,
      teamMembers: selectedManager.teamMembers.filter(member => member.id !== memberId)
    };
  
    setSelectedManager(updatedManager);
    setManagerList(prev =>
      prev.map(manager =>
        manager.id === selectedManager.id ? updatedManager : manager
      )
    );
  };
  
  const handleApprovalAction = (approvalId, action) => {
    const updatedApprovals = selectedManager.approvals.filter(
      (approval) => approval.id !== approvalId
    );
  
    const updatedManager = {
      ...selectedManager,
      approvals: updatedApprovals,
    };
  
    setSelectedManager(updatedManager);
    setManagerList((prev) =>
      prev.map((manager) =>
        manager.id === selectedManager.id ? updatedManager : manager
      )
    );
  };
  
  const handleSubmitFeedback = () => {
    if (!newFeedback.trim()) return;
  
    const newFeedbackItem = {
      id: Date.now(),
      text: newFeedback,
      author: 'Anonymous',
    };
  
    const updatedFeedback = [...selectedManager.feedback, newFeedbackItem];
    const updatedManager = {
      ...selectedManager,
      feedback: updatedFeedback,
    };
  
    setSelectedManager(updatedManager);
    setManagerList(prev =>
      prev.map(manager =>
        manager.id === selectedManager.id ? updatedManager : manager
      )
    );
    setNewFeedback('');
  };

  const combinedVariants = {
    ...containerVariants,
    ...cardVariants
  };

  return (
    <div className="space-y-6">
      {/* Confirmation Dialog for Deactivation */}
      {isConfirmOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 shadow-2xl max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4 text-red-400">Confirm Deactivation</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to deactivate {managerToDeactivate?.name}? 
              This will restrict their access to the system.
            </p>
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelDeactivation}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => confirmDeactivation()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
              >
                Confirm Deactivate
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search and Filter Section */}
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
      
      {/* Edit Profile Dialog */}
      {isEditOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 shadow-2xl max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4 text-purple-400">Edit Profile</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={editedManager?.name || ''}
                onChange={(e) => setEditedManager({...editedManager, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Department"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={editedManager?.department || ''}
                onChange={(e) => setEditedManager({...editedManager, department: e.target.value})}
              />
              <div className="flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditOpen(false)} 
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveEdits}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Message Dialog */}
      {isMessageOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-lg p-6 shadow-2xl max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4 text-blue-400">Message {selectedManager?.name}</h2>
            <textarea
              className="w-full p-2 rounded bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Write your message here..."
            />
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMessageOpen(false)} 
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsMessageOpen(false);
                  setMessageContent('');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Manager List or Profile */}
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
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center justify-center gap-2"
                    onClick={() => handleEdit(selectedManager)}
                  >
                    <FiEdit /> Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                      selectedManager.status === 'active' 
                        ? 'bg-red-600 hover:bg-red-500' 
                        : 'bg-green-600 hover:bg-green-500'
                    }`}
                    onClick={() => {
                      if (selectedManager.status === 'active') {
                        setManagerToDeactivate(selectedManager);
                        setIsConfirmOpen(true);
                      } else {
                        updateManagerStatus(selectedManager.id, 'active');
                      }
                    }}
                  >
                    {selectedManager.status === 'active' ? 'Deactivate' : 'Activate'}
                  </motion.button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="md:w-2/3 space-y-6">
                {/* Tabs */}
                <div className="flex border-b border-gray-600">
                  {['overview', 'assigned-team', 'approvals', 'tasks', 'feedback'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 ${
                        activeTab === tab 
                          ? 'border-b-2 border-purple-500 text-purple-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <>
                    {/* Overview */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-blue-400">Performance Overview</h3>
                      <div className="bg-gray-800 rounded-lg p-4 h-64">
                        {/* Chart placeholder */}
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
                  </>
                )}

                {activeTab === 'assigned-team' && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add team member"
                        className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
                        onClick={handleAddTeamMember}
                      >
                        <FiPlus />
                      </motion.button>
                    </div>
                    <div className="space-y-2">
                      {selectedManager.teamMembers.map(member => (
                        <div key={member.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                          <span>{member.name}</span>
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleRemoveTeamMember(member.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'approvals' && (
                  <div className="space-y-4">
                    {selectedManager.approvals.map(approval => (
                      <div key={approval.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{approval.title}</h4>
                          <p className="text-gray-300 text-sm">{approval.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="text-green-400"
                            onClick={() => handleApprovalAction(approval.id, 'approve')}
                          >
                            <FiCheck size={20} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="text-red-400"
                            onClick={() => handleApprovalAction(approval.id, 'reject')}
                          >
                            <FiX size={20} />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'tasks' && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new task"
                        className="flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
                        onClick={handleAddTask}
                      >
                        <FiPlus />
                      </motion.button>
                    </div>
                    <div className="space-y-2">
                      {selectedManager.tasks.map(task => (
                        <div key={task.id} className="flex items-center bg-gray-700 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="mr-3"
                          />
                          <span className={task.completed ? 'text-gray-400 line-through' : ''}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'feedback' && (
                  <div className="space-y-4">
                    <textarea
                      className="w-full p-2 rounded bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Write your feedback..."
                      value={newFeedback}
                      onChange={(e) => setNewFeedback(e.target.value)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
                      onClick={handleSubmitFeedback}
                    >
                      Submit Feedback
                    </motion.button>
                    <div className="space-y-4">
                      {selectedManager.feedback.map(fb => (
                        <div key={fb.id} className="bg-gray-700 p-4 rounded-lg">
                          <p className="text-gray-300">{fb.text}</p>
                          <div className="text-sm text-gray-400 mt-2">- {fb.author}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    setSelectedManager(manager);
                  }}
                >
                  View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    manager.status === 'active' 
                      ? 'bg-red-600 hover:bg-red-500' 
                      : 'bg-green-600 hover:bg-green-500'
                  }`}
                  onClick={(e) => handleStatusToggle(manager.id, e)}
                >
                  {manager.status === 'active' ? 'Deactivate' : 'Activate'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ManagerDirectory;