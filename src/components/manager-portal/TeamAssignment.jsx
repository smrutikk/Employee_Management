import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TeamAssignment = () => {
    const [viewMode, setViewMode] = useState('matrix');
    const [managers, setManagers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    const teamRef = useRef(null);
  
    useEffect(() => {
      // Add CSS variables
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --neon-purple: #bc13fe;
          --neon-green: #0ffc7e;
          --neon-blue: #00f7ff;
          --neon-pink: #ff00ff;
          --neon-yellow: #f5d90a;
        }
      `;
      document.head.appendChild(style);
  
      // Mock data
      const mockManagers = [
        { id: 1, name: 'Alex Johnson', department: 'HR', teamSize: 12, capacity: 15 },
        { id: 2, name: 'Sarah Smith', department: 'Engineering', teamSize: 8, capacity: 12 },
        { id: 3, name: 'Michael Brown', department: 'Marketing', teamSize: 5, capacity: 10 },
      ];
      
      const mockEmployees = [
        { id: 1, name: 'Employee 1', department: 'HR', assignedTo: 1 },
        { id: 2, name: 'Employee 2', department: 'Engineering', assignedTo: 2 },
        { id: 3, name: 'Employee 3', department: 'Marketing', assignedTo: 3 },
        { id: 4, name: 'Employee 4', department: 'HR', assignedTo: null },
        { id: 5, name: 'Employee 5', department: 'Engineering', assignedTo: null },
      ];
      
      setManagers(mockManagers);
      setEmployees(mockEmployees);
  
      // Animation
      gsap.from(teamRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out'
      });
    }, []);
  
    const handleAssign = (employeeId, managerId) => {
      setEmployees(employees.map(emp => 
        emp.id === employeeId ? { ...emp, assignedTo: managerId } : emp
      ));
      
      gsap.to(`#employee-${employeeId}`, {
        backgroundColor: 'rgba(188, 19, 254, 0.1)',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      });
    };

  return (
    <div ref={teamRef} className="space-y-8 p-8 bg-gradient-to-br from-[#0a0f24] via-[#1a1b2f] to-[#2d1a36] min-h-screen backdrop-blur-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] animate-pulse-slow">
          Team Assignment Manager
        </h2>
        
        {/* View Toggle Buttons */}
        <div className="flex items-center space-x-4">
          <button
            className={`px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium ${
              viewMode === 'matrix'
                ? 'bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] text-white shadow-[0_0_25px_rgba(188,19,254,0.4)]'
                : 'bg-white/5 text-white/80 hover:bg-white/10 border-2 border-[var(--neon-purple)]/30 hover:shadow-[0_0_20px_rgba(188,19,254,0.3)]'
            }`}
            onClick={() => setViewMode('matrix')}
          >
            <span className="drop-shadow-[0_0_8px_rgba(188,19,254,0.4)]">Matrix View</span>
          </button>
          <button
            className={`px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium ${
              viewMode === 'list'
                ? 'bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] text-white shadow-[0_0_25px_rgba(188,19,254,0.4)]'
                : 'bg-white/5 text-white/80 hover:bg-white/10 border-2 border-[var(--neon-purple)]/30 hover:shadow-[0_0_20px_rgba(188,19,254,0.3)]'
            }`}
            onClick={() => setViewMode('list')}
          >
            <span className="drop-shadow-[0_0_8px_rgba(188,19,254,0.4)]">List View</span>
          </button>
        </div>
      </div>

      {/* Matrix View */}
      {viewMode === 'matrix' ? (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border-2 border-[var(--neon-purple)]/30 shadow-[0_8px_32px_rgba(188,19,254,0.2)]">
          <h3 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)]">
            Assignment Matrix
          </h3>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y-2 divide-[var(--neon-purple)]/25">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--neon-blue)] uppercase tracking-wider">
                    <span className="inline-block transform -skew-x-12">Employee</span>
                  </th>
                  {managers.map(manager => (
                    <th key={manager.id} className="px-6 py-4 text-center text-sm font-medium text-[var(--neon-green)] uppercase tracking-wider">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-base">{manager.name}</span>
                        <div className="text-xs font-mono text-[var(--neon-yellow)]">
                          {manager.teamSize}/{manager.capacity} (
                          {Math.round((manager.teamSize / manager.capacity) * 100)}%)
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-center text-sm font-medium text-[var(--neon-pink)] uppercase tracking-wider">
                    <span className="inline-block transform -skew-x-12">Unassigned</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[var(--neon-purple)]/25">
                {employees.map(employee => (
                  <tr 
                    key={employee.id} 
                    id={`employee-${employee.id}`} 
                    className="hover:bg-[var(--neon-purple)]/15 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full border-2 border-[var(--neon-blue)] bg-gray-800" />
                        <div>
                          <div className="text-base font-medium text-white">{employee.name}</div>
                          <div className="text-sm font-code text-[var(--neon-blue)]">{employee.department}</div>
                        </div>
                      </div>
                    </td>
                    
                    {managers.map(manager => (
                      <td key={manager.id} className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`assign-${employee.id}`}
                            checked={employee.assignedTo === manager.id}
                            onChange={() => handleAssign(employee.id, manager.id)}
                            className="sr-only"
                          />
                          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center 
                            ${employee.assignedTo === manager.id 
                              ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]/20 shadow-[0_0_12px_rgba(188,19,254,0.3)]'
                              : 'border-[var(--neon-purple)]/40 hover:border-[var(--neon-purple)]'}`}>
                            {employee.assignedTo === manager.id && (
                              <div className="h-3 w-3 rounded-full bg-[var(--neon-purple)] shadow-[0_0_8px_rgba(188,19,254,0.6)]" />
                            )}
                          </div>
                        </label>
                      </td>
                    ))}
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`assign-${employee.id}`}
                          checked={!employee.assignedTo}
                          onChange={() => handleAssign(employee.id, null)}
                          className="sr-only"
                        />
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center 
                          ${!employee.assignedTo 
                            ? 'border-[var(--neon-pink)] bg-[var(--neon-pink)]/20 shadow-[0_0_12px_rgba(255,0,255,0.3)]'
                            : 'border-[var(--neon-pink)]/40 hover:border-[var(--neon-pink)]'}`}>
                          {!employee.assignedTo && (
                            <div className="h-3 w-3 rounded-full bg-[var(--neon-pink)] shadow-[0_0_8px_rgba(255,0,255,0.6)]" />
                          )}
                        </div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
        {/* List View - Keep existing but add these improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {managers.map(manager => (
            <div 
              key={manager.id}
              className="relative bg-gradient-to-br from-[#1a1b2f]/90 to-[#2d1a36]/90 rounded-2xl p-6 border-2 border-[var(--neon-purple)]/30 shadow-[0_8px_32px_rgba(188,19,254,0.2)] hover:shadow-[0_12px_40px_rgba(188,19,254,0.3)] transition-all"
            >
              {/* Add corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--neon-purple)]/10 clip-corner" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-[var(--neon-green)]">{manager.name}</h3>
                  <p className="text-sm text-[var(--neon-blue)] font-code">{manager.department}</p>
                </div>
                <span className="text-[var(--neon-yellow)] text-sm bg-black/20 px-2 py-1 rounded-md">
                  {manager.teamSize}/{manager.capacity}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative pt-2 mb-6">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--neon-purple)]">
                    Capacity Utilization
                  </span>
                  <span className="text-xs font-semibold text-[var(--neon-purple)]">
                    {Math.round((manager.teamSize / manager.capacity) * 100)}%
                  </span>
                </div>
                <div className="overflow-hidden h-2.5 rounded-full bg-gray-800/50">
                  <div 
                    className="h-2.5 rounded-full bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] shadow-[0_0_12px_rgba(15,252,126,0.3)] transition-all duration-500"
                    style={{ width: `${(manager.teamSize / manager.capacity) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Team Members */}
              <div className="space-y-2">
                {employees
                  .filter(e => e.assignedTo === manager.id)
                  .map(employee => (
                    <div 
                      key={employee.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-[var(--neon-purple)]/30 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full border-2 border-[var(--neon-blue)] bg-gray-800" />
                        <span className="text-sm text-white">{employee.name}</span>
                      </div>
                      <button
                        onClick={() => handleAssign(employee.id, null)}
                        className="text-[var(--neon-pink)] hover:text-[var(--neon-pink)]/80 transition-colors text-sm font-medium px-2 py-1 rounded-md hover:bg-[var(--neon-pink)]/10"
                      >
                        Unassign
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default TeamAssignment;