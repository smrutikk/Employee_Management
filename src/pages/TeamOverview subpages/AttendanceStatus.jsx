import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

export const AttendanceStatus = ({ teamMembers }) => {
  return (
    <motion.div className="bg-gray-800 rounded-xl p-6 shadow-xl space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <FiClock className="text-orange-400" /> Real-time Attendance
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Present Today" value="85%" color="green" />
        <StatCard label="On Leave" value="10%" color="yellow" />
        <StatCard label="Working Remotely" value="25%" color="blue" />
        <StatCard label="Late Arrivals" value="5%" color="red" />
      </div>

      <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3">Employee</th>
                    <th className="pb-3">Check-in</th>
                    <th className="pb-3">Check-out</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map(member => (
                    <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-700/20">
                      <td className="py-3">{member.name}</td>
                      <td>09:00 AM</td>
                      <td>06:00 PM</td>
                      <td>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                          Present
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    red: 'text-red-400'
  };

  return (
    <div className="p-4 rounded-lg border border-gray-700 bg-gray-700/20">
      <div className={`text-2xl font-bold mb-2 ${colors[color]}`}>{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
};