import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  FaPlus, FaFilter, FaCheckCircle, FaTimesCircle, FaEdit, 
  FaClock, FaUsers, FaCalendarDay, FaTag, FaEye, FaUser,
  FaRepeat, FaRegClock
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const CalendarPage = () => {
  const location = useLocation();
  const role = location.state?.role || { 
    role: 'Employee', 
    department: 'General',
    id: 'default-user',
    email: 'user@company.com'
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

  // New state for event creation
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState('none');
  const [selectedAttendees, setSelectedAttendees] = useState([]);

  const mockAttendees = [
    { id: 'emp1', name: 'John Doe', email: 'john@company.com' },
    { id: 'emp2', name: 'Jane Smith', email: 'jane@company.com' },
    { id: 'mgr1', name: 'Manager Bob', email: 'bob@company.com' },
  ];

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
        attendees: ['emp1', 'emp2'],
        status: 'confirmed',
        visibility: 'department',
        recurrence: 'weekly',
        allDay: false
      },
      {
        id: 2,
        title: 'Project Deadline',
        start: new Date(new Date().setDate(new Date().getDate() + 3)),
        allDay: true,
        type: 'deadline',
        category: 'professional',
        department: 'Marketing',
        status: 'confirmed',
        recurrence: 'none'
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

  const handleEventSubmit = (newEvent) => {
    if (!selectedEvent) return;
    
    const eventWithPermissions = {
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9),
      start: selectedEvent.start,
      end: selectedEvent.end,
      organizerId: role?.id,
      organizerEmail: role?.email,
      department: role.role === 'Admin' ? newEvent.department : role?.department,
      status: role.role === 'Employee' ? 'pending' : 'confirmed',
      category: newEvent.category || 'general',
      recurrence: recurrence,
      allDay: isAllDay,
      attendees: selectedAttendees
    };
    
    setEvents([...events, eventWithPermissions]);
    setShowCreateModal(false);
    setIsAllDay(false);
    setRecurrence('none');
    setSelectedAttendees([]);
  };

  // Enhanced Event Creation Modal
  const EventCreationModal = () => (
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
            type: formData.get('type'),
            description: formData.get('description'),
            category: formData.get('category'),
            visibility: formData.get('visibility'),
            department: formData.get('department')
          });
        }}>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-blue-200 mb-2">Event Title</label>
                <input
                  name="title"
                  required
                  className="w-full bg-white/5 rounded-lg p-3 border border-white/10 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-blue-200 mb-2">Type</label>
                <select
                  name="type"
                  required
                  className="bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="training">Training</option>
                  {role.role !== 'Employee' && <option value="timeoff">Time Off</option>}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-blue-200 mb-2">Start</label>
                <input
                  type="datetime-local"
                  className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
                  defaultValue={selectedEvent?.start?.toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-blue-200 mb-2">End</label>
                <input
                  type="datetime-local"
                  className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
                  defaultValue={selectedEvent?.end?.toISOString().slice(0, 16)}
                  required
                  disabled={isAllDay}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span className="text-sm">All Day Event</span>
              </label>
              <div className="flex-1">
                <label className="block text-sm text-blue-200 mb-2">Repeat</label>
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value)}
                  className="w-full bg-white/5 rounded-lg p-2 border border-white/10"
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {(role.role === 'Admin' || role.role === 'Manager') && (
              <div>
                <label className="block text-sm text-blue-200 mb-2">Attendees</label>
                <select
                  multiple
                  value={selectedAttendees}
                  onChange={(e) => setSelectedAttendees(Array.from(e.target.selectedOptions, o => o.value))}
                  className="w-full bg-white/5 rounded-lg p-2 h-32 border border-white/10"
                >
                  {mockAttendees.map(attendee => (
                    <option key={attendee.id} value={attendee.id}>
                      {attendee.name} ({attendee.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {role.role === 'Admin' && (
              <>
                <div>
                  <label className="block text-sm text-blue-200 mb-2">Department</label>
                  <select
                    name="department"
                    className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
                    defaultValue={role.department}
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
                    className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <option value="department">Department</option>
                    <option value="company">Company</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-blue-200 mb-2">Description</label>
              <textarea
                name="description"
                rows="3"
                className="w-full bg-white/5 rounded-lg p-3 border border-white/10"
                placeholder="Add event details..."
              />
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
                {selectedEvent?.id ? 'Update Event' : 'Create Event'}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  // Enhanced Event Display
  const renderEventContent = (eventInfo) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-2 m-1 rounded-lg backdrop-blur-sm cursor-pointer"
      style={{
        borderLeft: `4px solid ${eventTypeColors[eventInfo.event.extendedProps.type]}`,
        background: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
      }}
    >
      <div className="font-medium text-sm flex items-center gap-2">
        {eventInfo.event.title}
        {eventInfo.event.extendedProps.recurrence !== 'none' && (
          <FaRepeat className="text-xs text-purple-300" />
        )}
      </div>
      <div className="text-xs text-blue-200 mt-1 flex items-center gap-2">
        <FaRegClock className="text-xs" />
        {eventInfo.event.extendedProps.allDay ? 'All Day' : 
          `${eventInfo.event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          ${eventInfo.event.end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }
      </div>
      {eventInfo.event.extendedProps.attendees?.length > 0 && (
        <div className="text-xs text-green-300 mt-1 flex items-center gap-1">
          <FaUser className="text-xs" />
          {eventInfo.event.extendedProps.attendees.length} attendees
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header and other existing components remain the same */}

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
            eventContent={renderEventContent}
          />

          {/* Event Create Modal */}
          <AnimatePresence>
            {showCreateModal && <EventCreationModal />}
          </AnimatePresence>

          {/* Enhanced Event Detail Modal */}
          {selectedEvent && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center"
              /* ... existing motion props ... */
            >
              {/* ... existing modal structure ... */}
              
              <div className="space-y-4">
                {/* Recurrence Info */}
                {selectedEvent.extendedProps.recurrence !== 'none' && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <FaRepeat className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Recurrence</p>
                      <p className="capitalize">{selectedEvent.extendedProps.recurrence}</p>
                    </div>
                  </div>
                )}

                {/* Attendees List */}
                {selectedEvent.extendedProps.attendees?.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FaUsers className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Attendees</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedEvent.extendedProps.attendees.map(attendee => (
                          <span 
                            key={attendee}
                            className="px-2 py-1 bg-white/5 rounded-full text-xs"
                          >
                            {mockAttendees.find(a => a.id === attendee)?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;