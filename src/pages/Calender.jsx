import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaPlus, FaFilter, FaCheckCircle, FaTimesCircle, FaEdit, FaClock, FaUsers, FaCalendarDay, FaTag, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { navLinks } from '../components/navbarConfig';

const CalendarPage = () => {
  const location = useLocation();
  const role = location.state?.role || { 
    role: 'Employee', 
    department: 'General', // Added default department
    id: 'default-user' 
  };

  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    departments: [],
    eventTypes: [],
    statuses: [],
    categories: []
  });

  if (!role || !role.role) {
    return <div className="p-6 text-red-500 font-semibold">User role is not loaded yet.</div>;
  }

  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: 'Team Meeting',
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 2)),
        type: 'meeting',
        category: 'professional',
        department: 'Engineering',
        organizerId: 'manager1',
        attendees: ['employee1', 'employee2'],
        status: 'confirmed',
        visibility: 'department'
      },
      {
        id: 2,
        title: 'Vacation Request',
        start: new Date(new Date().setDate(new Date().getDate() + 5)),
        allDay: true,
        type: 'timeoff',
        category: 'personal',
        department: 'Engineering',
        status: 'pending',
        visibility: 'private'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const eventTypeColors = {
    meeting: '#3B82F6',
    deadline: '#EF4444',
    training: '#10B981',
    timeoff: '#F59E0B'
  };

  const permissions = {
    Admin: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true,
      viewScope: 'all'
    },
    Manager: {
      canCreate: true,
      canEdit: (event) => event.department === (role?.department || 'General'),
      canDelete: (event) => event.department === (role?.department || 'General'),
      canApprove: true,
      viewScope: 'department'
    },
    Employee: {
      canCreate: true,
      canEdit: (event) => event.organizerId === role?.id,
      canDelete: false,
      canApprove: false,
      viewScope: 'personal'
    }
  };

  const currentPermissions = permissions[role.role] || permissions.Employee;

  const handleDateSelect = (selectInfo) => {
    if (!currentPermissions.canCreate) return;
    setSelectedEvent({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay
    });
    setShowCreateModal(true);
  };

  const handleEventSubmit = (newEvent) => {
    if (!selectedEvent) return;
    
    const eventWithPermissions = {
      ...newEvent,
      start: selectedEvent.start,
      end: selectedEvent.end,
      organizerId: role?.id || 'unknown',
      department: role.role === 'Admin' 
        ? newEvent.department 
        : role?.department || 'General',
      status: (role.role === 'Employee' ? 'pending' : 'confirmed') || 'pending', // Default status
      category: newEvent.category || 'general'
    };
    
    setEvents([...events, eventWithPermissions]);
    setShowCreateModal(false);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event.extendedProps;
    const canEdit = typeof currentPermissions.canEdit === 'function'
      ? currentPermissions.canEdit(event)
      : currentPermissions.canEdit;

    setSelectedEvent({
      ...clickInfo.event,
      canEdit,
      canDelete: currentPermissions.canDelete
    });
  };

  const handleApproval = (eventId, status) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, status } : event
    ));
  };

  const filteredEvents = events.filter(event => {
    const viewScopeFilter = currentPermissions.viewScope === 'all' ? true :
      event.visibility === 'company' ? true :
      currentPermissions.viewScope === 'department' ?
        (event.department === (role?.department || 'General') || event.visibility === 'department') :
        (event.organizerId === role?.id || event.attendees?.includes(role?.id));
  
    const departmentMatch = filters.departments.length === 0 || 
      filters.departments.includes(event.department || 'General');
    const typeMatch = filters.eventTypes.length === 0 || 
      filters.eventTypes.includes(event.type);
    const statusMatch = filters.statuses.length === 0 || 
      filters.statuses.includes(event.status || 'pending'); // Fallback to 'pending'
    const categoryMatch = role.role === 'Admin' ? 
      (filters.categories.length === 0 || filters.statuses.includes(event.category)) : true;
  
    return viewScopeFilter && departmentMatch && typeMatch && statusMatch && categoryMatch;
  });

  const [isNavOpen, setIsNavOpen] = useState(true); 

  const eventFormFields = (
    <>
      {role.role === 'Admin' && (
        <>
          <div>
            <label className="block text-sm text-blue-200 mb-2">Department</label>
            <select
              name="department"
              required
              className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
            >
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-blue-200 mb-2">Visibility</label>
            <select
              name="visibility"
              required
              className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
            >
              <option value="department">Department</option>
              <option value="company">Company</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-blue-200 mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
            >
              <option value="personal">Personal</option>
              <option value="professional">Professional</option>
              <option value="team">Team</option>
            </select>
          </div>
        </>
      )}
    </>
  );

  // Add analytics section for Admin
  const analyticsSection = role.role === 'Admin' && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl rounded-xl p-6 mb-6 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {/* Analytics cards */}
    </motion.div>
  );

  
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
  {/* Sidebar Navigation */}
  <Navbar />

  {/* Main Content Area */}
  <div className="flex-1 p-6 overflow-auto">
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {role.role} Calendar
          </h1>
          <div className="flex gap-3">
  {currentPermissions.canCreate && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        const now = new Date();
        setSelectedEvent({
          start: now,
          end: new Date(now.getTime() + 60 * 60 * 1000),
          allDay: false
        });
        setShowCreateModal(true);
      }}
      className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-2 rounded-xl hover:shadow-lg transition-all"
    >
      <FaPlus className="text-lg" />
      <span>New Event</span>
    </motion.button>
  )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/20 border border-white/10"
            >
              <FaFilter className="text-lg" />
              <span>Filters</span>
            </motion.button>
          </div>
        </motion.div>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 border border-white/10"
            >
              {/* Departments Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">Departments</label>
                <select
                  multiple
                  className="w-full bg-white/5 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 border border-white/10"
                  onChange={(e) => setFilters({ ...filters, departments: Array.from(e.target.selectedOptions, o => o.value) })}
                  disabled={role.role === 'Employee'}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">Human Resources</option>
                </select>
              </div>

              {/* Event Types Filter */}
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-200">Event Types</label>
                <select
                  multiple
                  className="w-full bg-white/5 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 border border-white/10"
                  onChange={(e) => setFilters({ ...filters, eventTypes: Array.from(e.target.selectedOptions, o => o.value) })}
                >
                  <option value="meeting">Meetings</option>
                  <option value="deadline">Deadlines</option>
                  {role.role !== 'Employee' && <option value="timeoff">Time Off</option>}
                </select>
              </div>

              {/* Status Filter */}
              {role.role !== 'Employee' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-200">Status</label>
                  <select
                    multiple
                    className="w-full bg-white/5 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 border border-white/10"
                    onChange={(e) => setFilters({ ...filters, statuses: Array.from(e.target.selectedOptions, o => o.value) })}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 shadow-2xl"
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={filteredEvents}
            selectable={currentPermissions.canCreate}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-2 m-1 rounded-lg backdrop-blur-sm"
                style={{
                  borderLeft: `4px solid ${eventTypeColors[eventInfo.event.extendedProps.type]}`,
                  background: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
                }}
              >
                <div className="font-medium text-sm">{eventInfo.event.title}</div>
                {role.role !== 'Employee' && (
                   <div className="text-xs text-blue-200 mt-1">
                   {eventInfo.event.extendedProps.department || 'General'}
                 </div>
                )}
                {eventInfo.event.extendedProps.status === 'pending' && (
                  <div className="text-xs text-yellow-400 mt-1">
                     {eventInfo.event.extendedProps.status || 'Pending Approval'}
                 </div>
                )}
              </motion.div>
            )}
          />
        </motion.div>

        {/* Event Create/Edit Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 w-full max-w-md border border-white/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Create New Event</h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full"
                  >
                    <FaTimesCircle className="text-xl text-red-400" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleEventSubmit({
                    title: formData.get('title'),
                    start: selectedEvent.start,
                    end: selectedEvent.end,
                    type: formData.get('type'),
                    department: role.role === 'Admin' 
                      ? formData.get('department') 
                      : role.department,
                    description: formData.get('description'),
                    visibility: formData.get('visibility')
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-blue-200 mb-2">Event Title</label>
                      <input
                        name="title"
                        required
                        className="w-full bg-white/5 rounded-lg p-3 border border-white/10 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {role.role === 'Admin' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-blue-200">Categories</label>
          <select
            multiple
            className="w-full bg-white/5 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 border border-white/10"
            onChange={(e) => setFilters({ ...filters, categories: Array.from(e.target.selectedOptions, o => o.value) })}
          >
            <option value="personal">Personal</option>
            <option value="professional">Professional</option>
            <option value="team">Team</option>
          </select>
        </div>
      )}
      
      {/* Updated event display with category and visibility */}
      <div className="flex items-center gap-3">
  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
    <FaTag className="text-green-400" />
  </div>
  <div>
    <p className="text-sm text-blue-200">Category</p>
    <p>{selectedEvent?.extendedProps?.category || 'Not specified'}</p>
  </div>
</div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-blue-200 mb-2">Start Time</label>
                        <input
                          type="datetime-local"
                          className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
                          defaultValue={selectedEvent?.start?.toISOString().slice(0, 16) || ''}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-200 mb-2">End Time</label>
                        <input
                          type="datetime-local"
                          className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
                          defaultValue={selectedEvent?.end?.toISOString().slice(0, 16) || ''}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg hover:shadow-lg"
                      >
                        Create Event
                      </motion.button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Detail Modal */}
        <AnimatePresence>
        {selectedEvent && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-gray-800 to-blue-900/30 rounded-2xl p-8 max-w-md w-full border border-white/10"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
          <button 
            onClick={() => setSelectedEvent(null)}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <FaTimesCircle className="text-xl text-red-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FaCalendarDay className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Date & Time</p>
              <p className="font-mono">
                {selectedEvent.start?.toLocaleDateString()} •{' '}
                {selectedEvent.start?.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Department - Corrected Section */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FaUsers className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-blue-200">Department</p>
              <p>{selectedEvent?.extendedProps?.department || 'General'}</p>
            </div>
          </div>

                  {selectedEvent.extendedProps.status === 'pending' && currentPermissions.canApprove && (
                    <motion.div 
                      className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-yellow-300">Awaiting Approval</p>
                          <p className="text-xs text-yellow-500/80">Submitted by {selectedEvent.extendedProps.organizer}</p>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleApproval(selectedEvent.id, 'confirmed')}
                            className="px-4 py-2 bg-green-600/30 backdrop-blur-sm rounded-lg flex items-center gap-2 border border-green-500/30 hover:border-green-400/50"
                          >
                            <FaCheckCircle className="text-green-400" />
                            <span>Approve</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleApproval(selectedEvent.id, 'cancelled')}
                            className="px-4 py-2 bg-red-600/30 backdrop-blur-sm rounded-lg flex items-center gap-2 border border-red-500/30 hover:border-red-400/50"
                          >
                            <FaTimesCircle className="text-red-400" />
                            <span>Reject</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedEvent.canEdit && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowCreateModal(true)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-center justify-center gap-2"
                    >
                      <FaEdit className="text-blue-400" />
                      <span>Edit Event</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalendarPage;