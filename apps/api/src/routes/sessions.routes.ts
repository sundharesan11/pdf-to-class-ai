import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, sessions, classMembers } from '../db/index.js';
import { eq, and } from 'drizzle-orm';
import { sessionFlowWorkflow } from '../workflows/sessionFlow.workflow.js';

const startSessionSchema = z.object({
  classId: z.number(),
});

const continueSessionSchema = z.object({
  action: z.enum(['teach', 'quiz', 'chat', 'decide']),
  quizAnswers: z.record(z.string()).optional(),
  chatMessage: z.string().optional(),
});

export async function sessionsRoutes(fastify: FastifyInstance) {
  // Start new session
  fastify.post('/start', {
    preHandler: [fastify.authenticate, fastify.requireStudent],
  }, async (request: any, reply) => {
    try {
      const body = startSessionSchema.parse(request.body);
      
      // Verify student is enrolled
      const membership = await db.query.classMembers.findFirst({
        where: and(
          eq(classMembers.classId, body.classId),
          eq(classMembers.userId, request.user.userId)
        ),
      });
      
      if (!membership) {
        return reply.status(403).send({
          success: false,
          error: 'Not enrolled in this class',
        });
      }
      
      // Get first section
      const firstSection = await db.query.sections.findFirst({
        where: (sections, { eq }) => {
          // Get first section of first chapter
          return eq(sections.orderIndex, 0);
        },
      });
      
      if (!firstSection) {
        return reply.status(404).send({
          success: false,
          error: 'No sections found in this class',
        });
      }
      
      // Check for existing active session
      const existingSession = await db.query.sessions.findFirst({
        where: and(
          eq(sessions.classId, body.classId),
          eq(sessions.studentId, request.user.userId),
          eq(sessions.status, 'active')
        ),
      });
      
      if (existingSession) {
        return reply.send({
          success: true,
          data: existingSession,
          message: 'Resumed existing session',
        });
      }
      
      // Create new session
      const [newSession] = await db.insert(sessions).values({
        classId: body.classId,
        studentId: request.user.userId,
        currentSectionId: firstSection.id,
        status: 'active',
      }).returning();
      
      return reply.send({
        success: true,
        data: newSession,
        message: 'Session started',
      });
    } catch (error: any) {
      console.error('Start session error:', error);
      
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: 'Failed to start session',
      });
    }
  });
  
  // Continue session
  fastify.post('/:id/continue', {
    preHandler: [fastify.authenticate, fastify.requireStudent],
  }, async (request: any, reply) => {
    try {
      const sessionId = parseInt(request.params.id);
      const body = continueSessionSchema.parse(request.body);
      
      // Get session
      const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      });
      
      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found',
        });
      }
      
      // Verify ownership
      if (session.studentId !== request.user.userId) {
        return reply.status(403).send({
          success: false,
          error: 'Access denied',
        });
      }
      
      if (session.status !== 'active') {
        return reply.status(400).send({
          success: false,
          error: 'Session is not active',
        });
      }
      
      if (!session.currentSectionId) {
        return reply.status(400).send({
          success: false,
          error: 'No current section in session',
        });
      }
      
      // Run session workflow
      const result = await sessionFlowWorkflow({
        sessionId,
        studentId: request.user.userId,
        classId: session.classId,
        currentSectionId: session.currentSectionId,
        action: body.action,
        quizAnswers: body.quizAnswers,
        chatMessage: body.chatMessage,
      });
      
      return reply.send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Continue session error:', error);
      
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: 'Failed to continue session',
        message: error.message,
      });
    }
  });
  
  // Get session details
  fastify.get('/:id', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    try {
      const sessionId = parseInt(request.params.id);
      
      const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
        with: {
          steps: {
            orderBy: (steps, { desc }) => [desc(steps.createdAt)],
            limit: 10,
          },
          currentSection: {
            with: {
              chapter: true,
            },
          },
        },
      });
      
      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found',
        });
      }
      
      // Verify ownership
      if (session.studentId !== request.user.userId) {
        return reply.status(403).send({
          success: false,
          error: 'Access denied',
        });
      }
      
      return reply.send({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error('Get session error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get session',
      });
    }
  });
  
  // Pause session
  fastify.post('/:id/pause', {
    preHandler: [fastify.authenticate, fastify.requireStudent],
  }, async (request: any, reply) => {
    try {
      const sessionId = parseInt(request.params.id);
      
      const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      });
      
      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found',
        });
      }
      
      if (session.studentId !== request.user.userId) {
        return reply.status(403).send({
          success: false,
          error: 'Access denied',
        });
      }
      
      await db.update(sessions)
        .set({ status: 'paused' })
        .where(eq(sessions.id, sessionId));
      
      return reply.send({
        success: true,
        message: 'Session paused',
      });
    } catch (error) {
      console.error('Pause session error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to pause session',
      });
    }
  });
}
