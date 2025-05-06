import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheckCircle, FiMail, FiCalendar, FiUserPlus, FiUserX, 
  FiList, FiChevronDown, FiChevronRight, FiPlus, FiTrash2,
  FiEdit2, FiMoreVertical, FiX, FiSave
} from 'react-icons/fi';
import moment from 'moment';
import Navbar from '../../components/Navbar';
import { navLinks } from '../../components/navbarConfig';

const OnboardingExit = () => {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [expandedSections, setExpandedSections] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [emailContent, setEmailContent] = useState('');
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    interviewer: '',
    notes: ''
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'onboarding'
  });
  const [newTask, setNewTask] = useState({
    name: '',
    description: ''
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(null);

  // State for templates and employees
  const [onboardingTemplates, setOnboardingTemplates] = useState([
    {
      id: 1,
      name: 'Standard Developer Onboarding',
      description: 'Standard onboarding process for developers',
      tasks: [
        { id: 1, name: 'Setup email account', description: 'Create company email', completed: true },
        { id: 2, name: 'Provision laptop', description: 'Order and setup work laptop', completed: true },
        { id: 3, name: 'Grant system access', description: 'Provide access to required systems', completed: false },
        { id: 4, name: 'Schedule orientation', description: 'Schedule new hire orientation', completed: false }
      ]
    },
    {
      id: 2,
      name: 'Manager Onboarding',
      description: 'Onboarding process for management roles',
      tasks: [
        { id: 1, name: 'Setup email account', description: 'Create company email', completed: true },
        { id: 2, name: 'HR orientation', description: 'HR policies and procedures', completed: false },
        { id: 3, name: 'Leadership training', description: 'Leadership development program', completed: false }
      ]
    }
  ]);

  const [exitTemplates, setExitTemplates] = useState([
    {
      id: 1,
      name: 'Standard Exit Process',
      description: 'Standard process for employee exits',
      tasks: [
        { id: 1, name: 'Equipment return', description: 'Collect company equipment', completed: false },
        { id: 2, name: 'Access revocation', description: 'Revoke system access', completed: false },
        { id: 3, name: 'Exit interview', description: 'Conduct exit interview', completed: false }
      ]
    }
  ]);

  const [upcomingOnboardings, setUpcomingOnboardings] = useState([
    { id: 1, name: 'John Doe', position: 'Frontend Developer', startDate: '2025-06-15', template: 'Standard Developer' },
    { id: 2, name: 'Jane Smith', position: 'HR Manager', startDate: '2025-06-20', template: 'Manager Onboarding' }
  ]);

  const [upcomingExits, setUpcomingExits] = useState([
    { id: 1, name: 'Mike Johnson', position: 'Backend Developer', lastDay: '2025-06-30', template: 'Standard Exit Process' }
  ]);

  // Helper functions
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTaskToggle = (templateId, taskId, isOnboarding) => {
    const updateTemplates = (templates) => 
      templates.map(template => {
        if (template.id === templateId) {
          return {
            ...template,
            tasks: template.tasks.map(task => 
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          };
        }
        return template;
      });

    if (isOnboarding) {
      setOnboardingTemplates(updateTemplates(onboardingTemplates));
    } else {
      setExitTemplates(updateTemplates(exitTemplates));
    }
  };

  // Email functions
  const sendWelcomeEmail = (employee) => {
    setSelectedEmployee(employee);
    setEmailContent(`Dear ${employee.name},\n\nWelcome to our team! We're excited to have you on board as our new ${employee.position}.\n\nYour start date is ${moment(employee.startDate).format('MMMM D, YYYY')}.\n\nBest regards,\nThe HR Team`);
    setShowEmailModal(true);
  };

  const handleSendEmail = () => {
    // In a real app, you would call an API here
    console.log('Email sent to:', 'smrutikumbhalkar2003@gmail.com'); // Changed to actual email
    console.log('Content:', emailContent);
    
    // Create a mailto link that will open the user's default email client
    const subject = "Welcome to Our Team!";
    const body = encodeURIComponent(emailContent);
    window.open(`mailto:kumbhalkar@gmail.com?subject=${subject}&body=${body}`);
    
    setShowEmailModal(false);
    setSelectedEmployee(null);
  };

  // Interview functions
  const scheduleExitInterview = (employee) => {
    setSelectedEmployee(employee);
    setInterviewDetails({
      employeeName: employee.name,
      employeePosition: employee.position,
      date: '',
      interviewer: '',
      notes: ''
    });
    setShowInterviewModal(true);
  };

  const handleScheduleInterview = () => {
    // In a real app, you would call an API here
    console.log('Interview scheduled for:', selectedEmployee.name);
    console.log('Details:', interviewDetails);
    setShowInterviewModal(false);
    setSelectedEmployee(null);
  };

  // Template functions
  const openNewTemplateModal = (type) => {
    setNewTemplate({
      name: '',
      description: '',
      type: type
    });
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = () => {
    const newTemplateObj = {
      id: Date.now(),
      name: newTemplate.name,
      description: newTemplate.description,
      tasks: []
    };

    if (newTemplate.type === 'onboarding') {
      setOnboardingTemplates([...onboardingTemplates, newTemplateObj]);
    } else {
      setExitTemplates([...exitTemplates, newTemplateObj]);
    }

    setShowTemplateModal(false);
  };

  // Task functions
  const openNewTaskModal = (templateId, isOnboarding) => {
    setSelectedTemplate({ id: templateId, isOnboarding });
    setNewTask({
      name: '',
      description: ''
    });
    setShowTaskModal(true);
  };

  const handleAddTask = () => {
    const newTaskObj = {
      id: Date.now(),
      name: newTask.name,
      description: newTask.description,
      completed: false
    };

    const updateTemplates = (templates) => 
      templates.map(template => {
        if (template.id === selectedTemplate.id) {
          return {
            ...template,
            tasks: [...template.tasks, newTaskObj]
          };
        }
        return template;
      });

    if (selectedTemplate.isOnboarding) {
      setOnboardingTemplates(updateTemplates(onboardingTemplates));
    } else {
      setExitTemplates(updateTemplates(exitTemplates));
    }

    setShowTaskModal(false);
  };

  // Delete functions
  const deleteTemplate = (templateId, isOnboarding) => {
    if (isOnboarding) {
      setOnboardingTemplates(onboardingTemplates.filter(t => t.id !== templateId));
    } else {
      setExitTemplates(exitTemplates.filter(t => t.id !== templateId));
    }
    setShowOptions(null);
  };

  const deleteTask = (templateId, taskId, isOnboarding) => {
    const updateTemplates = (templates) => 
      templates.map(template => {
        if (template.id === templateId) {
          return {
            ...template,
            tasks: template.tasks.filter(task => task.id !== taskId)
          };
        }
        return template;
      });

    if (isOnboarding) {
      setOnboardingTemplates(updateTemplates(onboardingTemplates));
    } else {
      setExitTemplates(updateTemplates(exitTemplates));
    }
    setShowOptions(null);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar />
      
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with tabs */}
          <div className="flex border-b border-gray-700">
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'onboarding' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
              onClick={() => setActiveTab('onboarding')}
            >
              <FiUserPlus /> Onboarding
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'exit' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
              onClick={() => setActiveTab('exit')}
            >
              <FiUserX /> Exit Process
            </button>
          </div>

          {/* Main content */}
          {activeTab === 'onboarding' ? (
            <div className="space-y-6">
              {/* Upcoming onboardings */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiCalendar className="text-blue-400" /> Upcoming Onboardings
                  </h3>
                  <button className="text-sm text-purple-400 hover:text-purple-300 self-end sm:self-auto">
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {upcomingOnboardings.map(employee => (
                    <div key={employee.id} className="p-3 bg-gray-700/50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-400">{employee.position} • Starts {moment(employee.startDate).format('MMM D, YYYY')}</p>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button 
                          className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                          onClick={() => sendWelcomeEmail(employee)}
                          title="Send welcome email"
                        >
                          <FiMail />
                        </button>
                        <button 
                          className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                          title="View tasks"
                        >
                          <FiList />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Onboarding templates */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiList className="text-yellow-400" /> Onboarding Templates
                  </h3>
                  <button 
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 self-end sm:self-auto"
                    onClick={() => openNewTemplateModal('onboarding')}
                  >
                    <FiPlus /> New Template
                  </button>
                </div>
                
                <div className="space-y-3">
                  {onboardingTemplates.map(template => (
                    <div key={template.id} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div 
                        className="p-3 bg-gray-700/50 flex justify-between items-center cursor-pointer hover:bg-gray-700/60 transition-colors"
                        onClick={() => toggleSection(`onboarding-${template.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{template.name}</span>
                          {template.description && (
                            <span className="text-xs text-gray-400">{template.description}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {expandedSections[`onboarding-${template.id}`] ? <FiChevronDown /> : <FiChevronRight />}
                          <button 
                            className="p-1 text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowOptions(showOptions === `onboarding-${template.id}` ? null : `onboarding-${template.id}`);
                            }}
                          >
                            <FiMoreVertical />
                          </button>
                        </div>
                      </div>
                      
                      {showOptions === `onboarding-${template.id}` && (
                        <div className="p-2 bg-gray-700/80 flex justify-end gap-2">
                          <button 
                            className="p-1 text-red-400 hover:text-red-300"
                            onClick={() => deleteTemplate(template.id, true)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      )}
                      
                      {expandedSections[`onboarding-${template.id}`] && (
                        <div className="p-3 space-y-2">
                          {template.tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-700/20 rounded transition-colors group">
                              <button
                                className={`w-5 h-5 rounded flex items-center justify-center ${task.completed ? 'bg-green-500/20 text-green-400' : 'border border-gray-500'}`}
                                onClick={() => handleTaskToggle(template.id, task.id, true)}
                              >
                                {task.completed && <FiCheckCircle size={14} />}
                              </button>
                              <div className="flex-1">
                                <span className={task.completed ? 'line-through text-gray-400' : ''}>
                                  {task.name}
                                </span>
                                {task.description && (
                                  <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                                )}
                              </div>
                              <button 
                                className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteTask(template.id, task.id, true)}
                              >
                                <FiX />
                              </button>
                            </div>
                          ))}
                          <button 
                            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-2"
                            onClick={() => openNewTaskModal(template.id, true)}
                          >
                            <FiPlus /> Add Task
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upcoming exits */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiCalendar className="text-red-400" /> Upcoming Exits
                  </h3>
                  <button className="text-sm text-purple-400 hover:text-purple-300 self-end sm:self-auto">
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {upcomingExits.map(employee => (
                    <div key={employee.id} className="p-3 bg-gray-700/50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-400">{employee.position} • Last day {moment(employee.lastDay).format('MMM D, YYYY')}</p>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button 
                          className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                          onClick={() => scheduleExitInterview(employee)}
                          title="Schedule exit interview"
                        >
                          <FiCalendar />
                        </button>
                        <button 
                          className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                          title="View tasks"
                        >
                          <FiList />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exit templates */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiList className="text-yellow-400" /> Exit Templates
                  </h3>
                  <button 
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 self-end sm:self-auto"
                    onClick={() => openNewTemplateModal('exit')}
                  >
                    <FiPlus /> New Template
                  </button>
                </div>
                
                <div className="space-y-3">
                  {exitTemplates.map(template => (
                    <div key={template.id} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div 
                        className="p-3 bg-gray-700/50 flex justify-between items-center cursor-pointer hover:bg-gray-700/60 transition-colors"
                        onClick={() => toggleSection(`exit-${template.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{template.name}</span>
                          {template.description && (
                            <span className="text-xs text-gray-400">{template.description}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {expandedSections[`exit-${template.id}`] ? <FiChevronDown /> : <FiChevronRight />}
                          <button 
                            className="p-1 text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowOptions(showOptions === `exit-${template.id}` ? null : `exit-${template.id}`);
                            }}
                          >
                            <FiMoreVertical />
                          </button>
                        </div>
                      </div>
                      
                      {showOptions === `exit-${template.id}` && (
                        <div className="p-2 bg-gray-700/80 flex justify-end gap-2">
                          <button 
                            className="p-1 text-red-400 hover:text-red-300"
                            onClick={() => deleteTemplate(template.id, false)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      )}
                      
                      {expandedSections[`exit-${template.id}`] && (
                        <div className="p-3 space-y-2">
                          {template.tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-700/20 rounded transition-colors group">
                              <button
                                className={`w-5 h-5 rounded flex items-center justify-center ${task.completed ? 'bg-green-500/20 text-green-400' : 'border border-gray-500'}`}
                                onClick={() => handleTaskToggle(template.id, task.id, false)}
                              >
                                {task.completed && <FiCheckCircle size={14} />}
                              </button>
                              <div className="flex-1">
                                <span className={task.completed ? 'line-through text-gray-400' : ''}>
                                  {task.name}
                                </span>
                                {task.description && (
                                  <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                                )}
                              </div>
                              <button 
                                className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteTask(template.id, task.id, false)}
                              >
                                <FiX />
                              </button>
                            </div>
                          ))}
                          <button 
                            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-2"
                            onClick={() => openNewTaskModal(template.id, false)}
                          >
                            <FiPlus /> Add Task
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Welcome Email Modal */}
          {showEmailModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Send Welcome Email to {selectedEmployee?.name}
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">To: {selectedEmployee?.name} &lt;{selectedEmployee?.name.toLowerCase().replace(' ', '.')}@company.com&gt;</p>
                  <p className="text-sm text-gray-400">Subject: Welcome to Our Team!</p>
                </div>
                <textarea
                  className="w-full h-64 bg-gray-700 rounded-lg p-4 mb-4"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <button 
                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowEmailModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={handleSendEmail}
                  >
                    Send Email
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Exit Interview Modal */}
          {showInterviewModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Schedule Exit Interview for {interviewDetails.employeeName}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Interview Date</label>
                    <input
                      type="datetime-local"
                      className="w-full bg-gray-700 rounded-lg p-3"
                      value={interviewDetails.date}
                      onChange={(e) => setInterviewDetails({...interviewDetails, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Interviewer</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 rounded-lg p-3"
                      value={interviewDetails.interviewer}
                      onChange={(e) => setInterviewDetails({...interviewDetails, interviewer: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      className="w-full bg-gray-700 rounded-lg p-3 h-32"
                      value={interviewDetails.notes}
                      onChange={(e) => setInterviewDetails({...interviewDetails, notes: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowInterviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={handleScheduleInterview}
                  >
                    Schedule Interview
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* New Template Modal */}
          {showTemplateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Create New {newTemplate.type === 'onboarding' ? 'Onboarding' : 'Exit'} Template
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Template Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 rounded-lg p-3"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full bg-gray-700 rounded-lg p-3 h-32"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                      placeholder="Enter template description"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowTemplateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={handleSaveTemplate}
                  >
                    Save Template
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* New Task Modal */}
          {showTaskModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div 
                className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <h3 className="text-xl font-semibold mb-4">
                  Add New Task
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Task Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 rounded-lg p-3"
                      value={newTask.name}
                      onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                      placeholder="Enter task name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      className="w-full bg-gray-700 rounded-lg p-3 h-32"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Enter task description"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={handleAddTask}
                  >
                    Add Task
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingExit;