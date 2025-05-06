import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { coreNavigation, roleBasedNavigation } from '../components/navbarConfig'; // Adjust the import path as necessary


export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const location = useLocation();
  const storedRole = localStorage.getItem('role') || 'Employee';
  const role = storedRole.charAt(0).toUpperCase() + storedRole.slice(1).toLowerCase();
  
  // Get saved permissions from localStorage
  const savedPermissions = localStorage.getItem('rolesPermissions');
  const rolesPermissions = savedPermissions ? JSON.parse(savedPermissions) : {};
  
  // Filter navigation links based on permissions
  const getFilteredNavLinks = () => {
    const allLinks = [
      ...coreNavigation,
      ...(roleBasedNavigation[role] || []),
      ...(roleBasedNavigation.commonEnd || [])
    ];
    
    if (rolesPermissions[role.toLowerCase()]) {
      const allowedPages = rolesPermissions[role.toLowerCase()].pages;
      return allLinks.filter(link => 
        allowedPages.includes(link.label) || 
        link.path === '/logout'
      );
    }
    
    return allLinks;
  };

  const navLinks = getFilteredNavLinks();

  return (
    <motion.nav
      className={`bg-gradient-to-b from-blue-800 to-blue-900 backdrop-blur-xl p-4 flex flex-col shadow-2xl ${isNavOpen ? 'w-72' : 'w-20'}`}
      initial={{ width: 72 }}
      animate={{ width: isNavOpen ? 288 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex-grow space-y-4 relative">
        {navLinks.map((item, idx) => (
          <div key={idx}>
            {/* Section Headings */}
            {item.section && isNavOpen && (
              <h3 className="text-xs uppercase text-blue-300 mt-4 mb-2 tracking-wider">
                {item.section}
              </h3>
            )}

            {/* Navigation Items */}
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all group
                ${isActive ? 'bg-blue-600/30 border-l-4 border-blue-300' : 'hover:bg-blue-700/30'}
                ${isNavOpen ? 'pl-4' : 'justify-center'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-xl ${isActive ? 'text-blue-100' : 'text-blue-200'} group-hover:text-blue-50`}>
                    {item.icon}
                  </span>
                  {isNavOpen && (
                    <span className={`text-sm ${isActive ? 'text-white' : 'text-blue-100'} group-hover:text-white`}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </div>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsNavOpen(!isNavOpen)}
        className="mt-auto p-3 rounded-lg hover:bg-blue-700/30 text-blue-200 hover:text-white transition-colors"
        aria-label={isNavOpen ? 'Collapse menu' : 'Expand menu'}
      >
        {isNavOpen ? (
          <div className="flex items-center gap-2">
            <FaChevronLeft className="text-lg" />
            <span className="text-sm">Collapse</span>
          </div>
        ) : (
          <FaChevronRight className="text-lg mx-auto" />
        )}
      </button>
    </motion.nav>
  );
}
