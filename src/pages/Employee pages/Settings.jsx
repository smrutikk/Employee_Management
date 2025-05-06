import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, FiLock, FiBell, FiMail, FiCalendar, 
  FiKey, FiEye, FiEyeOff, FiCheck, FiX 
} from 'react-icons/fi';
import Navbar from '../../components/Navbar';

const EmployeeSettings = () => {
  // User data - replace with actual user data from context/API
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Employee',
    department: 'Engineering',
    joinDate: '2022-03-15',
    notificationPrefs: {
      email: true,
      push: true,
      weeklyDigest: false
    }
  });

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    // Here you would typically call an API to change the password
    // For demo purposes, we'll just show a success message
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Toggle notification preference
  const toggleNotificationPref = (pref) => {
    setUser({
      ...user,
      notificationPrefs: {
        ...user.notificationPrefs,
        [pref]: !user.notificationPrefs[pref]
      }
    });
    // Here you would typically call an API to update preferences
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
          <div className="flex items-center gap-3 mb-8">
            <FiUser className="text-2xl text-purple-400" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === 'profile' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              <FiUser /> Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === 'security' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              <FiLock /> Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === 'notifications' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              <FiBell /> Notifications
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiUser /> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
                      {user.role}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
                      {user.department}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Join Date</label>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiMail /> Contact Preferences
                </h2>
                <p className="text-gray-400 mb-4">
                  Update how you prefer to be contacted for work-related communications
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Primary work email</span>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiKey /> Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-400">
                      <FiX /> {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="flex items-center gap-2 text-green-400">
                      <FiCheck /> Password changed successfully!
                    </div>
                  )}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiLock /> Security Sessions
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <div className="font-medium">Chrome on Windows</div>
                      <div className="text-sm text-gray-400">Last active: 2 hours ago</div>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      Sign out
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <div className="font-medium">Safari on iPhone</div>
                      <div className="text-sm text-gray-400">Last active: 3 days ago</div>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiBell /> Notification Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-400">Receive important notifications via email</div>
                    </div>
                    <button
                      onClick={() => toggleNotificationPref('email')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        user.notificationPrefs.email ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          user.notificationPrefs.email ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-400">Get instant alerts on your devices</div>
                    </div>
                    <button
                      onClick={() => toggleNotificationPref('push')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        user.notificationPrefs.push ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          user.notificationPrefs.push ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Digest</div>
                      <div className="text-sm text-gray-400">Summary of weekly activities and updates</div>
                    </div>
                    <button
                      onClick={() => toggleNotificationPref('weeklyDigest')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        user.notificationPrefs.weeklyDigest ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          user.notificationPrefs.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FiCalendar /> Reminder Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Task Reminders</div>
                      <div className="text-sm text-gray-400">Reminders for upcoming task deadlines</div>
                    </div>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white">
                      <option>30 minutes before</option>
                      <option>1 hour before</option>
                      <option>1 day before</option>
                      <option>None</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Meeting Alerts</div>
                      <div className="text-sm text-gray-400">Notifications for scheduled meetings</div>
                    </div>
                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white">
                      <option>15 minutes before</option>
                      <option>30 minutes before</option>
                      <option>1 hour before</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeSettings;