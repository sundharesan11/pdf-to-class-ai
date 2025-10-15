import { pgTable, serial, varchar, text, timestamp, integer, pgEnum, decimal, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['teacher', 'student']);
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced']);
export const statusEnum = pgEnum('status', ['draft', 'published']);
export const senderEnum = pgEnum('sender', ['student', 'tutor']);
export const progressStatusEnum = pgEnum('progress_status', ['not_started', 'in_progress', 'completed']);
export const sessionStatusEnum = pgEnum('session_status', ['active', 'paused', 'completed']);
export const stepTypeEnum = pgEnum('step_type', ['teach', 'quiz', 'feedback', 'transition', 'summary']);

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Classes Table
export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  joinCode: varchar('join_code', { length: 20 }).notNull().unique(),
  difficulty: difficultyEnum('difficulty').notNull(),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  pdfUrl: text('pdf_url'),
  status: statusEnum('status').default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Class Members Table
export const classMembers = pgTable('class_members', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  progressPercent: decimal('progress_percent', { precision: 5, scale: 2 }).default('0').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Chapters Table
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  orderIndex: integer('order_index').notNull(),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Sections Table
export const sections = pgTable('sections', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Quizzes Table
export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').references(() => sections.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  totalMarks: integer('total_marks').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Quiz Questions Table
export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  questionText: text('question_text').notNull(),
  options: jsonb('options').notNull(),
  correctAnswer: varchar('correct_answer', { length: 255 }).notNull(),
  explanation: text('explanation'),
  marks: integer('marks').notNull(),
});

// Quiz Attempts Table
export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  answers: jsonb('answers').notNull(),
  score: integer('score').notNull(),
  startedAt: timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at'),
  feedback: text('feedback'),
});

// Chat Messages Table
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sectionId: integer('section_id').references(() => sections.id, { onDelete: 'cascade' }),
  sender: senderEnum('sender').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Progress Table
export const progress = pgTable('progress', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sectionId: integer('section_id').references(() => sections.id, { onDelete: 'cascade' }).notNull(),
  status: progressStatusEnum('status').default('not_started').notNull(),
  score: integer('score'),
  lastInteraction: timestamp('last_interaction').defaultNow().notNull(),
});

// Analytics Table
export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  avgProgress: decimal('avg_progress', { precision: 5, scale: 2 }),
  avgScore: decimal('avg_score', { precision: 5, scale: 2 }),
  totalStudents: integer('total_students').default(0).notNull(),
  activeToday: integer('active_today').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sessions Table
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').references(() => classes.id, { onDelete: 'cascade' }).notNull(),
  studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  currentSectionId: integer('current_section_id').references(() => sections.id),
  status: sessionStatusEnum('status').default('active').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  transcriptId: uuid('transcript_id'),
  aiDecisionState: jsonb('ai_decision_state'),
});

// Session Steps Table
export const sessionSteps = pgTable('session_steps', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => sessions.id, { onDelete: 'cascade' }).notNull(),
  stepType: stepTypeEnum('step_type').notNull(),
  input: text('input'),
  output: text('output'),
  score: integer('score'),
  nextAction: varchar('next_action', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Session Memory Table
export const sessionMemory = pgTable('session_memory', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => sessions.id, { onDelete: 'cascade' }).notNull(),
  key: varchar('key', { length: 255 }).notNull(),
  value: text('value').notNull(),
  relevance: decimal('relevance', { precision: 3, scale: 2 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  classes: many(classes),
  classMembers: many(classMembers),
  quizAttempts: many(quizAttempts),
  chatMessages: many(chatMessages),
  progress: many(progress),
  sessions: many(sessions),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  creator: one(users, {
    fields: [classes.createdBy],
    references: [users.id],
  }),
  members: many(classMembers),
  chapters: many(chapters),
  chatMessages: many(chatMessages),
  analytics: many(analytics),
  sessions: many(sessions),
}));

export const classMembersRelations = relations(classMembers, ({ one }) => ({
  class: one(classes, {
    fields: [classMembers.classId],
    references: [classes.id],
  }),
  user: one(users, {
    fields: [classMembers.userId],
    references: [users.id],
  }),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  class: one(classes, {
    fields: [chapters.classId],
    references: [classes.id],
  }),
  sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [sections.chapterId],
    references: [chapters.id],
  }),
  quizzes: many(quizzes),
  chatMessages: many(chatMessages),
  progress: many(progress),
  sessions: many(sessions),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  section: one(sections, {
    fields: [quizzes.sectionId],
    references: [sections.id],
  }),
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  student: one(users, {
    fields: [quizAttempts.studentId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  class: one(classes, {
    fields: [chatMessages.classId],
    references: [classes.id],
  }),
  student: one(users, {
    fields: [chatMessages.studentId],
    references: [users.id],
  }),
  section: one(sections, {
    fields: [chatMessages.sectionId],
    references: [sections.id],
  }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  student: one(users, {
    fields: [progress.studentId],
    references: [users.id],
  }),
  section: one(sections, {
    fields: [progress.sectionId],
    references: [sections.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  class: one(classes, {
    fields: [analytics.classId],
    references: [classes.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  class: one(classes, {
    fields: [sessions.classId],
    references: [classes.id],
  }),
  student: one(users, {
    fields: [sessions.studentId],
    references: [users.id],
  }),
  currentSection: one(sections, {
    fields: [sessions.currentSectionId],
    references: [sections.id],
  }),
  steps: many(sessionSteps),
  memory: many(sessionMemory),
}));

export const sessionStepsRelations = relations(sessionSteps, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionSteps.sessionId],
    references: [sessions.id],
  }),
}));

export const sessionMemoryRelations = relations(sessionMemory, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionMemory.sessionId],
    references: [sessions.id],
  }),
}));
