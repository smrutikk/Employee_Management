import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { navLinks } from '../components/navbarConfig';
import { 
  teamMembers, 
  leaveRequests, 
  timesheets, 
  tasks, 
  reports, 
  calendarEvents, 
  performanceData, 
  teamStructure,
  initialLeaveRequests, 
  initialCalendarEvents,
  tabs 
} from './TeamOverview subpages/teamOverviewData';

import { TeamDirectory } from './TeamOverview subpages/TeamDirectory';
import { TimesheetOverview } from './TeamOverview subpages/TimesheetOverview';
import { PerformanceOverview } from './TeamOverview subpages/PerformanceOverview';


const TeamOverview = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
      <Navbar />
      
      <motion.div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-lg min-w-max ${
                activeTab === tab.id ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'directory' && <TeamDirectory teamMembers={teamMembers} teamStructure={teamStructure} />}
        {activeTab === 'timesheet' && <TimesheetOverview />}
        {activeTab === 'performance' && <PerformanceOverview performanceData={performanceData} />}
        
        
      </motion.div>
    </div>
  );
};

export default TeamOverview;