import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMapPin, FiChevronRight, FiX } from 'react-icons/fi';

export const TeamDirectory = ({ teamMembers, teamStructure }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMembers, setExpandedMembers] = useState(new Set());
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTree = (members, level = 0) => (
    <div className="space-y-2">
      {members.map(member => (
        <div key={member.id} className="space-y-2">
          <div 
            className={`p-3 rounded-lg border border-gray-700 bg-gray-700/20 flex items-center gap-3 
              cursor-pointer hover:bg-gray-700/40 transition-colors`}
            style={{ paddingLeft: `${level * 32}px` }}
            onClick={() => setExpandedMembers(prev => {
              const next = new Set(prev);
              next.has(member.id) ? next.delete(member.id) : next.add(member.id);
              return next;
            })}
          >
            {member.children?.length > 0 && (
              <motion.span
                animate={{ rotate: expandedMembers.has(member.id) ? 90 : 0 }}
              >
                <FiChevronRight />
              </motion.span>
            )}
            <div className={`w-3 h-3 rounded-full ${
              member.status === 'online' ? 'bg-green-400' : 
              member.status === 'remote' ? 'bg-blue-400' : 'bg-gray-500'
            }`} />
            <div className="flex-1">
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.role}</p>
            </div>
            <button 
              className="text-purple-400 hover:text-purple-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMember(member);
              }}
            >
              <FiUser />
            </button>
          </div>
          {expandedMembers.has(member.id) && member.children?.length > 0 && (
            renderTree(member.children, level + 1)
          )}
        </div>
      ))}
    </div>
  );

  return (
    <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiUser className="text-purple-400" /> Team Directory
              </h2>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search team members..."
                  className="bg-gray-700 rounded-lg px-4 py-2 flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="bg-gray-700 rounded-lg px-4 py-2"
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <option value="grid">Grid View</option>
                  <option value="tree">Tree View</option>
                </select>
              </div>
            </div>
      
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeamMembers.map(member => (
                  <motion.div
                    key={member.id}
                    className="p-4 rounded-lg border border-gray-700 bg-gray-700/20"
                    whileHover={{ y: -3 }}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        member.status === 'online' ? 'bg-green-400' : 'bg-gray-500'
                      }`} />
                      <h3 className="font-semibold">{member.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400">{member.role}</p>
                      <p className="flex items-center gap-1 text-blue-400">
                        <FiMapPin /> {member.location}
                      </p>
                      <p className="text-purple-400">{member.department}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span>Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <span>Remote</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span>Offline</span>
                  </div>
                </div>
                
                {renderTree(teamStructure)}
              </div>
            )}
      
            {/* Member Detail Modal */}
            {selectedMember && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <motion.div 
                  className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </button>
                  <h3 className="text-2xl font-bold mb-4">{selectedMember.name}</h3>
                  <div className="space-y-4">
                    <DetailItem label="Role" value={selectedMember.role} />
                    <DetailItem label="Department" value={selectedMember.department} />
                    <DetailItem label="Location" value={selectedMember.location} />
                    <DetailItem 
                      label="Status" 
                      value={
                        <span className={`px-2 py-1 rounded-full ${
                          selectedMember.status === 'online' ? 'bg-green-500/20 text-green-400' :
                          selectedMember.status === 'remote' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20'
                        }`}>
                          {selectedMember.status}
                        </span>
                      }
                    />
                   {/* <div className="pt-4">
                      <button className="w-full bg-purple-600 hover:bg-purple-500 rounded-lg py-2">
                        View Full Profile
                      </button>
                    </div>*/}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="bg-gray-700/30 p-3 rounded-lg">
    <span className="text-sm text-gray-400">{label}</span>
    <div className="font-medium">{value}</div>
  </div>
);