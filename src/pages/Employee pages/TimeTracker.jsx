import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiPlay, FiPause, FiStopCircle, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiCalendar, FiEdit, FiTrash } from 'react-icons/fi';
import Navbar from '../../components/Navbar';

const TimeTracker = () => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [viewMode, setViewMode] = useState('daily');
    const [editingTask, setEditingTask] = useState(null);

    // Format time as HH:MM:SS
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    const groupedTimesheets = useMemo(() => {
        const groups = {};
        
        const getWeekRange = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            const start = new Date(date.setDate(diff));
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            return {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0],
                label: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
            };
        };

        tasks.forEach(task => {
            let key;
            if (viewMode === 'daily') {
                key = task.date;
            } else {
                const week = getWeekRange(task.date);
                key = `${week.start}_${week.end}`;
            }

            if (!groups[key]) {
                groups[key] = {
                    key,
                    tasks: [],
                    totalTime: 0,
                    status: 'draft',
                    ...(viewMode === 'weekly' ? getWeekRange(task.date) : { date: task.date })
                };
            }

            groups[key].tasks.push(task);
            groups[key].totalTime += task.time;
            
            // Determine group status
            if (task.status === 'rejected') groups[key].status = 'rejected';
            else if (task.status === 'approved') groups[key].status = groups[key].status !== 'rejected' ? 'approved' : groups[key].status;
            else if (task.status === 'pending' && groups[key].status === 'draft') groups[key].status = 'pending';
        });

        return Object.values(groups).sort((a, b) => 
            new Date(viewMode === 'daily' ? b.date : b.start) - new Date(viewMode === 'daily' ? a.date : a.start)
        );
    }, [tasks, viewMode]);

    // Submit timesheet
    const handleSubmitTimesheet = (group) => {
        const updatedTasks = tasks.map(task => 
            group.tasks.includes(task) ? { ...task, status: 'pending' } : task
        );
        setTasks(updatedTasks);
    };

    // Edit task
    const handleEditTask = (task) => {
        const newDescription = prompt('Edit task description:', task.task);
        if (newDescription) {
            const updatedTasks = tasks.map(t => 
                t.id === task.id ? { ...t, task: newDescription } : t
            );
            setTasks(updatedTasks);
        }
    };

    // Delete task
    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    // Start timer
    const handleStart = () => {
        if (!currentTask.trim()) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        setIsActive(true);
        setIsPaused(false);
        setTimerStarted(true);
    };

    // Handle pause timer
    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    // Stop timer and save task
    const handleStop = () => {
        if (time > 0) {
            const newTask = {
                id: Date.now(),
                task: currentTask,
                time: time,
                date: new Date().toISOString().split('T')[0],
                status: 'draft'
            };
            setTasks([...tasks, newTask]);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
        resetTimer();
    };

    // Reset timer
    const resetTimer = () => {
        setIsActive(false);
        setIsPaused(false);
        setTimerStarted(false);
        setTime(0);
        setCurrentTask('');
    };

    // Calculate total tracked time
    const totalTrackedTime = tasks.reduce((sum, task) => sum + task.time, 0);

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
            <Navbar />
            
            <div className="flex-1 overflow-auto p-6">
                <motion.div 
                    className="bg-gray-800 rounded-xl p-6 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FiClock className="text-2xl text-purple-400" />
                        <h1 className="text-2xl font-bold">Time Tracker</h1>
                    </div>

                    {/* Alerts */}
                    {showSuccess && (
                        <motion.div
                            className="mb-6 p-4 bg-green-900/30 rounded-lg border border-green-600 flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <FiCheckCircle className="text-green-400 text-xl" />
                            <p>Time entry saved successfully!</p>
                        </motion.div>
                    )}

                    {showError && (
                        <motion.div
                            className="mb-6 p-4 bg-red-900/30 rounded-lg border border-red-600 flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <FiAlertCircle className="text-red-400 text-xl" />
                            <p>Please enter a task description before starting!</p>
                        </motion.div>
                    )}

                    {/* New View Mode Toggle */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setViewMode('daily')}
                            className={`px-4 py-2 rounded-lg ${
                                viewMode === 'daily' ? 'bg-purple-600' : 'bg-gray-700'
                            }`}
                        >
                            <FiCalendar className="inline mr-2" /> Daily View
                        </button>
                        <button
                            onClick={() => setViewMode('weekly')}
                            className={`px-4 py-2 rounded-lg ${
                                viewMode === 'weekly' ? 'bg-purple-600' : 'bg-gray-700'
                            }`}
                        >
                            <FiCalendar className="inline mr-2" /> Weekly View
                        </button>
                    </div>

                    {/* Time Tracker Card */}
                    <div className="bg-gray-700/30 rounded-xl p-6 mb-8 border border-gray-600">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Task Input */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Task Description
                                </label>
                                <input
                                    type="text"
                                    value={currentTask}
                                    onChange={(e) => setCurrentTask(e.target.value)}
                                    placeholder="What are you working on?"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    disabled={isActive}
                                />
                            </div>

                            {/* Timer Display */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-4xl font-mono font-bold bg-gray-800 px-6 py-3 rounded-lg mb-2">
                                    {formatTime(time)}
                                </div>
                                <div className="text-sm text-gray-400">
                                    {isActive ? (isPaused ? 'Paused' : 'Tracking...') : 'Ready to track'}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 mt-8">
                            {!timerStarted ? (
                                <button
                                    onClick={handleStart}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                                >
                                    <FiPlay /> Start Tracking
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handlePause}
                                        className={`flex items-center gap-2 px-6 py-3 ${isPaused ? 'bg-purple-600 hover:bg-purple-700' : 'bg-yellow-600 hover:bg-yellow-700'} rounded-lg font-medium transition-colors`}
                                    >
                                        {isPaused ? <FiPlay /> : <FiPause />} {isPaused ? 'Resume' : 'Pause'}
                                    </button>
                                    <button
                                        onClick={handleStop}
                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                                    >
                                        <FiStopCircle /> Stop & Save
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                    >
                                        <FiRefreshCw /> Reset
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700">
                            <h3 className="text-sm font-medium text-blue-300 mb-1">Today's Time</h3>
                            <p className="text-2xl font-bold">{formatTime(time)}</p>
                        </div>
                        <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-700">
                            <h3 className="text-sm font-medium text-purple-300 mb-1">Total Tracked</h3>
                            <p className="text-2xl font-bold">{formatTime(totalTrackedTime)}</p>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
                            <h3 className="text-sm font-medium text-green-300 mb-1">Tasks Completed</h3>
                            <p className="text-2xl font-bold">{tasks.length}</p>
                        </div>
                    </div>

                    {/* Timesheet Groups */}
                    <div className="space-y-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            {viewMode === 'daily' ? 'Daily Timesheets' : 'Weekly Timesheets'}
                        </h2>
                        
                        {groupedTimesheets.length === 0 ? (
                            <div className="bg-gray-700/20 rounded-lg p-8 text-center border border-dashed border-gray-600">
                                <p className="text-gray-400">No timesheets yet. Start tracking to see them here.</p>
                            </div>
                        ) : (
                            groupedTimesheets.map(group => (
                                <div key={group.key} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                        <div className="mb-2 md:mb-0">
                                            <h3 className="text-lg font-semibold">
                                                {viewMode === 'daily' ? 
                                                    new Date(group.date).toLocaleDateString() : 
                                                    group.label
                                                }
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Total: {formatTime(group.totalTime)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                group.status === 'draft' ? 'bg-gray-600 text-gray-300' :
                                                group.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                                                group.status === 'approved' ? 'bg-green-600 text-green-100' :
                                                'bg-red-600 text-red-100'
                                            }`}>
                                                {group.status.toUpperCase()}
                                            </span>
                                            {group.status === 'draft' && (
                                                <button
                                                    onClick={() => handleSubmitTimesheet(group)}
                                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                                                >
                                                    Submit Timesheet
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-600">
                                                    <th className="text-left p-3">Task</th>
                                                    <th className="text-left p-3">Time</th>
                                                    <th className="text-left p-3">Status</th>
                                                    {group.status === 'draft' && <th className="text-left p-3">Actions</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.tasks.map(task => (
                                                    <tr key={task.id} className="border-b border-gray-800 hover:bg-gray-700/20">
                                                        <td className="p-3">{task.task}</td>
                                                        <td className="p-3">{formatTime(task.time)}</td>
                                                        <td className="p-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                task.status === 'draft' ? 'bg-gray-600 text-gray-300' :
                                                                task.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                                                                task.status === 'approved' ? 'bg-green-600 text-green-100' :
                                                                'bg-red-600 text-red-100'
                                                            }`}>
                                                                {task.status}
                                                            </span>
                                                        </td>
                                                        {group.status === 'draft' && (
                                                            <td className="p-3 flex gap-2">
                                                                <button
                                                                    onClick={() => handleEditTask(task)}
                                                                    className="text-blue-400 hover:text-blue-300"
                                                                >
                                                                    <FiEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteTask(task.id)}
                                                                    className="text-red-400 hover:text-red-300"
                                                                >
                                                                    <FiTrash />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TimeTracker;