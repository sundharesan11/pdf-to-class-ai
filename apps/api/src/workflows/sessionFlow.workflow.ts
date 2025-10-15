import { db, sessions, sessionSteps, progress } from '../db/index.js';
import { teachSection, answerQuestion } from '../agents/tutor.agent.js';
import { evaluateQuizAttempt } from '../agents/quiz.agent.js';
import { decideNextStep } from '../agents/orchestrator.agent.js';
import { logProgress } from '../agents/progress.agent.js';
import { eq, and } from 'drizzle-orm';

export interface SessionFlowInput {
  sessionId: number;
  studentId: number;
  classId: number;
  currentSectionId: number;
  action: 'teach' | 'quiz' | 'chat' | 'decide';
  quizAnswers?: Record<string, string>;
  chatMessage?: string;
}

export interface SessionFlowOutput {
  stepType: 'teach' | 'quiz' | 'feedback' | 'transition' | 'summary';
  content: string;
  nextAction?: 'continue' | 'quiz' | 'next_section' | 'repeat' | 'review';
  nextSectionId?: number;
  quizScore?: number;
}

export async function sessionFlowWorkflow(input: SessionFlowInput): Promise<SessionFlowOutput> {
  console.log(`🎓 Session flow: ${input.action} for section ${input.currentSectionId}`);
  
  // Get section details
  const section = await db.query.sections.findFirst({
    where: eq(db.schema.sections.id, input.currentSectionId),
  });
  
  if (!section) {
    throw new Error(`Section ${input.currentSectionId} not found`);
  }
  
  let output: SessionFlowOutput;
  
  switch (input.action) {
    case 'teach':
      // TutorAgent teaches the section
      const teaching = await teachSection(
        input.classId,
        input.currentSectionId,
        section.title,
        section.content
      );
      
      // Log the teaching step
      await db.insert(sessionSteps).values({
        sessionId: input.sessionId,
        stepType: 'teach',
        input: `Teach section: ${section.title}`,
        output: teaching,
      });
      
      // Update progress
      await logProgress(input.studentId, input.currentSectionId, 'in_progress');
      
      output = {
        stepType: 'teach',
        content: teaching,
        nextAction: 'quiz',
      };
      break;
      
    case 'quiz':
      // Get quiz for this section
      const quiz = await db.query.quizzes.findFirst({
        where: eq(db.schema.quizzes.sectionId, input.currentSectionId),
        with: {
          questions: true,
        },
      });
      
      if (!quiz || !input.quizAnswers) {
        throw new Error('Quiz not found or no answers provided');
      }
      
      // Evaluate quiz
      const evaluation = await evaluateQuizAttempt(
        quiz.questions.map(q => ({
          questionText: q.questionText,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          marks: q.marks,
        })),
        input.quizAnswers
      );
      
      // Log quiz attempt
      await db.insert(sessionSteps).values({
        sessionId: input.sessionId,
        stepType: 'quiz',
        input: JSON.stringify(input.quizAnswers),
        output: evaluation.feedback,
        score: evaluation.score,
        nextAction: evaluation.recommendation,
      });
      
      // Log quiz attempt in quiz_attempts table
      await db.insert(db.schema.quizAttempts).values({
        quizId: quiz.id,
        studentId: input.studentId,
        answers: input.quizAnswers,
        score: evaluation.score,
        startedAt: new Date(),
        completedAt: new Date(),
        feedback: evaluation.feedback,
      });
      
      // Update progress based on score
      const status = evaluation.score / evaluation.totalMarks >= 0.8 ? 'completed' : 'in_progress';
      await logProgress(input.studentId, input.currentSectionId, status, evaluation.score);
      
      output = {
        stepType: 'feedback',
        content: evaluation.feedback,
        nextAction: evaluation.recommendation,
        quizScore: evaluation.score,
      };
      break;
      
    case 'chat':
      if (!input.chatMessage) {
        throw new Error('Chat message required');
      }
      
      // Get recent chat history
      const recentChats = await db.query.chatMessages.findMany({
        where: and(
          eq(db.schema.chatMessages.studentId, input.studentId),
          eq(db.schema.chatMessages.classId, input.classId)
        ),
        orderBy: (chatMessages, { desc }) => [desc(chatMessages.createdAt)],
        limit: 5,
      });
      
      const chatHistory = recentChats.reverse().map(msg => ({
        role: msg.sender === 'student' ? 'user' : 'assistant',
        content: msg.message,
      }));
      
      // Get answer from TutorAgent
      const answer = await answerQuestion(
        input.classId,
        input.currentSectionId,
        input.chatMessage,
        chatHistory
      );
      
      // Save messages
      await db.insert(db.schema.chatMessages).values([
        {
          classId: input.classId,
          studentId: input.studentId,
          sectionId: input.currentSectionId,
          sender: 'student',
          message: input.chatMessage,
        },
        {
          classId: input.classId,
          studentId: input.studentId,
          sectionId: input.currentSectionId,
          sender: 'tutor',
          message: answer,
        },
      ]);
      
      output = {
        stepType: 'teach',
        content: answer,
        nextAction: 'continue',
      };
      break;
      
    case 'decide':
      // Get student's recent performance
      const recentProgress = await db.query.progress.findMany({
        where: eq(progress.studentId, input.studentId),
        orderBy: (progress, { desc }) => [desc(progress.lastInteraction)],
        limit: 5,
      });
      
      const recentScores = recentProgress
        .map(p => p.score)
        .filter((s): s is number => s !== null);
      
      const currentProgress = recentProgress.find(
        p => p.sectionId === input.currentSectionId
      );
      
      if (!currentProgress || !currentProgress.score) {
        output = {
          stepType: 'transition',
          content: 'Please complete the quiz first.',
          nextAction: 'quiz',
        };
        break;
      }
      
      // Count attempts for this section
      const attempts = await db.query.quizAttempts.findMany({
        where: eq(db.schema.quizAttempts.studentId, input.studentId),
      });
      
      const attemptCount = attempts.length;
      
      // Get quiz to calculate total marks
      const quizForDecision = await db.query.quizzes.findFirst({
        where: eq(db.schema.quizzes.sectionId, input.currentSectionId),
      });
      
      if (!quizForDecision) {
        throw new Error('Quiz not found for decision');
      }
      
      // Orchestrator decides next step
      const decision = await decideNextStep(
        input.currentSectionId,
        currentProgress.score,
        quizForDecision.totalMarks,
        attemptCount,
        15, // Default time spent
        recentScores
      );
      
      // Log the decision
      await db.insert(sessionSteps).values({
        sessionId: input.sessionId,
        stepType: 'transition',
        input: 'Decision request',
        output: decision.reason,
        nextAction: decision.action,
      });
      
      // Update session with next section if moving forward
      if (decision.action === 'next_section' && decision.nextSectionId) {
        await db.update(sessions)
          .set({ currentSectionId: decision.nextSectionId })
          .where(eq(sessions.id, input.sessionId));
      }
      
      output = {
        stepType: 'transition',
        content: decision.reason,
        nextAction: decision.action === 'next_section' ? 'next_section' : 'repeat',
        nextSectionId: decision.nextSectionId,
      };
      break;
      
    default:
      throw new Error(`Unknown action: ${input.action}`);
  }
  
  // Update session timestamp
  await db.update(sessions)
    .set({ updatedAt: new Date() })
    .where(eq(sessions.id, input.sessionId));
  
  return output;
}
