import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiSettings, FiX, FiSlack, FiMail, FiSmartphone } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import Navbar from '../components/Navbar';
import { navLinks } from '../components/navbarConfig';

const NotificationModule = () => {
const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, status: 'read' } : notification
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Template functionality
  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      setTemplates(prev => prev.map(template => 
        template.id === selectedTemplate.id ? selectedTemplate : template
      ));
    } else {
      const newTemplate = {
        id: Date.now(),
        name: selectedTemplate?.name || 'New Template',
        subject: selectedTemplate?.subject || '',
        body: selectedTemplate?.body || '',
        channels: selectedTemplate?.channels || []
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setShowTemplateModal(false);
    setSelectedTemplate(null);
  };

  const handleChannelToggle = (channel) => {
    setSelectedTemplate(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const updateRecipients = (e) => {
    setNotificationSettings(prev => ({
      ...prev,
      defaultRecipients: e.target.value
    }));
  };


  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'leave',
      title: 'New Leave Request',
      message: 'John Doe submitted a leave request for March 20-22',
      channel: ['email', 'in-app'],
      status: 'unread',
      timestamp: new Date().toISOString(),
      recipient: 'HR Manager'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Timesheet Reminder',
      message: 'Reminder to submit weekly timesheet by Friday 5PM',
      channel: ['in-app'],
      status: 'read',
      timestamp: '2024-03-15 08:45',
      recipient: 'All Employees'
    }
  ]);

  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Leave Approval',
      subject: 'Your Leave Request has been {status}',
      body: 'Dear {employee}, your leave from {startDate} to {endDate} has been {status}.',
      channels: ['email', 'in-app'],
      variables: ['status', 'employee', 'startDate', 'endDate']
    }
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    systemNotifications: true,
    defaultRecipients: 'HR Team',
    channels: {
      email: true,
      inApp: true,
      sms: false,
      slack: false
    },
    reminders: {
      timesheet: true,
      timesheetDaysBefore: 1,
      regularization: true,
      documentExpiry: true,
      documentDaysBefore: 7
    },
    workingHours: {
      start: '09:00',
      end: '18:00'
    }
  });

  const [newNotificationRule, setNewNotificationRule] = useState({
    name: '',
    trigger: '',
    recipients: [],
    channels: ['in-app'],
    message: ''
  });

  // Notification Center
  const NotificationCenter = () => {
    const filteredNotifications = notifications.filter(notification => {
      if (selectedTab === 'unread') return notification.status === 'unread';
      if (selectedTab === 'read') return notification.status === 'read';
      return true;
    });

    return (
        <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Notification Center
          </h2>
          <div className="flex gap-2">
          {['all', 'unread', 'read'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg ${
                  selectedTab === tab 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

      <div className="space-y-4">
      {notifications.map(notification => (
          <motion.div
            key={notification.id}
            className={`p-4 rounded-lg border border-gray-700 ${notification.status === 'unread' ? 'bg-gray-700/30' : ''}`}
            whileHover={{ x: 5 }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${notification.type === 'alert' ? 'text-red-400' : 'text-blue-400'}`}>
                    {notification.title}
                  </span>
                  <span className="text-xs text-gray-400">{notification.timestamp}</span>
                </div>
                <p className="text-gray-300 text-sm">{notification.message}</p>
                <div className="flex gap-2 mt-2">
                  {notification.channel.map(ch => (
                    <span key={ch} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => markAsRead(notification.id)}
                className="text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

  // Notification Settings Panel
  const SettingsPanel = () => (
    <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-6">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
        Notification Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-400">System Notifications</h3>
          <ToggleSetting
            label="Enable System Notifications"
            checked={notificationSettings.systemNotifications}
            onChange={() => setNotificationSettings(prev => ({
              ...prev,
              systemNotifications: !prev.systemNotifications
            }))}
          />
          <div className="space-y-2">
            <label className="text-gray-300">Default Recipients</label>
            <select className="bg-gray-700 rounded-lg p-2 w-full">
              <option>HR Team</option>
              <option>Managers</option>
              <option>All Employees</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-400">Channels</h3>
        <ToggleSetting
          label="Email Notifications"
          checked={notificationSettings.channels.email}
          onChange={() => setNotificationSettings(prev => ({
            ...prev,
            channels: { ...prev.channels, email: !prev.channels.email }
          }))}
        />
        <ToggleSetting
          label="SMS Notifications"
          checked={notificationSettings.channels.sms}
          onChange={() => setNotificationSettings(prev => ({
            ...prev,
            channels: { ...prev.channels, sms: !prev.channels.sms }
          }))}
        />
        <ToggleSetting
          label="Slack Notifications"
          checked={notificationSettings.channels.slack}
          onChange={() => setNotificationSettings(prev => ({
            ...prev,
            channels: { ...prev.channels, slack: !prev.channels.slack }
          }))}
        />
        </div>
    </div>
    </motion.div>
  );

  // Enhanced Template Editor Modal
  const TemplateEditor = () => (
    <Dialog
      open={showTemplateModal || !!selectedTemplate}
      onClose={() => {
        setShowTemplateModal(false);
        setSelectedTemplate(null);
      }}
      className="fixed z-50 inset-0 flex items-center justify-center"
    >
      <div className="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-2xl w-full mx-4">
        {/* ... existing template editor */}
        <div className="flex gap-4">
          {['email', 'in-app', 'sms', 'slack'].map(channel => (
            <label key={channel} className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={selectedTemplate?.channels?.includes(channel)}
                onChange={() => handleChannelToggle(channel)}
              />
              {channel}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          {/* ... buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-purple-600 rounded-lg"
            onClick={handleSaveTemplate}
          >
            {selectedTemplate ? 'Update' : 'Create'} Template
          </motion.button>
        </div>
      </div>
    </Dialog>
  );

  // Enhanced Reminder Settings
  const ReminderSettings = () => (
    <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
        Reminder Configuration
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <ToggleSetting
            label="Timesheet Submission Reminders"
            checked={notificationSettings.reminders.timesheet}
            onChange={() => setNotificationSettings(prev => ({
              ...prev,
              reminders: { ...prev.reminders, timesheet: !prev.reminders.timesheet }
            }))}
          />
          <div className="flex items-center gap-2 ml-6">
            <input
              type="number"
              min="1"
              value={notificationSettings.reminders.timesheetDaysBefore}
              onChange={e => setNotificationSettings(prev => ({
                ...prev,
                reminders: { 
                  ...prev.reminders, 
                  timesheetDaysBefore: parseInt(e.target.value) 
                }
              }))}
              className="bg-gray-700 rounded-lg p-2 w-20"
            />
            <span className="text-gray-300">days before deadline</span>
          </div>
        </div>
        {/* ... similar enhancements for other reminders */}
      </div>
    </motion.div>
  );

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar />
      <motion.div 
        className="flex-1 p-6 overflow-y-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <NotificationCenter />
        <SettingsPanel />
        <ReminderSettings />
        <TemplateEditor />

{/* Reminder Settings */}
    <motion.div 
          className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
            Reminder Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <ToggleSetting
      label="Timesheet Submission Reminders"
      checked={notificationSettings.reminders.timesheet}
      onChange={() => setNotificationSettings(prev => ({
        ...prev,
        reminders: { ...prev.reminders, timesheet: !prev.reminders.timesheet }
      }))}
    />
    <ToggleSetting
      label="Document Expiry Reminders"
      checked={notificationSettings.reminders.documentExpiry}
      onChange={() => setNotificationSettings(prev => ({
        ...prev,
        reminders: { ...prev.reminders, documentExpiry: !prev.reminders.documentExpiry }
      }))}
    />
  </div>
    </motion.div>

{/* Custom Rules Section */}
<motion.div 
          className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Custom Notification Rules
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-blue-600 rounded-lg"
              onClick={() => setShowRuleBuilder(true)}
            >
              New Rule
            </motion.button>
          </div>
        </motion.div>

      {/* Template Management */}
      <motion.div 
          className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              Notification Templates
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-purple-600 rounded-lg"
              onClick={() => setShowTemplateModal(true)}
            >
              New Template
            </motion.button>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <motion.div
              key={template.id}
              className="p-4 rounded-lg border border-gray-700 bg-gray-700/20"
              whileHover={{ y: -3 }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-400">{template.name}</h3>
                  <p className="text-sm text-gray-300">{template.subject}</p>
                  <div className="flex gap-2">
                    {template.channels.map(ch => (
                      <span key={ch} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <FiSettings />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Template Editor Modal */}
      <Dialog
          open={showTemplateModal || !!selectedTemplate}
          onClose={() => {
            setShowTemplateModal(false);
            setSelectedTemplate(null);
          }}
          className="fixed z-50 inset-0 flex items-center justify-center"
        >
        <div className="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-2xl w-full mx-4">
          <Dialog.Title className="text-2xl font-bold mb-4 text-purple-400">
            {selectedTemplate ? 'Edit Template' : 'New Template'}
          </Dialog.Title>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Template Name"
              className="bg-gray-700 rounded-lg p-2 w-full"
              value={selectedTemplate?.name || ''}
            />
            <input
              type="text"
              placeholder="Subject"
              className="bg-gray-700 rounded-lg p-2 w-full"
              value={selectedTemplate?.subject || ''}
            />
            <textarea
              placeholder="Message Body"
              className="bg-gray-700 rounded-lg p-2 w-full h-32"
              value={selectedTemplate?.body || ''}
            />
            <div className="flex gap-4">
              {['email', 'in-app', 'sms'].map(channel => (
                <label key={channel} className="flex items-center gap-2">
                  <input type="checkbox" />
                  {channel}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gray-600 rounded-lg"
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-purple-600 rounded-lg"
              >
                Save Template
              </motion.button>
            </div>
          </div>
        </div>
      </Dialog>
      </motion.div>
    </div>
  );
};

// Reusable Toggle Component
const ToggleSetting = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded focus:ring-0 bg-gray-700 border-gray-600"
    />
    <span className="text-gray-300">{label}</span>
  </div>
);

export default NotificationModule;