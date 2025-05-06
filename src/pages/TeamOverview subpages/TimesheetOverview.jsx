import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCheck, FiX,FiFilter } from 'react-icons/fi';

export const TimesheetOverview = () => {
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filters, setFilters] = useState({
    period: 'weekly',
    status: 'all'
  });

  const [timesheets, setTimesheets] = useState([
    {
        id: 1,
        employee: 'Jane Smith',
        project: 'Project Phoenix',
        hours: 40,
        week: 'Apr 15 - Apr 21',
        status: 'pending',
      },
      {
        id: 2,
        employee: 'Michael Johnson',
        project: 'Operations Streamline',
        hours: 38,
        week: 'Apr 15 - Apr 21',
        status: 'approved',
      },
      {
        id: 3,
        employee: 'Emily Davis',
        project: 'UX Revamp',
        hours: 42,
        week: 'Apr 15 - Apr 21',
        status: 'rejected',
      },
      {
        id: 4,
        employee: 'Kevin Lee',
        project: 'API Integration',
        hours: 40,
        week: 'Apr 15 - Apr 21',
        status: 'pending',
      },
      {
        id: 5,
        employee: 'Anna Brown',
        project: 'HR Onboarding',
        hours: 36,
        week: 'Apr 15 - Apr 21',
        status: 'approved',
      },
      {
        id: 6,
        employee: 'Sam Wilson',
        project: 'Cloud Migration',
        hours: 45,
        week: 'Apr 15 - Apr 21',
        status: 'approved',
      },
      {
        id: 7,
        employee: 'Lucy Kim',
        project: 'Automated Testing Suite',
        hours: 39,
        week: 'Apr 15 - Apr 21',
        status: 'pending',
      },
      {
        id: 8,
        employee: 'Daniel Garcia',
        project: 'Mobile App Upgrade',
        hours: 41,
        week: 'Apr 15 - Apr 21',
        status: 'rejected',
      },
      {
        id: 9,
        employee: 'Olivia Wong',
        project: 'Data Visualization Tool',
        hours: 40,
        week: 'Apr 15 - Apr 21',
        status: 'approved',
      },
      {
        id: 10,
        employee: 'Chris Evans',
        project: 'Security Audit',
        hours: 37,
        week: 'Apr 15 - Apr 21',
        status: 'pending',
      }
  ]);

  const handleReviewClick = (sheet) => {
    setSelectedSheet(sheet);
    setShowReviewModal(true);
  };

  const handleDecision = (decision) => {
    setTimesheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === selectedSheet.id 
          ? { ...sheet, status: decision } 
          : sheet
      )
    );
    setShowReviewModal(false);
    setSelectedSheet(null);
  };

  const filteredSheets = timesheets.filter(sheet => {
    const matchesPeriod = filters.period === 'all' || 
      (filters.period === 'weekly' && sheet.week) || 
      (filters.period === 'monthly' && sheet.month);
    
    const matchesStatus = filters.status === 'all' || 
      sheet.status === filters.status;
    
    return matchesPeriod && matchesStatus;
  });


  return (
    <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiFileText className="text-blue-400" /> Timesheet Management
        </h2>
        <div className="flex gap-4">
          
          <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg p-2">
            <FiFilter className="text-gray-400" />
            <select
              className="bg-transparent outline-none"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All </option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="pb-3">Employee</th>
              <th className="pb-3">Project</th>
              <th className="pb-3">Hours</th>
              <th className="pb-3">Week</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSheets.map(sheet => (
              <tr key={sheet.id} className="border-b border-gray-700 hover:bg-gray-700/20">
                <td className="py-3">{sheet.employee}</td>
                <td>{sheet.project}</td>
                <td>{sheet.hours}h</td>
                <td>{sheet.week}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full ${
                    sheet.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    sheet.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {sheet.status}
                  </span>
                </td>
                <td>
                  <button
                    className={`text-purple-400 hover:text-purple-300 ${
                      sheet.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handleReviewClick(sheet)}
                    disabled={sheet.status !== 'pending'}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Review Timesheet</h3>
            <div className="space-y-2">
              <p><strong>Employee:</strong> {selectedSheet.employee}</p>
              <p><strong>Project:</strong> {selectedSheet.project}</p>
              <p><strong>Hours:</strong> {selectedSheet.hours}h</p>
              <p><strong>Week:</strong> {selectedSheet.week}</p>
              <p><strong>Current Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full ${
                  selectedSheet.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  selectedSheet.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {selectedSheet.status}
                </span>
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
                onClick={() => handleDecision('approved')}
              >
                <FiCheck /> Approve
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700"
                onClick={() => handleDecision('rejected')}
              >
                <FiX /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};