import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, chatMessages, classMembers } from '../db/index.js';
import { eq, and, desc } from 'drizzle-orm';
import { answerQuestion } from '../agents/tutor.agent.js';

const sendMessageSchema = z.object({
  classId: z.number(),
  sectionId: z.number().optional(),
  message: z.string().min(1),
});

export async function chatRoutes(fastify: FastifyInstance) {
  // Send chat message
  fastify.post('/message', {
    preHandler: [fastify.authenticate, fastify.requireStudent],
  }, async (request: any, reply) => {
    try {
      const body = sendMessageSchema.parse(request.body);
      
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
      
      // Get recent chat history
      const recentChats = await db.query.chatMessages.findMany({
        where: and(
          eq(chatMessages.studentId, request.user.userId),
          eq(chatMessages.classId, body.classId)
        ),
        orderBy: [desc(chatMessages.createdAt)],
        limit: 5,
      });
      
      const chatHistory = recentChats.reverse().map(msg => ({
        role: msg.sender === 'student' ? 'user' : 'assistant',
        content: msg.message,
      }));
      
      // Get AI response
      const response = await answerQuestion(
        body.classId,
        body.sectionId || 0,
        body.message,
        chatHistory
      );
      
      // Save both messages
      const [studentMsg, tutorMsg] = await db.insert(chatMessages).values([
        {
          classId: body.classId,
          studentId: request.user.userId,
          sectionId: body.sectionId,
          sender: 'student',
          message: body.message,
        },
        {
          classId: body.classId,
          studentId: request.user.userId,
          sectionId: body.sectionId,
          sender: 'tutor',
          message: response,
        },
      ]).returning();
      
      return reply.send({
        success: true,
        data: {
          question: studentMsg,
          answer: tutorMsg,
        },
      });
    } catch (error: any) {
      console.error('Send message error:', error);
      
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: 'Failed to send message',
      });
    }
  });
  
  // Get chat history
  fastify.get('/history/:classId', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    try {
      const classId = parseInt(request.params.classId);
      
      // Verify enrollment
      const membership = await db.query.classMembers.findFirst({
        where: and(
          eq(classMembers.classId, classId),
          eq(classMembers.userId, request.user.userId)
        ),
      });
      
      if (!membership) {
        return reply.status(403).send({
          success: false,
          error: 'Not enrolled in this class',
        });
      }
      
      const messages = await db.query.chatMessages.findMany({
        where: and(
          eq(chatMessages.classId, classId),
          eq(chatMessages.studentId, request.user.userId)
        ),
        orderBy: [desc(chatMessages.createdAt)],
        limit: 50,
      });
      
      return reply.send({
        success: true,
        data: messages.reverse(),
      });
    } catch (error) {
      console.error('Get history error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get chat history',
      });
    }
  });
}
