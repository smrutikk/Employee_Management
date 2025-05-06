// src/data/teamOverviewData.js

export const teamMembers = [
  { id: 1, name: 'Jane Smith', role: 'Frontend Developer', location: 'Remote', department: 'Engineering', status: 'online' },
  { id: 2, name: 'Michael Johnson', role: 'Project Manager', location: 'New York', department: 'Operations', status: 'offline' },
  { id: 3, name: 'Emily Davis', role: 'UI/UX Designer', location: 'Berlin', department: 'Design', status: 'online' },
  { id: 4, name: 'Kevin Lee', role: 'Backend Developer', location: 'Toronto', department: 'Engineering', status: 'online' },
  { id: 5, name: 'Anna Brown', role: 'HR Specialist', location: 'London', department: 'HR', status: 'offline' },
  { id: 6, name: 'Sam Wilson', role: 'DevOps Engineer', location: 'Austin', department: 'Infrastructure', status: 'online' },
  { id: 7, name: 'Lucy Kim', role: 'QA Tester', location: 'San Francisco', department: 'Quality Assurance', status: 'offline' },
  { id: 8, name: 'Daniel Garcia', role: 'Mobile Developer', location: 'Barcelona', department: 'Mobile', status: 'online' },
  { id: 9, name: 'Olivia Wong', role: 'Data Analyst', location: 'Singapore', department: 'Analytics', status: 'online' },
  { id: 10, name: 'Chris Evans', role: 'Security Analyst', location: 'Dublin', department: 'Security', status: 'offline' }
];

export const initialLeaveRequests = [
  {
    id: 1,
    employee: 'John Doe',
    type: 'vacation',
    start: new Date(2025, 3, 25),
    end: new Date(2025, 3, 26),
    status: 'pending',
    reason: 'Family vacation'
  },
  {
    id: 2,
    employee: 'Jane Smith',
    type: 'sick',
    start: new Date(2025, 3, 28),
    end: new Date(2025, 3, 29),
    status: 'pending',
    reason: 'Flu recovery'
  },
  {
    id: 3,
    employee: 'Michael Johnson',
    type: 'personal',
    start: new Date(2025, 4, 1),
    end: new Date(2025, 4, 2),
    status: 'approved'
  }
];

export const initialCalendarEvents = [
  {
    id: 1,
    title: 'John Doe - Vacation',
    start: new Date(2025, 3, 25),
    end: new Date(2025, 3, 26),
    type: 'leave',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Jane Smith - Sick Leave',
    start: new Date(2025, 3, 28),
    end: new Date(2025, 3, 29),
    type: 'leave',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Michael Johnson - Personal',
    start: new Date(2025, 4, 1),
    end: new Date(2025, 4, 2),
    type: 'leave',
    status: 'approved'
  }
];

export const teamStructure = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Engineering Manager',
    department: 'Engineering',
    location: 'New York',
    status: 'online',
    children: [
      {
        id: 2,
        name: 'John Doe',
        role: 'Tech Lead',
        department: 'Engineering',
        location: 'London',
        status: 'online',
        children: [
          {
            id: 3,
            name: 'Alice Chen',
            role: 'Senior Developer',
            department: 'Engineering',
            location: 'San Francisco',
            status: 'remote'
          },
          {
            id: 4,
            name: 'Kevin Lee',
            role: 'Backend Developer',
            department: 'Engineering',
            location: 'Toronto',
            status: 'online'
          },
          {
            id: 6,
            name: 'Sam Wilson',
            role: 'DevOps Engineer',
            department: 'Infrastructure',
            location: 'Austin',
            status: 'online'
          }
        ]
      },
      {
        id: 8,
        name: 'Daniel Garcia',
        role: 'Mobile Developer',
        department: 'Mobile',
        location: 'Barcelona',
        status: 'online'
      }
    ]
  },
  {
    id: 5,
    name: 'Anna Brown',
    role: 'HR Specialist',
    department: 'HR',
    location: 'London',
    status: 'offline',
    children: []
  },
  {
    id: 7,
    name: 'Lucy Kim',
    role: 'QA Tester',
    department: 'Quality Assurance',
    location: 'San Francisco',
    status: 'offline',
    children: []
  },
  {
    id: 9,
    name: 'Olivia Wong',
    role: 'Data Analyst',
    department: 'Analytics',
    location: 'Singapore',
    status: 'online',
    children: []
  },
  {
    id: 10,
    name: 'Chris Evans',
    role: 'Security Analyst',
    department: 'Security',
    location: 'Dublin',
    status: 'offline',
    children: []
  }
];

export const leaveRequests = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  employee: teamMembers[i % teamMembers.length].name,
  type: i % 2 === 0 ? 'Vacation' : 'Sick Leave',
  dates: [`2025-04-${10 + i}`, `2025-04-${11 + i}`],
  status: ['pending', 'approved', 'rejected'][i % 3]
}));

export const timesheets = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  employee: teamMembers[i % teamMembers.length].name,
  project: `Project ${String.fromCharCode(65 + i)}`,
  hours: 35 + (i % 6),
  week: `2025-W${10 + i}`,
  status: ['submitted', 'approved', 'pending'][i % 3]
}));

export const tasks = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Task ${i + 1} Title`,
  assignee: teamMembers[i % teamMembers.length].name,
  dueDate: `2025-05-${i + 1}`,
  status: ['in-progress', 'completed', 'pending'][i % 3],
  priority: ['low', 'medium', 'high', 'critical'][i % 4],
  project: `Project ${['Redesign', 'Migration', 'Expansion'][i % 3]}`
}));

export const reports = {
  attendance: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    present: [85, 82, 88, 90, 87],
    absent: [15, 18, 12, 10, 13]
  },
  performance: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    scores: [78, 82, 85, 88]
  },
  tasks: {
    labels: ['Completed', 'In Progress', 'Overdue'],
    data: [65, 25, 10]
  }
};

export const calendarEvents = Array.from({ length: 10 }, (_, i) => ({
  title: `${teamMembers[i % teamMembers.length].name} - ${i % 2 === 0 ? 'Vacation' : 'Sick Leave'}`,
  start: new Date(2025, 3, 10 + i),
  end: new Date(2025, 3, 11 + i),
  type: i % 2 === 0 ? 'leave' : 'event'
}));

export const performanceData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  employee: teamMembers[i % teamMembers.length].name,
  overallScore: 80 + (i % 10),
  kpis: [
    { name: 'Productivity', score: 75 + (i % 5) },
    { name: 'Quality', score: 80 + (i % 5) },
    { name: 'Collaboration', score: 85 + (i % 5) }
  ],
  feedback: [
    { reviewer: 'Manager', comment: 'Solid contributor to the team.' },
    { reviewer: 'Peer', comment: 'Very cooperative and helpful.' }
  ],
  goals: [
    { name: 'Improve technical skills', completed: i % 2 === 0 },
    { name: 'Take leadership course', completed: i % 3 === 0 }
  ]
}));

export const tabs = [
  { id: 'directory', label: 'Team Directory' },
  { id: 'timesheet', label: 'Timesheets' },
  { id: 'performance', label: 'Performance' },
  
];
