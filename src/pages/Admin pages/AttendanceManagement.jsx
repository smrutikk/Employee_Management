// components/AttendanceManagement.jsx
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUserCheck, FiUserX, FiClock, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import {navLinks} from '../../components/navbarConfig';
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const AttendanceManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [reportType, setReportType] = useState("Daily Logs");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [attendanceSettings, setAttendanceSettings] = useState({
    trackingEnabled: true,
    defaultCheckIn: '09:00',
    defaultCheckOut: '18:00',
    gracePeriod: 15,
    ipRestriction: false,
    geoFencing: false,
    autoPunch: false
  });

  const [shifts, setShifts] = useState([
    {
      id: 1,
      name: 'Morning Shift',
      start: '08:00',
      end: '16:00',
      breakTime: 60,
      overtimePolicy: '1.5x after 40 hours'
    }
  ]);

  const [regularizationRequests, setRegularizationRequests] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showShiftManager, setShowShiftManager] = useState(false);
  const [showReports, setShowReports] = useState(false);

  // Sample data
  const [attendanceData, setAttendanceData] = useState([
    {
        id: 1,
        employee: 'John Doe',
        role: 'Developer',
        date: '2025-04-01',
        status: 'present',
        checkIn: '09:00',
        checkOut: '18:00',
        ipAddress: '192.168.1.1',
        location: { lat: 40.7128, lng: -74.006 },
        shiftId: 1
      },
      {
        id: 2,
        employee: 'Jane Smith',
        role: 'Designer',
        date: '2025-04-01',
        status: 'present',
        checkIn: '09:05',
        checkOut: '17:55',
        ipAddress: '192.168.1.2',
        location: { lat: 34.0522, lng: -118.2437 },
        shiftId: 2
      },
      {
        id: 3,
        employee: 'Michael Brown',
        role: 'Project Manager',
        date: '2025-04-01',
        status: 'present',
        checkIn: '08:45',
        checkOut: '17:30',
        ipAddress: '192.168.1.3',
        location: { lat: 51.5074, lng: -0.1278 },
        shiftId: 1
      },
      {
        id: 4,
        employee: 'Emily Davis',
        role: 'QA Engineer',
        date: '2025-04-01',
        status: 'absent',
        checkIn: null,
        checkOut: null,
        ipAddress: null,
        location: null,
        shiftId: 1
      },
      {
        id: 5,
        employee: 'Daniel Wilson',
        role: 'Backend Developer',
        date: '2025-04-02',
        status: 'present',
        checkIn: '09:10',
        checkOut: '18:05',
        ipAddress: '192.168.1.5',
        location: { lat: 37.7749, lng: -122.4194 },
        shiftId: 2
      },
      {
        id: 6,
        employee: 'Sophia Lee',
        role: 'Frontend Developer',
        date: '2025-04-02',
        status: 'late',
        checkIn: '10:15',
        checkOut: '18:20',
        ipAddress: '192.168.1.6',
        location: { lat: 35.6895, lng: 139.6917 },
        shiftId: 3
      },
      {
        id: 7,
        employee: 'Chris Johnson',
        role: 'HR Executive',
        date: '2025-04-02',
        status: 'present',
        checkIn: '09:00',
        checkOut: '17:45',
        ipAddress: '192.168.1.7',
        location: { lat: 41.8781, lng: -87.6298 },
        shiftId: 1
      },
      {
        id: 8,
        employee: 'Olivia Martinez',
        role: 'UI/UX Designer',
        date: '2025-04-03',
        status: 'present',
        checkIn: '09:20',
        checkOut: '18:20',
        ipAddress: '192.168.1.8',
        location: { lat: 25.7617, lng: -80.1918 },
        shiftId: 4
      },   
      {
        id: 9,
        employee: 'John Doe',
        role: 'Developer',
        date: '2025-04-04',
        status: 'present',
        checkIn: '09:00',
        checkOut: '18:00',
        ipAddress: '192.168.1.9',
        location: { lat: 40.7128, lng: -74.0060 },
        shiftId: 1
      },
      {
        id: 10,
        employee: 'Jane Smith',
        role: 'Designer',
        date: '2025-04-04',
        status: 'late',
        checkIn: '10:15',
        checkOut: '18:30',
        ipAddress: '192.168.1.10',
        location: { lat: 34.0522, lng: -118.2437 },
        shiftId: 2
      },
      {
        id: 11,
        employee: 'Michael Brown',
        role: 'Project Manager',
        date: '2025-04-04',
        status: 'present',
        checkIn: '08:45',
        checkOut: '17:30',
        ipAddress: '192.168.1.11',
        location: { lat: 51.5074, lng: -0.1278 },
        shiftId: 1
      },
      {
        id: 12,
        employee: 'Emily Davis',
        role: 'QA Engineer',
        date: '2025-04-05',
        status: 'absent',
        checkIn: null,
        checkOut: null,
        ipAddress: null,
        location: null,
        shiftId: 2
      },
      {
        id: 13,
        employee: 'Daniel Wilson',
        role: 'Backend Developer',
        date: '2025-04-05',
        status: 'late',
        checkIn: '10:05',
        checkOut: '18:00',
        ipAddress: '192.168.1.13',
        location: { lat: 37.7749, lng: -122.4194 },
        shiftId: 3
      },
      {
        id: 14,
        employee: 'Sophia Lee',
        role: 'Frontend Developer',
        date: '2025-04-15',
        status: 'present',
        checkIn: '09:10',
        checkOut: '18:10',
        ipAddress: '192.168.1.14',
        location: { lat: 35.6895, lng: 139.6917 },
        shiftId: 3
      },
      {
        id: 15,
        employee: 'Chris Johnson',
        role: 'HR Executive',
        date: '2025-04-15',
        status: 'present',
        checkIn: '09:00',
        checkOut: '17:45',
        ipAddress: '192.168.1.15',
        location: { lat: 41.8781, lng: -87.6298 },
        shiftId: 1
      },
      {
        id: 16,
        employee: 'Olivia Martinez',
        role: 'UI/UX Designer',
        date: '2025-04-15',
        status: 'present',
        checkIn: '09:20',
        checkOut: '18:20',
        ipAddress: '192.168.1.16',
        location: { lat: 25.7617, lng: -80.1918 },
        shiftId: 4
      },
      {
        id: 17,
        employee: 'John Doe',
        role: 'Developer',
        date: '2025-04-20',
        status: 'present',
        checkIn: '09:00',
        checkOut: '18:00',
        ipAddress: '192.168.1.17',
        location: { lat: 40.7128, lng: -74.0060 },
        shiftId: 1
      },
      {
        id: 18,
        employee: 'Jane Smith',
        role: 'Designer',
        date: '2025-04-20',
        status: 'absent',
        checkIn: null,
        checkOut: null,
        ipAddress: null,
        location: null,
        shiftId: 2
      },
      {
        id: 19,
        employee: 'Michael Brown',
        role: 'Project Manager',
        date: '2025-04-21',
        status: 'present',
        checkIn: '08:45',
        checkOut: '17:30',
        ipAddress: '192.168.1.19',
        location: { lat: 51.5074, lng: -0.1278 },
        shiftId: 1
      },
      {
        id: 20,
        employee: 'Emily Davis',
        role: 'QA Engineer',
        date: '2025-04-22',
        status: 'present',
        checkIn: '09:05',
        checkOut: '17:55',
        ipAddress: '192.168.1.20',
        location: { lat: 34.0522, lng: -118.2437 },
        shiftId: 2
      }      
  ]);

  // Status colors matching your theme
  const statusColors = {
    present: 'text-green-400',
    absent: 'text-red-400',
    late: 'text-yellow-400',
    halfDay: 'text-purple-400'
  };

  // Generate calendar days
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => 
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1)
  );

  // Filtered attendance
  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesEmployee = employeeFilter === 'all' || record.employee === employeeFilter;
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  const handleSaveSettings = () => {
    try {
      // Save settings to localStorage
      localStorage.setItem('attendanceSettings', JSON.stringify(attendanceSettings));
  
      // Show success message
      toast.success("Attendance settings saved successfully!");
  
      // Close the settings after a short delay to allow toast to show
      setTimeout(() => {
        setShowSettings(false);
      }, 1500); // 1.5 seconds
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings. Please try again.");
    }
  };
  
  
  

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setAttendanceData(prev => 
      prev.map(record => 
        record.id === id ? { ...record, status: newStatus } : record
      )
    );
  };

  // Month navigation
  const handleMonthChange = (direction) => {
    setSelectedDate(prev => new Date(
      prev.getFullYear(),
      prev.getMonth() + direction,
      1
    ));
  };

  const [shiftForm, setShiftForm] = useState({
    name: "",
    start: "",
    end: ""
  });

  const handleCreateShift = () => {
    if (!shiftForm.name || !shiftForm.start || !shiftForm.end) return;

    const newShift = {
      id: shifts.length + 1,
      name: shiftForm.name,
      start: shiftForm.start,
      end: shiftForm.end
    };

    setShifts(prev => [...prev, newShift]);
    setShiftForm({ name: "", start: "", end: "" }); // reset form
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Report: ${reportType}`, 10, 10);
    doc.text(`From: ${startDate} To: ${endDate}`, 10, 20);
    
    // Example: Add basic data (customize as needed)
    reportData.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.employee} - ${item.status}`, 10, 30 + index * 10);
    });

    doc.save("report.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "report.xlsx");
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex">
    
      <Navbar />
      <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-6 overflow-y-auto space-y-6"
    >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Attendance Management
          </h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            <motion.div 
              className="relative flex-1"
              whileHover={{ scale: 1.01 }}
            >
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search attendance..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
            
            <select
              className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="halfDay">Half Day</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Present Days"
            value={attendanceData.filter(a => a.status === 'present').length}
            icon={<FiUserCheck />}
            color="green"
          />
          <StatCard
            title="Absent Days"
            value={attendanceData.filter(a => a.status === 'absent').length}
            icon={<FiUserX />}
            color="red"
          />
          <StatCard
            title="Late Arrivals"
            value={attendanceData.filter(a => a.status === 'late').length}
            icon={<FiClock />}
            color="yellow"
          />
          <StatCard
            title="Total Records"
            value={attendanceData.length}
            icon={<FiCalendar />}
            color="purple"
          />
        </div>

        {/* Settings Panel */}
        {showSettings && (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mt-6 bg-gray-800 rounded-xl p-6 shadow-xl space-y-4"
  >
    <h2 className="text-2xl font-bold text-purple-400">Attendance Settings</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
        <input 
          type="checkbox"
          checked={attendanceSettings.trackingEnabled}
          onChange={e => setAttendanceSettings(prev => ({
            ...prev,
            trackingEnabled: e.target.checked
          }))}
          className="w-4 h-4"
        />
        <label>Enable Attendance Tracking</label>
      </div>

      <div className="space-y-2">
        <label>Default Check-In Time</label>
        <input
          type="time"
          value={attendanceSettings.defaultCheckIn}
          onChange={e => setAttendanceSettings(prev => ({
            ...prev,
            defaultCheckIn: e.target.value
          }))}
          className="bg-gray-700 rounded-lg p-2 text-white"
        />
      </div>
    </div>

    {/* Save Changes Button */}
    <div className="flex justify-end mt-4">
      <button 
        onClick={handleSaveSettings}
        className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg"
      >
        Save Changes
      </button>
    </div>
  </motion.div>
)}


{/* Shift Management */}
{showShiftManager && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 shadow-xl mt-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-400">Shift Management</h2>
            <button 
              onClick={() => setShowShiftManager(false)}
              className="text-red-400 hover:text-red-300"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shift Creation Form */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Shift Name"
                value={shiftForm.name}
                onChange={e => setShiftForm({ ...shiftForm, name: e.target.value })}
                className="bg-gray-700 rounded-lg p-2 w-full text-white"
              />
              <div className="flex gap-2">
                <input 
                  type="time" 
                  value={shiftForm.start}
                  onChange={e => setShiftForm({ ...shiftForm, start: e.target.value })}
                  className="bg-gray-700 rounded-lg p-2 text-white w-full" 
                />
                <input 
                  type="time" 
                  value={shiftForm.end}
                  onChange={e => setShiftForm({ ...shiftForm, end: e.target.value })}
                  className="bg-gray-700 rounded-lg p-2 text-white w-full" 
                />
              </div>
              <button 
                onClick={handleCreateShift}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white"
              >
                Create Shift
              </button>
            </div>

            {/* Existing Shifts List */}
            <div className="space-y-2">
              {shifts.map(shift => (
                <div key={shift.id} className="bg-gray-700 p-3 rounded-lg text-white">
                  <div className="font-bold">{shift.name}</div>
                  <div>{shift.start} - {shift.end}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    <div className="flex gap-2">
  <motion.button
    whileHover={{ scale: 1.05 }}
    className="px-4 py-2 bg-purple-600 rounded-lg"
    onClick={() => setShowSettings(!showSettings)}
  >
    Settings
  </motion.button>
  <motion.button
    whileHover={{ scale: 1.05 }}
    className="px-4 py-2 bg-blue-600 rounded-lg"
    onClick={() => setShowShiftManager(true)}
  >
    Manage Shifts
  </motion.button>
  <motion.button
    whileHover={{ scale: 1.05 }}
    className="px-4 py-2 bg-green-600 rounded-lg"
    onClick={() => setShowReports(true)}
  >
    Generate Reports
  </motion.button>
</div>
        
        {/* Reports Modal */}
        <Dialog
      open={showReports}
      onClose={() => setShowReports(false)}
      className="fixed z-50 inset-0 flex items-center justify-center"
    >
      <div className="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-2xl w-full">
        <Dialog.Title className="text-2xl font-bold mb-4 text-green-400">
          Generate Reports
        </Dialog.Title>

        <div className="space-y-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-gray-700 rounded-lg p-2 w-full"
          >
            <option>Daily Logs</option>
            <option>Monthly Summary</option>
            <option>Absenteeism Trends</option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-700 rounded-lg p-2 w-full"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-700 rounded-lg p-2 w-full"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleExportPDF}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white"
            >
              Export to PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded-lg text-white"
            >
              Export to Excel
            </button>
            <button
              onClick={() => setShowReports(false)}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>

        {/* Calendar Section */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
  <div className="flex justify-between items-center mb-6">
    <motion.button
      whileHover={{ scale: 1.1 }}
      className="p-2 hover:bg-gray-700 rounded-lg"
      onClick={() => handleMonthChange(-1)}
    >
      <FiChevronLeft size={20} />
    </motion.button>
    
    <h2 className="text-xl font-semibold">
      {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
    </h2>
    
    <motion.button
      whileHover={{ scale: 1.1 }}
      className="p-2 hover:bg-gray-700 rounded-lg"
      onClick={() => handleMonthChange(1)}
    >
      <FiChevronRight size={20} />
    </motion.button>
  </div>

  <div className="grid grid-cols-7 gap-2 mb-4">
    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
      <div key={day} className="text-center text-gray-400 text-sm p-2">
        {day}
      </div>
    ))}
  </div>

  <div className="grid grid-cols-7 gap-2">
    {calendarDays.map((date, index) => {
      const formattedDate = date.toISOString().split('T')[0];
      const dailyRecords = attendanceData.filter(a => a.date === formattedDate);
      const total = dailyRecords.length;
      const presentCount = dailyRecords.filter(a => a.status === 'present' || a.status === 'late').length;
      const absentCount = dailyRecords.filter(a => a.status === 'absent').length;
      
      const presentPercent = total ? Math.round((presentCount / total) * 100) : 0;
      const absentPercent = total ? Math.round((absentCount / total) * 100) : 0;

      // Calculate color intensity based on percentage
      const presentColorIntensity = Math.min(500, 300 + presentPercent * 2);
      const absentColorIntensity = Math.min(500, 300 + absentPercent * 2);

      return (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className={`h-24 p-2 rounded-lg border border-gray-700 flex flex-col ${
            total > 0 ? 'bg-gray-900' : 'bg-gray-900/50'
          }`}
        >
          <div className="text-right text-sm font-medium text-gray-300">
            {date.getDate()}
          </div>
          
          {total > 0 ? (
            <div className="flex-1 flex flex-col justify-end space-y-1">
              {/* Present percentage bar */}
              <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-green-400">Present</span>
                  <span className="text-gray-400">{presentPercent}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${presentPercent}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Absent percentage bar */}
              <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-red-400">Absent</span>
                  <span className="text-gray-400">{absentPercent}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-red-500 h-1.5 rounded-full" 
                    style={{ width: `${absentPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-xs text-gray-500">No data</span>
            </div>
          )}
        </motion.div>
      );
    })}
  </div>
</div>

        {/* Attendance List */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-600">
                  {['Employee', 'Role', 'Date', 'Check In', 'Check Out', 'Status', 'Actions'].map(header => (
                    <th key={header} className="pb-3 px-2">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map(record => (
                  <motion.tr
                    key={record.id}
                    className="border-b border-gray-700 hover:bg-gray-700/20"
                    whileHover={{ x: 5 }}
                  >
                    <td className="py-4 px-2 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-600 mr-3 flex items-center justify-center">
                        <FiUserCheck className="text-gray-300" />
                      </div>
                      {record.employee}
                    </td>
                    <td className="px-2">{record.role}</td>
                    <td className="px-2">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-2">{record.checkIn}</td>
                    <td className="px-2">{record.checkOut}</td>
                    <td className="px-2">
                      <span className={`${statusColors[record.status]} px-2 py-1 rounded-full`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-2">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-green-400 hover:text-green-300"
                          onClick={() => handleStatusChange(record.id, 'present')}
                        >
                          <FiCheck size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleStatusChange(record.id, 'absent')}
                        >
                          <FiX size={20} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <Dialog
          open={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          className="fixed z-50 inset-0 flex items-center justify-center"
        >
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
            <Dialog.Title className="text-xl font-bold mb-4 text-blue-400">
              Confirm Submission
            </Dialog.Title>
            <p className="text-gray-300 mb-6">
              Are you sure you want to submit all attendance changes?
            </p>
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg"
                onClick={() => {
                  setIsConfirmOpen(false);
                  // Add submission logic here
                }}
              >
                Confirm Submit
              </motion.button>
            </div>
          </div>
        </Dialog>
      </motion.div>
    </div>
  );
};

// Reusable StatCard component with fixed color classes
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: {
      bg: 'bg-gradient-to-br from-green-600/30 to-green-800/30',
      border: 'border-green-500/20',
      text: 'text-green-400',
      iconBg: 'bg-green-500/20'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-600/30 to-red-800/30',
      border: 'border-red-500/20',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-600/30 to-yellow-800/30',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-600/30 to-purple-800/30',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      iconBg: 'bg-purple-500/20'
    }
  };

  const classes = colorClasses[color] || colorClasses.green;

  return (
    <motion.div 
      className={`${classes.bg} p-4 rounded-xl border ${classes.border}`}
      whileHover={{ y: -3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-300 text-sm">{title}</div>
          <div className={`text-2xl font-bold ${classes.text}`}>{value}</div>
        </div>
        <div className={`w-10 h-10 rounded-full ${classes.iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceManagement;