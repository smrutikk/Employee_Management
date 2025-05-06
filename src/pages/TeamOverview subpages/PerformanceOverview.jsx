import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const PerformanceOverview = ({ performanceData }) => {
  const [selectedPerformanceMetric, setSelectedPerformanceMetric] = useState('overall');
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    scoreRange: [0, 100],
    goalStatus: 'all',
    searchQuery: ''
  });

  // Calculate stats based on filtered data
  const filteredData = useMemo(() => {
    return performanceData.filter(employee => {
      // Department filter
      if (filters.department && employee.department !== filters.department) {
        return false;
      }
      
      // Score range filter
      if (employee.overallScore < filters.scoreRange[0] || 
          employee.overallScore > filters.scoreRange[1]) {
        return false;
      }
      
      // Goal status filter
      if (filters.goalStatus === 'completed' && 
          !employee.goals.every(goal => goal.completed)) {
        return false;
      }
      if (filters.goalStatus === 'incomplete' && 
          employee.goals.every(goal => goal.completed)) {
        return false;
      }
      
      // Search query filter
      if (filters.searchQuery && 
          !employee.employee.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [performanceData, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) return {
      averageScore: 0,
      topPerformer: { name: 'N/A', score: 0 },
      needsImprovement: 0
    };

    const scores = filteredData.map(e => e.overallScore);
    const averageScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    
    const topPerformer = filteredData.reduce((top, current) => 
      current.overallScore > top.score ? 
      { name: current.employee, score: current.overallScore } : top, 
      { name: '', score: 0 }
    );
    
    const needsImprovement = filteredData.filter(e => e.overallScore < 70).length;
    
    return { averageScore, topPerformer, needsImprovement };
  }, [filteredData]);

  // Get unique departments for filter dropdown
  const departments = useMemo(() => {
    const depts = new Set(performanceData.map(e => e.department));
    return Array.from(depts).sort();
  }, [performanceData]);

  const handleScoreRangeChange = (index, value) => {
    const newRange = [...filters.scoreRange];
    newRange[index] = parseInt(value);
    setFilters({ ...filters, scoreRange: newRange });
  };

  const resetFilters = () => {
    setFilters({
      department: '',
      scoreRange: [0, 100],
      goalStatus: 'all',
      searchQuery: ''
    });
  };

  return (
    <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiTrendingUp className="text-green-400" /> Performance Dashboard
        </h2>
        <div className="flex gap-3">
          <select 
            className="bg-gray-700 rounded-lg px-4 py-2"
            value={selectedPerformanceMetric}
            onChange={(e) => setSelectedPerformanceMetric(e.target.value)}
          >
            <option value="overall">Overall</option>
            <option value="productivity">Productivity</option>
            <option value="quality">Quality</option>
            <option value="collaboration">Collaboration</option>
          </select>
          <button 
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filters 
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <motion.div 
          className="bg-gray-700/30 rounded-lg p-4 space-y-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Filter Employees</h3>
            <button 
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
              onClick={resetFilters}
            >
              <FiX /> Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Department Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Department</label>
              <select
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {/* Score Range Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Score Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                  value={filters.scoreRange[0]}
                  onChange={(e) => handleScoreRangeChange(0, e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                  value={filters.scoreRange[1]}
                  onChange={(e) => handleScoreRangeChange(1, e.target.value)}
                />
              </div>
            </div>
            
            {/* Goal Status Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Goal Status</label>
              <select
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
                value={filters.goalStatus}
                onChange={(e) => setFilters({...filters, goalStatus: e.target.value})}
              >
                <option value="all">All Goals</option>
                <option value="completed">Completed Only</option>
                <option value="incomplete">Incomplete Only</option>
              </select>
            </div>
            
            {/* Search Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full bg-gray-700 rounded-lg px-3 py-2"
                value={filters.searchQuery}
                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Average Score" 
          value={`${stats.averageScore}%`} 
          color="green" 
          secondaryLabel={`of ${filteredData.length} employees`}
        />
        <StatCard 
          label="Top Performer" 
          value={`${stats.topPerformer.name} (${stats.topPerformer.score}%)`} 
          color="blue" 
        />
        <StatCard 
          label="Needs Improvement" 
          value={`${stats.needsImprovement}`} 
          color={stats.needsImprovement > 0 ? "red" : "green"}
          secondaryLabel={stats.needsImprovement > 0 ? "employees below 70%" : "all employees above threshold"}
        />
      </div>

      {/* Performance Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="pb-3">Employee</th>
              <th className="pb-3">Department</th>
              <th className="pb-3">Overall</th>
              <th className="pb-3">Productivity</th>
              <th className="pb-3">Quality</th>
              <th className="pb-3">Collaboration</th>
              <th className="pb-3">Goals Completed</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(employee => {
                const completedGoals = employee.goals.filter(g => g.completed).length;
                const totalGoals = employee.goals.length;
                
                return (
                  <tr key={employee.id} className="border-b border-gray-700 hover:bg-gray-700/20">
                    <td className="py-3">{employee.employee}</td>
                    <td className="py-3 text-gray-400">{employee.department}</td>
                    <td>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            employee.overallScore >= 85 ? 'bg-green-500' :
                            employee.overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${employee.overallScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{employee.overallScore}%</span>
                    </td>
                    {employee.kpis.map(kpi => (
                      <td key={kpi.name}>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${kpi.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{kpi.score}%</span>
                      </td>
                    ))}
                    <td>
                      <span className="text-sm">
                        {completedGoals}/{totalGoals} ({Math.round((completedGoals/totalGoals)*100)}%)
                      </span>
                    </td>
                    <td>
                      <button 
                        className="text-purple-400 hover:text-purple-300"
                        onClick={() => setSelectedPerformance(employee)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-400">
                  No employees match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Performance Detail Modal */}
      {selectedPerformance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedPerformance.employee}'s Performance
                <span className="text-sm font-normal text-gray-400 ml-2">
                  {selectedPerformance.department}
                </span>
              </h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setSelectedPerformance(null)}
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard 
                  label="Overall Score" 
                  value={`${selectedPerformance.overallScore}%`} 
                  color={
                    selectedPerformance.overallScore >= 85 ? 'green' :
                    selectedPerformance.overallScore >= 70 ? 'yellow' : 'red'
                  }
                />
                <StatCard 
                  label="Goals Completed" 
                  value={`${selectedPerformance.goals.filter(g => g.completed).length}/${selectedPerformance.goals.length}`} 
                  color={
                    selectedPerformance.goals.every(g => g.completed) ? 'green' :
                    selectedPerformance.goals.some(g => g.completed) ? 'yellow' : 'red'
                  }
                />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">KPIs</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedPerformance.kpis.map(kpi => (
                    <div key={kpi.name} className="p-3 border border-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span>{kpi.name}</span>
                        <span className="font-semibold">{kpi.score}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${kpi.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Feedback</h4>
                <div className="space-y-3">
                  {selectedPerformance.feedback.map((fb, index) => (
                    <div key={index} className="p-3 border border-gray-700 rounded-lg">
                      <p className="font-medium text-blue-400">{fb.reviewer}</p>
                      <p className="text-gray-300">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Goals</h4>
                <div className="space-y-2">
                  {selectedPerformance.goals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-700/20 rounded">
                      <input 
                        type="checkbox" 
                        checked={goal.completed} 
                        readOnly 
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className={goal.completed ? 'line-through text-gray-400' : ''}>
                        {goal.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const StatCard = ({ label, value, color, secondaryLabel }) => {
  const colors = {
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="p-4 rounded-lg border border-gray-700 bg-gray-700/20 h-full">
      <div className={`text-2xl font-bold mb-1 ${colors[color]}`}>{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
      {secondaryLabel && <div className="text-xs text-gray-500 mt-1">{secondaryLabel}</div>}
    </div>
  );
};