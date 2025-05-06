import { motion } from 'framer-motion';
import { FiList } from 'react-icons/fi';
import { useState } from 'react';
import moment from 'moment';
import { tasks as initialTasksData } from './teamOverviewData';
import Navbar from '../../components/Navbar';
import { navLinks } from '../../components/navbarConfig';

export const TaskManagement = ({ initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks || initialTasksData || []);
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const taskStats = tasks.reduce((acc, task) => {
    acc.total++;
    if (task.status === 'completed') acc.completed++;
    if (task.status === 'in-progress') acc.inProgress++;
    if (moment(task.dueDate).isBefore(moment(), 'day') && task.status !== 'completed') acc.overdue++;
    return acc;
  }, { total: 0, completed: 0, inProgress: 0, overdue: 0 });

  // Task form handling
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignee: '',
    project: '',
    dueDate: '',
    priority: 'medium',
    status: 'not-started'
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!taskForm.title.trim()) errors.title = 'Title is required';
    if (!taskForm.dueDate) errors.dueDate = 'Due date is required';
    if (moment(taskForm.dueDate).isBefore(moment(), 'day')) errors.dueDate = 'Due date cannot be in the past';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNewTask = () => {
    setShowModal(true);
    setTaskForm({
      title: '',
      description: '',
      assignee: '',
      project: '',
      dueDate: '',
      priority: 'medium',
      status: 'not-started'
    });
    setFormErrors({});
    setIsEditing(false);
    setSelectedTask(null); 
  };

  const handleEditTask = (task) => {
    setTaskForm({
      ...task,
      dueDate: moment(task.dueDate).format('YYYY-MM-DD')
    });
    setFormErrors({});
    setIsEditing(true);
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleSaveTask = () => {
    if (!validateForm()) return;
    
    const updatedTask = {
      ...taskForm,
      dueDate: moment(taskForm.dueDate).format('YYYY-MM-DD')
    };

    setTasks(prev => isEditing 
      ? prev.map(t => t.id === updatedTask.id ? updatedTask : t)
      : [...prev, { ...updatedTask, id: Date.now() }]
    );

    setShowModal(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setShowModal(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedTaskFilter === 'overdue') {
      return moment(task.dueDate).isBefore(moment(), 'day') && task.status !== 'completed';
    }
    return selectedTaskFilter === 'all' || task.status === selectedTaskFilter;
  });

  const TaskForm = ({ taskForm, setTaskForm, formErrors, onSave, onCancel, isEditing, onDelete }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-xl mb-4">{isEditing ? 'Edit Task' : 'New Task'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Task Title"
                className="w-full bg-gray-700 rounded-lg p-3"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
              />
              {formErrors.title && <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>}
            </div>
            <textarea
              placeholder="Description"
              className="w-full bg-gray-700 rounded-lg p-3 h-32"
              value={taskForm.description}
              onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
            />
            <select
              className="w-full bg-gray-700 rounded-lg p-3"
              value={taskForm.priority}
              onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="space-y-4">
            <div>
              <input
                type="date"
                className="w-full bg-gray-700 rounded-lg p-3"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
              />
              {formErrors.dueDate && <p className="text-red-400 text-sm mt-1">{formErrors.dueDate}</p>}
            </div>
            <input
              type="text"
              placeholder="Assignee"
              className="w-full bg-gray-700 rounded-lg p-3"
              value={taskForm.assignee}
              onChange={(e) => setTaskForm({...taskForm, assignee: e.target.value})}
            />
            <input
              type="text"
              placeholder="Project"
              className="w-full bg-gray-700 rounded-lg p-3"
              value={taskForm.project}
              onChange={(e) => setTaskForm({...taskForm, project: e.target.value})}
            />
            <select
              className="w-full bg-gray-700 rounded-lg p-3"
              value={taskForm.status}
              onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          {isEditing && (
            <button 
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
          <button 
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            onClick={onSave}
          >
            Save Task
          </button>
        </div>
      </motion.div>
    </div>
  );

  const ViewModal = ({ task, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-xl mb-4">{task.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Project:</strong> {task.project}</p>
            <p><strong>Priority:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full ${task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                task.priority === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'}`}>
                {task.priority}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p><strong>Assignee:</strong> {task.assignee}</p>
            <p><strong>Due Date:</strong> {moment(task.dueDate).format('MMM D, YYYY')}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                task.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'}`}>
                {task.status}
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="w-screen h-screen  bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar />
      
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
  <h2 className="text-xl font-semibold flex items-center gap-2">
    <FiList className="text-blue-400" /> Task Management
  </h2>
  <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto items-stretch md:items-center">
    <select 
      className="bg-gray-700 rounded-lg px-4 py-2 w-full sm:w-auto"
      value={selectedTaskFilter}
      onChange={(e) => setSelectedTaskFilter(e.target.value)}
    >
      <option value="all">All Tasks</option>
      <option value="completed">Completed</option>
      <option value="in-progress">In Progress</option>
      <option value="overdue">Overdue</option>
    </select>
    <button 
      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
      onClick={handleNewTask}
    >
      + New Task
    </button>
  </div>
</div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Tasks" value={taskStats.total} color="purple" />
            <StatCard label="Completed" value={taskStats.completed} color="green" />
            <StatCard label="In Progress" value={taskStats.inProgress} color="yellow" />
            <StatCard label="Overdue" value={taskStats.overdue} color="red" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr className="text-left">
                  <th className="p-3">Task</th>
                  <th className="p-3">Assignee</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <tr key={task.id} className="border-t border-gray-700 hover:bg-gray-700/20">
                      <td className="p-3">{task.title}</td>
                      <td className="p-3">{task.assignee}</td>
                      <td className="p-3">{task.project}</td>
                      <td className="p-3">{moment(task.dueDate).format('MMM D, YYYY')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full ${
                          task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          task.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button 
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                            onClick={() => handleEditTask(task)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={() => {
                              setSelectedTask(task);
                              setShowModal(true);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-400">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showModal && (
            selectedTask ? 
              <ViewModal task={selectedTask} onClose={() => setShowModal(false)} /> : 
              <TaskForm 
                taskForm={taskForm} 
                setTaskForm={setTaskForm} 
                formErrors={formErrors}
                onSave={handleSaveTask}
                onCancel={() => setShowModal(false)}
                isEditing={isEditing}
                onDelete={isEditing ? () => handleDeleteTask(taskForm.id) : null}
              />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="p-4 rounded-lg border border-gray-700 bg-gray-700/20 hover:bg-gray-700/30 transition-colors">
      <div className={`text-2xl font-bold mb-2 ${colors[color]}`}>{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
};