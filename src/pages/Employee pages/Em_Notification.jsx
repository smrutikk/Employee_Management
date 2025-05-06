import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBell, FiCheck, FiTrash2, FiFilter, 
  FiStar, FiAlertCircle, FiInfo, FiMail 
} from 'react-icons/fi';
import Navbar from '../../components/Navbar';

const NotificationsPage = () => {
  // Sample notifications data - replace with API calls in production
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      title: 'New task assigned',
      message: 'You have been assigned to complete the Q3 dashboard by Friday',
      timestamp: '2025-04-15T09:30:00Z',
      read: false,
      important: true
    },
    {
      id: 2,
      type: 'approval',
      title: 'Leave request approved',
      message: 'Your leave request for August 20-25 has been approved',
      timestamp: '2025-04-14T14:15:00Z',
      read: true,
      important: false
    },
    {
      id: 3,
      type: 'system',
      title: 'System maintenance',
      message: 'There will be scheduled maintenance this Saturday from 2-4 AM',
      timestamp: '2025-04-30T11:45:00Z',
      read: true,
      important: false
    },
    {
      id: 4,
      type: 'message',
      title: 'New message from Sarah',
      message: 'Regarding the client presentation we need to prepare',
      timestamp: '2025-05-2T16:20:00Z',
      read: false,
      important: false
    },
    {
      id: 5,
      type: 'deadline',
      title: 'Upcoming deadline',
      message: 'Project submission deadline is approaching in 2 days',
      timestamp: '2025-05-1T08:10:00Z',
      read: false,
      important: true
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'important') return notification.important;
    return notification.type === filter;
  });

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'task':
        return <FiCheck className="text-blue-400" />;
      case 'approval':
        return <FiStar className="text-green-400" />;
      case 'system':
        return <FiInfo className="text-purple-400" />;
      case 'message':
        return <FiMail className="text-yellow-400" />;
      case 'deadline':
        return <FiAlertCircle className="text-red-400" />;
      default:
        return <FiBell className="text-gray-400" />;
    }
  };

  // Format timestamp to relative time (e.g., "2 hours ago")
  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return 'Just now';
  };

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
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <FiBell className="text-2xl text-purple-400" />
              <h1 className="text-2xl font-bold">Notifications</h1>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"
              >
                <FiCheck /> Mark all as read
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"
              >
                <FiFilter /> Filter
              </button>
            </div>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <motion.div 
              className="bg-gray-700 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  All Notifications
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-2 rounded-lg text-sm ${filter === 'unread' ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  Unread Only
                </button>
                <button
                  onClick={() => setFilter('important')}
                  className={`px-3 py-2 rounded-lg text-sm ${filter === 'important' ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  Important
                </button>
                <button
                  onClick={() => setFilter('task')}
                  className={`px-3 py-2 rounded-lg text-sm ${filter === 'task' ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setFilter('approval')}
                  className={`px-3 py-2 rounded-lg text-sm ${filter === 'approval' ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  Approvals
                </button>
                <button
                  onClick={() => setFilter('message')}
                  className={`px-3 py-2 rounded-lg text-sm ${filter === 'message' ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  Messages
                </button>
                <button
                  onClick={() => setFilter('system')}
                  className={`px-3 py-2 rounded-lg text-sm ${filter === 'system' ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  System
                </button>
                <button
                  onClick={() => setFilter('deadline')}
                  className={`px-3 py-2 rounded-lg text-sm ${filter === 'deadline' ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  Deadlines
                </button>
              </div>
            </motion.div>
          )}

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-gray-700/20 rounded-lg p-8 text-center border border-dashed border-gray-600">
                <p className="text-gray-400">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${notification.read ? 'border-gray-700 bg-gray-700/20' : 'border-purple-500/50 bg-purple-900/10'} ${notification.important ? 'border-l-4 border-l-yellow-400' : ''}`}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-gray-400">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">{notification.message}</p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-gray-400 hover:text-white"
                        title="Mark as read"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-400"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Clear All Button (shown only when there are notifications) */}
          {filteredNotifications.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-600/50"
              >
                Clear All Notifications
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationsPage;