// constants/data.js
export const managers = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Senior Manager',
    department: 'Engineering',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    teamSize: 12,
    performance: 4.5,
    status: 'active',
    teamMembers: [
      { id: 1, name: 'Alice Johnson' },
      { id: 2, name: 'Bob Smith' },
      { id: 3, name: 'Charlie Brown' }
    ],
    approvals: [
      { id: 1, title: 'Budget Approval', description: 'Q3 Marketing budget' },
      { id: 2, title: 'Hire Request', description: 'New frontend developer' }
    ],
    tasks: [
      { id: 1, text: 'Complete quarterly review', completed: false },
      { id: 2, text: 'Team building event', completed: true }
    ],
    feedback: [
      { id: 1, text: 'Great leadership in the last project', author: 'Sarah Williams' },
      { id: 2, text: 'Could improve communication with remote team', author: 'Mike Chen' }
    ]
  },
  {
    id: 2,
    name: 'Emily Clark',
    role: 'Project Manager',
    department: 'Marketing',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    teamSize: 8,
    performance: 4.2,
    status: 'active',
    teamMembers: [
      { id: 4, name: 'James Bond' },
      { id: 5, name: 'Natalie Lee' }
    ],
    approvals: [
      { id: 3, title: 'Campaign Approval', description: 'Holiday campaign plan' }
    ],
    tasks: [
      { id: 3, text: 'Launch Instagram campaign', completed: true },
      { id: 4, text: 'Coordinate with ad agency', completed: false }
    ],
    feedback: [
      { id: 3, text: 'Excellent presentation skills', author: 'Anna Bell' }
    ]
  },
  {
    id: 3,
    name: 'Michael Lee',
    role: 'Operations Manager',
    department: 'Logistics',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    teamSize: 10,
    performance: 4.0,
    status: 'active',
    teamMembers: [
      { id: 6, name: 'Oscar Wilde' },
      { id: 7, name: 'Ivy Tran' }
    ],
    approvals: [
      { id: 4, title: 'Vendor Renewal', description: 'Renewal with primary vendor' }
    ],
    tasks: [
      { id: 5, text: 'Check warehouse inventory', completed: false }
    ],
    feedback: [
      { id: 4, text: 'Handles crisis well', author: 'Tony Kim' }
    ]
  },
  {
    id: 4,
    name: 'Sophia Patel',
    role: 'HR Manager',
    department: 'Human Resources',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    teamSize: 6,
    performance: 4.8,
    status: 'active',
    teamMembers: [
      { id: 8, name: 'Liam Mason' }
    ],
    approvals: [
      { id: 5, title: 'Policy Change', description: 'Remote work guidelines' }
    ],
    tasks: [
      { id: 6, text: 'Conduct onboarding session', completed: true }
    ],
    feedback: [
      { id: 5, text: 'Very supportive and approachable', author: 'Rachel Wu' }
    ]
  },
  {
    id: 5,
    name: 'David Kim',
    role: 'Finance Manager',
    department: 'Finance',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    teamSize: 5,
    performance: 3.9,
    status: 'active',
    teamMembers: [],
    approvals: [],
    tasks: [],
    feedback: []
  },
  {
    id: 6,
    name: 'Olivia Sanchez',
    role: 'Product Manager',
    department: 'Product',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    teamSize: 9,
    performance: 4.7,
    status: 'active',
    teamMembers: [
      { id: 9, name: 'Tom Hardy' },
      { id: 10, name: 'Emma Watson' }
    ],
    approvals: [],
    tasks: [],
    feedback: []
  },
  {
    id: 7,
    name: 'Daniel Walker',
    role: 'IT Manager',
    department: 'IT',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    teamSize: 11,
    performance: 4.4,
    status: 'active',
    teamMembers: [],
    approvals: [],
    tasks: [],
    feedback: []
  },
  {
    id: 8,
    name: 'Chloe Nguyen',
    role: 'Content Manager',
    department: 'Creative',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    teamSize: 7,
    performance: 4.1,
    status: 'active',
    teamMembers: [],
    approvals: [],
    tasks: [],
    feedback: []
  },
  {
    id: 9,
    name: 'Liam Brown',
    role: 'Sales Manager',
    department: 'Sales',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    teamSize: 13,
    performance: 3.8,
    status: 'active',
    teamMembers: [],
    approvals: [],
    tasks: [],
    feedback: []
  },
  {
    id: 10,
    name: 'Ava Wilson',
    role: 'Training Manager',
    department: 'Learning & Development',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    teamSize: 4,
    performance: 4.9,
    status: 'active',
    teamMembers: [],
    approvals: [],
    tasks: [],
    feedback: []
  }
];


export const departments = [...new Set(managers.map(manager => manager.department))];

export const performanceData = [ 
    { month: 'Jan', rating: 4.2 },
    { month: 'Feb', rating: 4.5 },
    { month: 'Mar', rating: 4.7 },
    { month: 'Apr', rating: 4.8 },
    { month: 'May', rating: 4.6 },
    { month: 'Jun', rating: 4.9 },
    { month: 'Jul', rating: 4.3 },
    { month: 'Aug', rating: 4.4 },
    { month: 'Sep', rating: 4.5 },
    { month: 'Oct', rating: 4.6 },
    { month: 'Nov', rating: 4.7 },
    { month: 'Dec', rating: 4.8 }
  ];

  export const timeline = [
    { id: 1, action: 'Team Meeting', details: 'Conducted weekly team sync', date: '2 days ago' },
    { id: 2, action: 'Project Completed', details: 'Launched new marketing campaign', date: '1 week ago' },
    { id: 3, action: 'Performance Review', details: 'Completed annual reviews for team', date: '2 weeks ago' }
  ];