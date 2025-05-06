import { motion } from 'framer-motion';
import { FiBarChart2, FiDownload } from 'react-icons/fi';
import { useState } from 'react';

export const Reports = ({ reports }) => {
  const [reportType, setReportType] = useState('attendance');

  return (
    <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FiBarChart2 className="text-orange-400" /> Reports & Analytics
            </h2>
            <div className="flex gap-2">
              <select 
                className="bg-gray-700 rounded-lg px-4 py-2"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="attendance">Attendance</option>
                <option value="performance">Performance</option>
                <option value="tasks">Task Completion</option>
              </select>
              <button className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg">
                <FiDownload /> Export
              </button>
            </div>
          </div>
    
          <div className="bg-gray-900 rounded-lg p-6 min-h-[300px]">
            {/* This would be replaced with actual chart components */}
            <h3 className="text-lg font-semibold mb-4">
              {reportType === 'attendance' && 'Attendance Trends'}
              {reportType === 'performance' && 'Performance Metrics'}
              {reportType === 'tasks' && 'Task Completion Rates'}
            </h3>
            
            <div className="flex justify-center items-center h-64 text-gray-500">
              {/* Placeholder for chart - would be replaced with Chart.js or similar */}
              <p>Chart visualization for {reportType} data would appear here</p>
            </div>
          </div>
    
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  {reportType === 'attendance' && (
                    <>
                      <th className="pb-3">Month</th>
                      <th className="pb-3">Present (%)</th>
                      <th className="pb-3">Absent (%)</th>
                    </>
                  )}
                  {reportType === 'performance' && (
                    <>
                      <th className="pb-3">Quarter</th>
                      <th className="pb-3">Average Score</th>
                      <th className="pb-3">Top Performer</th>
                    </>
                  )}
                  {reportType === 'tasks' && (
                    <>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Count</th>
                      <th className="pb-3">Percentage</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {reportType === 'attendance' && reports.attendance.labels.map((label, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/20">
                    <td className="py-3">{label}</td>
                    <td>{reports.attendance.present[index]}%</td>
                    <td>{reports.attendance.absent[index]}%</td>
                  </tr>
                ))}
                {reportType === 'performance' && reports.performance.labels.map((label, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/20">
                    <td className="py-3">{label}</td>
                    <td>{reports.performance.scores[index]}%</td>
                    <td>Employee {index + 1} ({reports.performance.scores[index] + 5}%)</td>
                  </tr>
                ))}
                {reportType === 'tasks' && reports.tasks.labels.map((label, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/20">
                    <td className="py-3">{label}</td>
                    <td>{reports.tasks.data[index]}</td>
                    <td>{reports.tasks.data[index]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
  );
};