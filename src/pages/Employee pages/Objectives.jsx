import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTarget, FiCheckCircle, FiTrendingUp, FiPlus, FiAlignLeft, 
  FiCalendar, FiBarChart2, FiLink, FiEdit2, FiPaperclip, FiClock 
} from 'react-icons/fi';
import Navbar from '../../components/Navbar';

const ObjectivesPage = () => {
  // Sample data - replace with API calls in production
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      title: "Improve React proficiency",
      description: "Complete advanced React course and implement learnings in current project",
      startDate: "2023-06-01",
      endDate: "2023-09-30",
      status: "In Progress",
      progress: 65,
      type: "Self Development",
      weightage: 30,
      alignedTo: "Team Technical Upskilling",
      keyResults: [
        { id: 1, description: "Complete React Advanced Concepts course", progress: 100 },
        { id: 2, description: "Implement 3 new React patterns in project", progress: 50 },
        { id: 3, description: "Pass React certification exam", progress: 0 }
      ],
      updates: [
        { date: "2023-07-15", note: "Completed course modules 1-5", attachments: [] },
        { date: "2023-08-02", note: "Implemented Context API in project", attachments: ["design.pdf"] }
      ]
    },
    {
      id: 2,
      title: "Increase customer satisfaction scores",
      description: "Improve NPS score by 15 points through better support processes",
      startDate: "2023-07-01",
      endDate: "2023-12-31",
      status: "On Track",
      progress: 35,
      type: "Team Goal",
      weightage: 50,
      alignedTo: "Company Customer Excellence",
      keyResults: [
        { id: 1, description: "Reduce response time to under 2 hours", progress: 75 },
        { id: 2, description: "Implement new feedback system", progress: 10 }
      ],
      updates: [
        { date: "2023-07-20", note: "Started tracking response times", attachments: [] }
      ]
    }
  ]);

  const [showNewObjectiveModal, setShowNewObjectiveModal] = useState(false);
  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'Self Development',
    weightage: 30,
    alignedTo: ''
  });
  const [activeTab, setActiveTab] = useState('all');
  const [selectedObjective, setSelectedObjective] = useState(null);

  // Filter objectives based on status
  const filteredObjectives = objectives.filter(obj => {
    if (activeTab === 'all') return true;
    return obj.status === activeTab;
  });

  // Calculate progress based on key results
  const calculateProgress = (keyResults) => {
    if (!keyResults || keyResults.length === 0) return 0;
    const total = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
    return Math.round(total / keyResults.length);
  };

  // Update key result progress
  const updateKeyResultProgress = (objId, krId, newProgress) => {
    setObjectives(objectives.map(obj => {
      if (obj.id === objId) {
        const updatedKRs = obj.keyResults.map(kr => 
          kr.id === krId ? { ...kr, progress: newProgress } : kr
        );
        return {
          ...obj,
          keyResults: updatedKRs,
          progress: calculateProgress(updatedKRs)
        };
      }
      return obj;
    }));
  };

  // Add new progress update
  const addProgressUpdate = (objId, note) => {
    setObjectives(objectives.map(obj => {
      if (obj.id === objId) {
        return {
          ...obj,
          updates: [
            ...obj.updates,
            {
              date: new Date().toISOString().split('T')[0],
              note,
              attachments: []
            }
          ]
        };
      }
      return obj;
    }));
  };

  // Submit new objective
  const submitNewObjective = () => {
    const newObj = {
      id: objectives.length + 1,
      ...newObjective,
      status: "Not Started",
      progress: 0,
      keyResults: [],
      updates: []
    };
    setObjectives([...objectives, newObj]);
    setShowNewObjectiveModal(false);
    setNewObjective({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      type: 'Self Development',
      weightage: 30,
      alignedTo: ''
    });
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
              <FiTarget className="text-2xl text-purple-400" />
              <h1 className="text-2xl font-bold">My Objectives</h1>
            </div>
            <button 
              onClick={() => setShowNewObjectiveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              <FiPlus /> New Objective
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              All Objectives
            </button>
            <button
              onClick={() => setActiveTab('Not Started')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'Not Started' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              Not Started
            </button>
            <button
              onClick={() => setActiveTab('In Progress')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'In Progress' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveTab('On Track')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'On Track' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              On Track
            </button>
            <button
              onClick={() => setActiveTab('Completed')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'Completed' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              Completed
            </button>
          </div>

          {/* Objectives List */}
          <div className="space-y-6">
            {filteredObjectives.length === 0 ? (
              <div className="bg-gray-700/20 rounded-lg p-8 text-center border border-dashed border-gray-600">
                <p className="text-gray-400">No objectives found. Create a new objective to get started.</p>
              </div>
            ) : (
              filteredObjectives.map((objective) => (
                <div key={objective.id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  {/* Objective Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{objective.title}</h3>
                      <p className="text-gray-400 mt-1">{objective.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      objective.status === 'Completed' ? 'bg-green-600/30 text-green-400' :
                      objective.status === 'In Progress' ? 'bg-blue-600/30 text-blue-400' :
                      objective.status === 'On Track' ? 'bg-purple-600/30 text-purple-400' :
                      'bg-gray-600/30 text-gray-400'
                    }`}>
                      {objective.status}
                    </span>
                  </div>

                  {/* Meta Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      <span className="text-sm">
                        {new Date(objective.startDate).toLocaleDateString()} - {new Date(objective.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiBarChart2 className="text-gray-400" />
                      <span className="text-sm">Weight: {objective.weightage}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiLink className="text-gray-400" />
                      <span className="text-sm">Aligned to: {objective.alignedTo}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress: {objective.progress}%</span>
                      <button 
                        onClick={() => setSelectedObjective(selectedObjective?.id === objective.id ? null : objective)}
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        {selectedObjective?.id === objective.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${objective.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {selectedObjective?.id === objective.id && (
                    <div className="mt-6 space-y-6">
                      {/* Key Results */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <FiCheckCircle /> Key Results
                        </h4>
                        <div className="space-y-4">
                          {objective.keyResults.length > 0 ? (
                            objective.keyResults.map((kr) => (
                              <div key={kr.id} className="bg-gray-700/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <span>{kr.description}</span>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={kr.progress}
                                      onChange={(e) => updateKeyResultProgress(objective.id, kr.id, parseInt(e.target.value))}
                                      className="w-24"
                                    />
                                    <span className="text-sm w-10">{kr.progress}%</span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-500 h-1.5 rounded-full" 
                                    style={{ width: `${kr.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-sm">No key results defined</p>
                          )}
                        </div>
                      </div>

                      {/* Progress Updates */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <FiTrendingUp /> Progress Updates
                        </h4>
                        <div className="space-y-4">
                          {objective.updates.map((update, index) => (
                            <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-400">{update.date}</span>
                                {update.attachments.length > 0 && (
                                  <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                    <FiPaperclip size={14} /> {update.attachments.length}
                                  </button>
                                )}
                              </div>
                              <p>{update.note}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add progress update..."
                              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button 
                              onClick={() => {
                                const input = document.querySelector('input[placeholder="Add progress update..."]');
                                if (input.value) {
                                  addProgressUpdate(objective.id, input.value);
                                  input.value = '';
                                }
                              }}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* New Objective Modal */}
      {showNewObjectiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create New Objective</h2>
              <button 
                onClick={() => setShowNewObjectiveModal(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newObjective.title}
                  onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Objective title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newObjective.description}
                  onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Detailed description of the objective"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newObjective.startDate}
                    onChange={(e) => setNewObjective({...newObjective, startDate: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newObjective.endDate}
                    onChange={(e) => setNewObjective({...newObjective, endDate: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={newObjective.type}
                    onChange={(e) => setNewObjective({...newObjective, type: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Self Development">Self Development</option>
                    <option value="Team Goal">Team Goal</option>
                    <option value="Company Objective">Company Objective</option>
                    <option value="Project Milestone">Project Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weightage</label>
                  <select
                    value={newObjective.weightage}
                    onChange={(e) => setNewObjective({...newObjective, weightage: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Aligned To (Optional)</label>
                <input
                  type="text"
                  value={newObjective.alignedTo}
                  onChange={(e) => setNewObjective({...newObjective, alignedTo: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Team or company objective this supports"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowNewObjectiveModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={submitNewObjective}
                  disabled={!newObjective.title || !newObjective.description || !newObjective.startDate || !newObjective.endDate}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Objective
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ObjectivesPage;