import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMessageSquare, FiSend, FiUser, FiStar, FiClock, 
  FiCheckCircle, FiAlertCircle, FiPlus, FiSearch 
} from 'react-icons/fi';
import Navbar from '../../components/Navbar';

const FeedbackPortal = () => {
  // Sample data - replace with API calls in production
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      type: 'received',
      from: 'Alex Johnson (Manager)',
      date: '2023-08-15',
      rating: 4,
      message: 'Great work on the Q3 project! Your React implementation was excellent. For improvement, consider documenting your components better.',
      category: 'Performance',
      status: 'read',
      response: ''
    },
    {
      id: 2,
      type: 'received',
      from: 'Sarah Miller (Peer)',
      date: '2023-08-10',
      rating: 5,
      message: 'Thanks for helping me debug the API issues last week. Your problem-solving skills are amazing!',
      category: 'Collaboration',
      status: 'read',
      response: 'Happy to help! Let me know if you need anything else.'
    },
    {
      id: 3,
      type: 'sent',
      to: 'Mark Davis (Team Lead)',
      date: '2023-08-05',
      rating: 4,
      message: 'The new project management system is working well. Would be great to have more training resources for new team members.',
      category: 'Process Improvement',
      status: 'pending',
      response: ''
    }
  ]);

  const [activeTab, setActiveTab] = useState('received');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    to: '',
    category: 'Performance',
    rating: 3,
    message: '',
    anonymous: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseText, setResponseText] = useState('');

  // Filter feedback based on active tab and search term
  const filteredFeedback = feedbackList.filter(feedback => {
    const matchesTab = activeTab === 'all' || feedback.type === activeTab;
    const matchesSearch = feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (feedback.type === 'received' ? feedback.from.toLowerCase().includes(searchTerm.toLowerCase()) : 
                          feedback.to.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Submit new feedback
  const submitFeedback = () => {
    const newEntry = {
      id: feedbackList.length + 1,
      type: 'sent',
      to: newFeedback.to,
      date: new Date().toISOString().split('T')[0],
      rating: newFeedback.rating,
      message: newFeedback.message,
      category: newFeedback.category,
      status: 'pending',
      response: ''
    };
    setFeedbackList([...feedbackList, newEntry]);
    setShowFeedbackModal(false);
    setNewFeedback({
      to: '',
      category: 'Performance',
      rating: 3,
      message: '',
      anonymous: false
    });
  };

  // Submit response to feedback
  const submitResponse = () => {
    if (!selectedFeedback || !responseText) return;
    
    const updatedFeedback = feedbackList.map(feedback => {
      if (feedback.id === selectedFeedback.id) {
        return { ...feedback, response: responseText };
      }
      return feedback;
    });
    
    setFeedbackList(updatedFeedback);
    setSelectedFeedback(null);
    setResponseText('');
  };

  // Rating stars display
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar 
            key={star}
            className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
          />
        ))}
      </div>
    );
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
              <FiMessageSquare className="text-2xl text-purple-400" />
              <h1 className="text-2xl font-bold">Feedback Portal</h1>
            </div>
            <button 
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              <FiPlus /> New Feedback
            </button>
          </div>

          {/* Tabs and Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('received')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'received' ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                Received Feedback
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'sent' ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                Sent Feedback
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                All Feedback
              </button>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <div className="bg-gray-700/20 rounded-lg p-8 text-center border border-dashed border-gray-600">
                <p className="text-gray-400">
                  {activeTab === 'received' ? 'No feedback received yet' : 
                   activeTab === 'sent' ? 'No feedback sent yet' : 'No feedback found'}
                </p>
              </div>
            ) : (
              filteredFeedback.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className={`bg-gray-700/30 rounded-lg p-5 border ${selectedFeedback?.id === feedback.id ? 'border-purple-500' : 'border-gray-600'} cursor-pointer hover:border-purple-400 transition-colors`}
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {feedback.type === 'received' ? 
                          `From: ${feedback.from}` : 
                          `To: ${feedback.to}`}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-400">{feedback.date}</span>
                        <span className="text-sm px-2 py-1 bg-gray-600 rounded-full">{feedback.category}</span>
                        {feedback.type === 'sent' && (
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            feedback.status === 'pending' ? 'bg-yellow-600/30 text-yellow-400' :
                            'bg-green-600/30 text-green-400'
                          }`}>
                            {feedback.status}
                          </span>
                        )}
                      </div>
                    </div>
                    {renderStars(feedback.rating)}
                  </div>
                  <p className="mt-3 line-clamp-2">{feedback.message}</p>
                  {feedback.response && (
                    <div className="mt-3 p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <FiUser /> Your Response
                      </div>
                      <p>{feedback.response}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Feedback Detail View */}
          {selectedFeedback && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedFeedback(null)}
            >
              <motion.div 
                className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedFeedback.type === 'received' ? 
                        `Feedback from ${selectedFeedback.from}` : 
                        `Your feedback to ${selectedFeedback.to}`}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <FiClock /> {selectedFeedback.date}
                      </div>
                      <span className="text-sm px-2 py-1 bg-gray-700 rounded-full">
                        {selectedFeedback.category}
                      </span>
                      {selectedFeedback.type === 'sent' && (
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          selectedFeedback.status === 'pending' ? 'bg-yellow-600/30 text-yellow-400' :
                          'bg-green-600/30 text-green-400'
                        }`}>
                          {selectedFeedback.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedFeedback(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Rating:</span>
                    {renderStars(selectedFeedback.rating)}
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="whitespace-pre-line">{selectedFeedback.message}</p>
                  </div>
                </div>

                {selectedFeedback.type === 'received' && (
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <FiMessageSquare /> Your Response
                    </h3>
                    {selectedFeedback.response ? (
                      <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                        <p className="whitespace-pre-line">{selectedFeedback.response}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows={4}
                          placeholder="Write your response here..."
                        />
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setSelectedFeedback(null)}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={submitResponse}
                            disabled={!responseText}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiSend className="inline mr-2" /> Send Response
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* New Feedback Modal */}
          {showFeedbackModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div 
                className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Give Feedback</h2>
                  <button 
                    onClick={() => setShowFeedbackModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                    <input
                      type="text"
                      value={newFeedback.to}
                      onChange={(e) => setNewFeedback({...newFeedback, to: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Name or email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      value={newFeedback.category}
                      onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Performance">Performance</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Skills">Skills</option>
                      <option value="Process Improvement">Process Improvement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewFeedback({...newFeedback, rating: star})}
                          className={`text-2xl ${star <= newFeedback.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                        >
                          <FiStar />
                        </button>
                      ))}
                      <span className="ml-2 text-gray-300">{newFeedback.rating} of 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Feedback Message</label>
                    <textarea
                      value={newFeedback.message}
                      onChange={(e) => setNewFeedback({...newFeedback, message: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={5}
                      placeholder="Be specific about what went well and what could be improved..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={newFeedback.anonymous}
                      onChange={(e) => setNewFeedback({...newFeedback, anonymous: e.target.checked})}
                      className="form-checkbox text-purple-500 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-300">
                      Send anonymously
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitFeedback}
                      disabled={!newFeedback.to || !newFeedback.message}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend className="inline mr-2" /> Submit Feedback
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPortal;