// Shared TypeScript types and interfaces for the EduAgent monorepo

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  joinCode: string;
  teacherId: string;
  chapters: Chapter[];
  students: number;
  completion: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  duration: number;
  type?: 'lesson' | 'quiz';
  completed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'agent' | 'student' | 'system';
  content: string;
  timestamp: string;
  classId?: string;
  sectionId?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: number | string;
  hint?: string;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  answers: Record<string, any>;
  score: number;
  completedAt: string;
}

export interface Progress {
  id: string;
  studentId: string;
  classId: string;
  currentSection: number;
  completedSections: string[];
  totalTimeSpent: number;
  lastAccessed: string;
}

export interface Analytics {
  classId: string;
  totalStudents: number;
  averageProgress: number;
  averageScore: number;
  completionRate: number;
  activeStudents: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Export all types as a namespace as well
export namespace Types {
  export type UserType = User;
  export type ClassType = Class;
  export type ChapterType = Chapter;
  export type SectionType = Section;
  export type ChatMessageType = ChatMessage;
  export type QuizQuestionType = QuizQuestion;
  export type QuizAttemptType = QuizAttempt;
  export type ProgressType = Progress;
  export type AnalyticsType = Analytics;
}
