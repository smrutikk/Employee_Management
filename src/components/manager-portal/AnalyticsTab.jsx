import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiBarChart2, FiClock, FiUser, FiDownload, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { managers, departments } from './data';

const AnalyticsTab = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const reportsPerPage = 5;

  const openReport = (manager) => {
    setSelectedReport({
      ...manager,
      // Sample report data - replace with actual data from your API
      detailedMetrics: {
        productivity: manager.performance * 20,
        leadership: (manager.performance - 0.5) * 20,
        communication: Math.min(manager.performance * 25, 100),
        teamSatisfaction: Math.min(manager.performance * 22, 100),
        projectCompletion: Math.min(manager.performance * 18, 100)
      },
      quarterlyTrend: [
        { quarter: 'Q1', rating: manager.performance - 0.3 },
        { quarter: 'Q2', rating: manager.performance - 0.1 },
        { quarter: 'Q3', rating: manager.performance },
        { quarter: 'Q4', rating: manager.performance + 0.2 }
      ],
      strengths: [
        'Strategic thinking',
        'Team motivation',
        'Problem solving'
      ],
      areasForImprovement: [
        'Delegation',
        'Time management',
        'Cross-department collaboration'
      ]
    });
  };

  const closeReport = () => {
    setSelectedReport(null);
  };

  const paginatedManagers = managers.slice(
    currentPage * reportsPerPage,
    (currentPage + 1) * reportsPerPage
  );

  const totalPages = Math.ceil(managers.length / reportsPerPage);
  return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Analytics Content */}
      <h2 className="text-2xl font-bold mb-6 text-green-400">Manager Performance Analytics</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-6 rounded-xl border border-purple-500/20"
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-300">Average Rating</div>
              <div className="text-3xl font-bold text-purple-400">4.5</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <FiBarChart2 className="text-purple-400 text-xl" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-400 flex items-center">
            <span>↑ 12% from last month</span>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 p-6 rounded-xl border border-blue-500/20"
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-300">Avg Response Time</div>
              <div className="text-3xl font-bold text-blue-400">1.2 days</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FiClock className="text-blue-400 text-xl" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-400 flex items-center">
            <span>↓ 0.3 days from last month</span>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-pink-600/30 to-pink-800/30 p-6 rounded-xl border border-pink-500/20"
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-300">Team Satisfaction</div>
              <div className="text-3xl font-bold text-pink-400">88%</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
              <FiUser className="text-pink-400 text-xl" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-400 flex items-center">
            <span>↑ 5% from last quarter</span>
          </div>
        </motion.div>
      </div>

      {/* Department Comparison */}
      <div className="bg-gray-700 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Department Comparison</h3>
        <div className="h-64">
          {/* Chart placeholder - replace with actual comparison chart */}
          <div className="flex items-end h-40 space-x-4 mt-4">
            {departments.map((dept, index) => (
              <motion.div
                key={dept}
                initial={{ height: 0 }}
                animate={{ height: `${(index + 1) * 15 + 20}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex-1 rounded-t-lg flex items-end justify-center ${index % 3 === 0 ? 'bg-gradient-to-t from-purple-500 to-pink-500' : index % 3 === 1 ? 'bg-gradient-to-t from-blue-500 to-cyan-500' : 'bg-gradient-to-t from-green-500 to-teal-500'}`}
                whileHover={{ scaleY: 1.1 }}
              >
                <span className="text-xs mb-1 transform translate-y-5">{dept.split(' ')[0]}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Report Cards */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-yellow-400">Monthly Report Cards</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-600">
                <th className="pb-2">Manager</th>
                <th className="pb-2">Department</th>
                <th className="pb-2">Rating</th>
                <th className="pb-2">Productivity</th>
                <th className="pb-2">Leadership</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedManagers.map((manager) => (
                <motion.tr 
                  key={manager.id}
                  className="border-b border-gray-700 hover:bg-gray-600/30"
                  whileHover={{ x: 5 }}
                >
                  <td className="py-3 flex items-center">
                    <img src={manager.avatar} alt={manager.name} className="w-8 h-8 rounded-full mr-2" />
                    {manager.name}
                  </td>
                  <td>{manager.department}</td>
                  <td>
                    <div className="flex items-center">
                      <span className="text-yellow-400">{manager.performance}</span>
                      <span className="text-gray-400 ml-1">/5</span>
                    </div>
                  </td>
                  <td>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${manager.performance * 20}%` }}
                      ></div>
                    </div>
                  </td>
                  <td>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(manager.performance - 0.5) * 20}%` }}
                      ></div>
                    </div>
                  </td>
                  <td>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                      onClick={() => openReport(manager)}
                    >
                      View Report
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded ${currentPage === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:bg-blue-900/30'}`}
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <FiChevronLeft className="inline mr-1" /> Previous
          </motion.button>
          
          <div className="text-gray-300">
            Page {currentPage + 1} of {totalPages}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded ${currentPage === totalPages - 1 ? 'text-gray-500 cursor-not-allowed' : 'text-blue-400 hover:bg-blue-900/30'}`}
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next <FiChevronRight className="inline ml-1" />
          </motion.button>
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-purple-400">
                Performance Report: {selectedReport.name}
              </h3>
              <button 
                onClick={closeReport}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Manager Info */}
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedReport.avatar} 
                  alt={selectedReport.name} 
                  className="w-16 h-16 rounded-full border-2 border-purple-500"
                />
                <div>
                  <h4 className="text-lg font-bold">{selectedReport.name}</h4>
                  <div className="text-purple-400">{selectedReport.role}</div>
                  <div className="text-gray-300">{selectedReport.department}</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-blue-400">Key Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedReport.detailedMetrics).map(([metric, value]) => (
                    <div key={metric} className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-gray-300 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="flex items-end mt-2">
                        <span className="text-2xl font-bold">
                          {value}
                          {!metric.includes('communication') && !metric.includes('satisfaction') && !metric.includes('completion') && '%'}
                        </span>
                        <span className="text-sm text-gray-400 ml-2 mb-1">
                          {value > 80 ? 'Excellent' : value > 60 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            value > 80 ? 'bg-green-500' : 
                            value > 60 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`} 
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quarterly Trend */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-400">Quarterly Performance Trend</h4>
                <div className="bg-gray-700 rounded-lg p-4 h-64">
                  <div className="flex items-end h-40 space-x-4 mt-4">
                    {selectedReport.quarterlyTrend.map((quarter, index) => (
                      <motion.div
                        key={quarter.quarter}
                        initial={{ height: 0 }}
                        animate={{ height: `${quarter.rating * 20}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t flex items-end justify-center"
                        whileHover={{ scaleY: 1.1 }}
                      >
                        <span className="text-xs mb-1 transform translate-y-5">{quarter.quarter}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths & Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-green-400">Strengths</h4>
                  <ul className="space-y-2">
                    {selectedReport.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-yellow-400">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {selectedReport.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-2">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2 text-blue-400">Summary</h4>
                <p className="text-gray-300">
                  {selectedReport.name} has shown consistent performance with an overall rating of {selectedReport.performance}/5. 
                  Their strengths in {selectedReport.strengths[0].toLowerCase()} and {selectedReport.strengths[1].toLowerCase()} 
                  have contributed significantly to team success. Focus areas include improving {selectedReport.areasForImprovement[0].toLowerCase()} 
                  to enhance overall effectiveness.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            {/*<div className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-2"
              >
                <FiDownload /> Download Full Report
              </motion.button>
            </div>*/}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}; 


export default AnalyticsTab;