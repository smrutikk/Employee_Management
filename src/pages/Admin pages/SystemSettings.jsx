import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { navLinks } from '../../components/navbarConfig';
import { FiSettings, FiUsers, FiLock, FiCheckSquare, FiChevronDown, FiSave } from 'react-icons/fi';

const SystemSettings = () => {
  const user = "admin";
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('Employee');
  const [activeTab, setActiveTab] = useState('accessControl');
  const [expandedRoles, setExpandedRoles] = useState({});


  const [rolesPermissions, setRolesPermissions] = useState(() => {
  const savedPermissions = localStorage.getItem('rolesPermissions');
  return savedPermissions ? JSON.parse(savedPermissions) : {
    admin: {
      pages: ['Dashboard','Calendar','Notifications','Leave Management',
        'Attendance', 'Team Overview', 'Onboarding', 'Task Manager', 
        'Settings'],
      editable: true
    },
    employee: {
      pages: ['Dashboard','Calendar','Notifications','Time Tracker',
        'Leave Request', 'My Objectives', 'Feedback Portal', 'Settings'],
      editable: true
    }
  };
})

useEffect(() => {
  const storedRole = localStorage.getItem('role') || 'Employee';
  const formattedRole = storedRole.charAt(0).toUpperCase() + storedRole.slice(1).toLowerCase();
  setUserRole(formattedRole);
}, []);

  const allPages = ['Dashboard','Calendar','Notifications','Leave Management',
        'Attendance', 'Team Overview', 'Onboarding', 'Task Manager', 
        'Settings','Time Tracker',
        'Leave Request', 'My Objectives', 'Feedback Portal'];

  // Verify admin access
  useEffect(() => {
    if (userRole !== 'Admin') {
      navigate('/settings');
    }
  }, [userRole]);

  if (userRole !== 'Admin') return null;

  const toggleRoleExpansion = (role) => {
    setExpandedRoles(prev => ({ ...prev, [role]: !prev[role] }));
  };

  const handlePermissionChange = (role, page, checked) => {
    if (!rolesPermissions[role].editable) return;

    setRolesPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        pages: checked 
          ? [...prev[role].pages, page]
          : prev[role].pages.filter(p => p !== page)
      }
    }));
  };

  const savePermissions = async () => {
    try {
      localStorage.setItem('rolesPermissions', JSON.stringify(rolesPermissions));
      // API call to save permissions
    //  const response = await fetch('/api/roles/permissions', {
      //  method: 'PUT',
      //  headers: {
      //    'Content-Type': 'application/json',
      //    'Authorization': `Bearer ${user.token}`
       // },
       // body: JSON.stringify(rolesPermissions)
     // });

      //if (!response.ok) throw new Error('Failed to save permissions');
      alert('Permissions updated successfully!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Failed to update permissions');
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar />
      
      <div className="flex-1 overflow-auto p-6">
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FiSettings className="text-2xl text-purple-400" />
              <h1 className="text-2xl font-bold">System Settings</h1>
            </div>
            <button 
              onClick={savePermissions}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiSave className="inline mr-2" /> Save Changes
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${
                activeTab === 'accessControl' 
                  ? 'text-purple-400 border-b-2 border-purple-400' 
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab('accessControl')}
            >
              <FiLock /> Access Control
            </button>
          </div>

          {/* Access Control Content */}
          {activeTab === 'accessControl' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiUsers /> Role-Based Access Management
              </h2>

              {Object.entries(rolesPermissions).map(([role, config]) => (
                <div key={role} className="bg-gray-700/30 rounded-lg p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleRoleExpansion(role)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold capitalize">{role}</span>
                      {!config.editable && (
                        <span className="text-xs text-purple-400 px-2 py-1 bg-purple-900/20 rounded-full">
                          System Role
                        </span>
                      )}
                    </div>
                    <FiChevronDown className={`transform transition-transform ${
                      expandedRoles[role] ? 'rotate-180' : ''
                    }`} />
                  </div>

                  {expandedRoles[role] && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allPages.map(page => (
                        <label 
                          key={page} 
                          className={`flex items-center space-x-2 p-2 rounded-lg ${
                            config.pages.includes(page)
                              ? 'bg-purple-600/20 border border-purple-400'
                              : 'bg-gray-600/20'
                          } ${!config.editable ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={config.pages.includes(page)}
                            onChange={(e) => handlePermissionChange(role, page, e.target.checked)}
                            className="form-checkbox text-purple-400 rounded focus:ring-purple-400"
                            disabled={!config.editable}
                          />
                          <span className="capitalize">{page}</span>
                          {page === 'settings' && (
                            <span className="text-xs text-purple-400 ml-2">
                              (Admin only)
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FiCheckSquare /> Access Control Guidelines
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>System roles (marked with purple badge) cannot be modified</li>
                  <li>Changes take effect immediately after saving</li>
                  <li>The "Settings" page is always admin-only</li>
                  <li>New pages will automatically be restricted to admins</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SystemSettings;