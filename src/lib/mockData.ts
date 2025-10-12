// Mock data for the application

export interface ChapterSection {
  id: string;
  title: string;
  duration: number; // in minutes
  completed?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  sections: ChapterSection[];
}

export interface Class {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  joinCode: string;
  students: number;
  completion: number;
  active: boolean;
  createdAt: string;
  chapters: Chapter[];
  teacherName: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrollmentDate: string;
  overallProgress: number;
  sectionsCompleted: number;
  totalSections: number;
  quizAverage: number;
  lastActive: string;
  status: 'Active' | 'Struggling' | 'Completed';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Learning' | 'Quiz' | 'Consistency' | 'Special';
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

// Generate mock join code
export function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Mock classes data
export const mockClasses: Class[] = [
  {
    id: '1',
    title: 'Introduction to Biology',
    subject: 'Science',
    grade: '10th Grade',
    description: 'Comprehensive introduction to biological sciences covering cells, genetics, and ecosystems.',
    difficulty: 'Intermediate',
    joinCode: 'BIO101',
    students: 28,
    completion: 65,
    active: true,
    createdAt: '2025-01-15',
    teacherName: 'Dr. Smith',
    chapters: [
      {
        id: 'ch1',
        title: 'Cell Biology',
        sections: [
          { id: 's1', title: 'Cell Structure', duration: 15 },
          { id: 's2', title: 'Cell Membrane', duration: 12 },
          { id: 's3', title: 'Organelles', duration: 18 },
        ],
      },
      {
        id: 'ch2',
        title: 'Genetics',
        sections: [
          { id: 's4', title: 'DNA Structure', duration: 20 },
          { id: 's5', title: 'Protein Synthesis', duration: 25 },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'World History',
    subject: 'Social Studies',
    grade: '11th Grade',
    description: 'Explore major historical events and civilizations that shaped our modern world.',
    difficulty: 'Intermediate',
    joinCode: 'HIST11',
    students: 32,
    completion: 42,
    active: true,
    createdAt: '2025-02-01',
    teacherName: 'Prof. Johnson',
    chapters: [
      {
        id: 'ch1',
        title: 'Ancient Civilizations',
        sections: [
          { id: 's1', title: 'Mesopotamia', duration: 30 },
          { id: 's2', title: 'Ancient Egypt', duration: 28 },
        ],
      },
    ],
  },
];

// Mock students data
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Chen',
    email: 'alice.chen@student.edu',
    enrollmentDate: '2025-01-20',
    overallProgress: 85,
    sectionsCompleted: 17,
    totalSections: 20,
    quizAverage: 92,
    lastActive: '2 hours ago',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Bob Martinez',
    email: 'bob.martinez@student.edu',
    enrollmentDate: '2025-01-22',
    overallProgress: 45,
    sectionsCompleted: 9,
    totalSections: 20,
    quizAverage: 68,
    lastActive: '5 hours ago',
    status: 'Struggling',
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol.w@student.edu',
    enrollmentDate: '2025-01-18',
    overallProgress: 100,
    sectionsCompleted: 20,
    totalSections: 20,
    quizAverage: 96,
    lastActive: '1 day ago',
    status: 'Completed',
  },
];

// Mock achievements
export const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first section',
    icon: 'BookOpen',
    category: 'Learning',
    unlocked: true,
    unlockedDate: '2025-02-01',
  },
  {
    id: '2',
    name: 'Quiz Master',
    description: 'Score 100% on any quiz',
    icon: 'Award',
    category: 'Quiz',
    unlocked: true,
    unlockedDate: '2025-02-05',
  },
  {
    id: '3',
    name: 'Week Warrior',
    description: 'Study for 7 days in a row',
    icon: 'Flame',
    category: 'Consistency',
    unlocked: false,
    progress: 4,
    maxProgress: 7,
  },
  {
    id: '4',
    name: 'Speed Learner',
    description: 'Complete 5 sections in one day',
    icon: 'Zap',
    category: 'Special',
    unlocked: false,
  },
];
