import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FiCalendar, FiPlus, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';

const localizer = momentLocalizer(moment);

export const LeaveCalendar = ({ initialLeaveRequests, initialCalendarEvents }) => {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [calendarEvents, setCalendarEvents] = useState(initialCalendarEvents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    employee: '',
    type: '',
    start: null,
    end: null,
    reason: ''
  });
  const [viewMode, setViewMode] = useState('month');

  // Enhanced Calendar styling
  const calendarStyle = {
    height: '600px',
    backgroundColor: '#1f2937',
    color: '#fff',
    borderRadius: '0.5rem',
    overflow: 'hidden'
  };

  // Custom calendar theme
  const customTheme = {
    calendar: {
      backgroundColor: '#1f2937',
    },
    day: {
      backgroundColor: '#1f2937',
      color: '#fff',
      border: '1px solid #374151'
    },
    today: {
      backgroundColor: '#4b5563',
    },
    event: {
      color: '#fff',
      borderRadius: '4px',
      padding: '2px 4px',
      fontSize: '0.875rem'
    }
  };

  // Handle leave approval/rejection
  const handleRequestAction = (requestId, action) => {
    setLeaveRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: action } : req
      )
    );
    
    setCalendarEvents(prev =>
      prev.map(event =>
        event.id === requestId ? { ...event, status: action } : event
      )
    );
  };

  // Add new leave request
  const handleAddLeave = () => {
    const newId = Date.now();
    const newRequest = {
      ...newLeave,
      id: newId,
      status: 'pending'
    };
    
    setLeaveRequests(prev => [...prev, newRequest]);
    
    setCalendarEvents(prev => [
      ...prev,
      {
        id: newId,
        title: `${newLeave.employee} - ${newLeave.type.charAt(0).toUpperCase() + newLeave.type.slice(1)}`,
        start: newLeave.start,
        end: newLeave.end,
        type: 'leave',
        status: 'pending'
      }
    ]);
    
    setShowAddModal(false);
    setNewLeave({
      employee: '',
      type: '',
      start: null,
      end: null,
      reason: ''
    });
  };

  // Enhanced Custom Calendar Components
  const CustomEvent = ({ event }) => (
    <div className={`p-1 text-sm rounded ${event.status === 'approved' ? 'bg-green-500/30 border-l-4 border-green-500' : 'bg-purple-500/30 border-l-4 border-purple-500'}`}>
      <div className="font-medium truncate">{event.title.split(' - ')[0]}</div>
      <div className="text-xs opacity-80">{event.title.split(' - ')[1]}</div>
    </div>
  );

  const CustomToolbar = ({ label, onView, view }) => (
    <div className="flex justify-between items-center mb-4 p-2 bg-gray-700 rounded-t-lg">
      <span className="text-lg font-semibold">{label}</span>
      <div className="flex gap-2">
        {['month', 'week', 'day'].map(v => (
          <button
            key={v}
            className={`px-3 py-1 rounded-lg text-sm ${view === v ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            onClick={() => onView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const DayHeader = ({ label, date }) => (
    <div className="text-center p-2 text-sm font-medium border-b border-gray-700">
      {label}
    </div>
  );
  
  return (
    <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-6">
            {/* Header and View Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiCalendar className="text-yellow-400" /> Leave Calendar
                </h2>
                <select 
                  className="bg-gray-700 rounded-lg px-3 py-1.5 text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                  <option value="day">Day</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 self-start md:self-auto transition-colors"
                onClick={() => setShowAddModal(true)}
              >
                <FiPlus /> Add Leave
              </motion.button>
            </div>
          
            {/* Calendar and Legend */}
            <div className="relative">
              <div className="mb-3 rounded-lg overflow-hidden border border-gray-700">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  view={viewMode}
                  views={['month', 'week', 'day']}
                  style={calendarStyle}
                  components={{
                    event: CustomEvent,
                    toolbar: CustomToolbar,
                    month: {
                      header: DayHeader
                    },
                    week: {
                      header: DayHeader
                    },
                    day: {
                      header: DayHeader
                    }
                  }}
                  eventPropGetter={(event) => {
                    let backgroundColor = event.status === 'approved' ? '#10b981' : '#8b5cf6';
                    return {
                      style: {
                        backgroundColor: `${backgroundColor}30`,
                        borderLeft: `4px solid ${backgroundColor}`,
                        color: '#fff',
                        borderRadius: '4px'
                      }
                    };
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-sm mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-sm" />
                  <span>Pending Approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-sm" />
                  <span>Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-500 rounded-sm" />
                  <span>Rejected</span>
                </div>
              </div>
            </div>
          
            {/* Pending Approvals */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Pending Approvals ({leaveRequests.filter(r => r.status === 'pending').length})
                </h3>
                <FiAlertCircle className="text-yellow-400" />
              </div>
          
              {leaveRequests.filter(r => r.status === 'pending').length > 0 ? (
                leaveRequests.filter(r => r.status === 'pending').map(request => (
                  <motion.div
                    key={request.id}
                    className="p-4 rounded-lg border border-gray-700 bg-gray-700/20 hover:bg-gray-700/40 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <p className="font-medium flex items-center gap-2">
                          {request.employee}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.type === 'vacation' ? 'bg-blue-500/20 text-blue-400' :
                            request.type === 'sick' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {request.type}
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">
                          {moment(request.start).format('MMM D')} - {moment(request.end).format('MMM D')}
                          ({moment(request.end).diff(request.start, 'days') + 1} days)
                        </p>
                        {request.reason && (
                          <p className="text-sm text-gray-400 italic">"{request.reason}"</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center gap-2 transition-colors"
                          onClick={() => handleRequestAction(request.id, 'approved')}
                        >
                          <FiCheck /> Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-2 transition-colors"
                          onClick={() => handleRequestAction(request.id, 'rejected')}
                        >
                          <FiX /> Reject
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 rounded-lg border border-gray-700 bg-gray-700/20 text-center text-gray-400">
                  No pending leave requests
                </div>
              )}
            </div>
          
            {/* Add Leave Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <motion.div 
                  className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Leave</h3>
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Employee</label>
                      <input
                        type="text"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        value={newLeave.employee}
                        onChange={(e) => setNewLeave({...newLeave, employee: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Leave Type</label>
                      <select
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        value={newLeave.type}
                        onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                      >
                        <option value="">Select type</option>
                        <option value="vacation">Vacation</option>
                        <option value="sick">Sick Leave</option>
                        <option value="personal">Personal</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <input
                          type="date"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          value={newLeave.start ? moment(newLeave.start).format('YYYY-MM-DD') : ''}
                          onChange={(e) => setNewLeave({...newLeave, start: new Date(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        <input
                          type="date"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          value={newLeave.end ? moment(newLeave.end).format('YYYY-MM-DD') : ''}
                          onChange={(e) => setNewLeave({...newLeave, end: new Date(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Reason (Optional)</label>
                      <textarea
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        rows={3}
                        value={newLeave.reason}
                        onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddLeave}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors"
                        disabled={!newLeave.employee || !newLeave.type || !newLeave.start || !newLeave.end}
                      >
                        <FiPlus /> Add Leave
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
  );
};

// Custom Calendar Components
const CustomEvent = ({ event }) => (
    <div className={`p-1 text-sm ${event.status === 'approved' ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
      {event.title}
    </div>
  );
  
  const CustomToolbar = ({ label, onView, view }) => (
    <div className="flex justify-between items-center mb-4">
      <span className="text-lg font-semibold">{label}</span>
      <div className="flex gap-2">
        {['month', 'week', 'day'].map(v => (
          <button
            key={v}
            className={`px-3 py-1 rounded-lg ${view === v ? 'bg-purple-600' : 'bg-gray-700'}`}
            onClick={() => onView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );