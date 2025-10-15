import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, classes, classMembers, chapters, sections } from '../db/index.js';
import { eq, and, desc } from 'drizzle-orm';
import { generateJoinCode } from '../lib/utils.js';

const createClassSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

const joinClassSchema = z.object({
  joinCode: z.string().length(8),
});

export async function classesRoutes(fastify: FastifyInstance) {
  // Get all classes (for teacher)
  fastify.get('/', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    try {
      let classList;
      
      if (request.user.role === 'teacher') {
        // Get classes created by teacher
        classList = await db.query.classes.findMany({
          where: eq(classes.createdBy, request.user.userId),
          with: {
            chapters: {
              with: {
                sections: true,
              },
            },
            members: true,
          },
          orderBy: [desc(classes.createdAt)],
        });
      } else {
        // Get classes student is enrolled in
        const memberRecords = await db.query.classMembers.findMany({
          where: eq(classMembers.userId, request.user.userId),
          with: {
            class: {
              with: {
                chapters: {
                  with: {
                    sections: true,
                  },
                },
              },
            },
          },
        });
        
        classList = memberRecords.map(m => m.class);
      }
      
      return reply.send({
        success: true,
        data: classList,
      });
    } catch (error) {
      console.error('Get classes error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get classes',
      });
    }
  });
  
  // Get class by ID
  fastify.get('/:id', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    try {
      const classId = parseInt(request.params.id);
      
      const classData = await db.query.classes.findFirst({
        where: eq(classes.id, classId),
        with: {
          chapters: {
            with: {
              sections: {
                with: {
                  quizzes: {
                    with: {
                      questions: true,
                    },
                  },
                },
              },
            },
            orderBy: (chapters, { asc }) => [asc(chapters.orderIndex)],
          },
          members: {
            with: {
              user: true,
            },
          },
        },
      });
      
      if (!classData) {
        return reply.status(404).send({
          success: false,
          error: 'Class not found',
        });
      }
      
      // Check authorization
      const isMember = classData.members.some(m => m.userId === request.user.userId);
      const isCreator = classData.createdBy === request.user.userId;
      
      if (!isMember && !isCreator) {
        return reply.status(403).send({
          success: false,
          error: 'Access denied',
        });
      }
      
      return reply.send({
        success: true,
        data: classData,
      });
    } catch (error) {
      console.error('Get class error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get class',
      });
    }
  });
  
  // Join class
  fastify.post('/join', {
    preHandler: [fastify.authenticate, fastify.requireStudent],
  }, async (request: any, reply) => {
    try {
      const body = joinClassSchema.parse(request.body);
      
      // Find class
      const classData = await db.query.classes.findFirst({
        where: eq(classes.joinCode, body.joinCode),
      });
      
      if (!classData) {
        return reply.status(404).send({
          success: false,
          error: 'Invalid join code',
        });
      }
      
      // Check if already enrolled
      const existing = await db.query.classMembers.findFirst({
        where: and(
          eq(classMembers.classId, classData.id),
          eq(classMembers.userId, request.user.userId)
        ),
      });
      
      if (existing) {
        return reply.status(400).send({
          success: false,
          error: 'Already enrolled in this class',
        });
      }
      
      // Enroll student
      await db.insert(classMembers).values({
        classId: classData.id,
        userId: request.user.userId,
        progressPercent: '0',
      });
      
      return reply.send({
        success: true,
        data: {
          classId: classData.id,
          title: classData.title,
        },
        message: 'Successfully joined class',
      });
    } catch (error: any) {
      console.error('Join class error:', error);
      
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: 'Failed to join class',
      });
    }
  });
  
  // Get class students (teacher only)
  fastify.get('/:id/students', {
    preHandler: [fastify.authenticate, fastify.requireTeacher],
  }, async (request: any, reply) => {
    try {
      const classId = parseInt(request.params.id);
      
      // Verify teacher owns this class
      const classData = await db.query.classes.findFirst({
        where: eq(classes.id, classId),
      });
      
      if (!classData || classData.createdBy !== request.user.userId) {
        return reply.status(403).send({
          success: false,
          error: 'Access denied',
        });
      }
      
      const students = await db.query.classMembers.findMany({
        where: eq(classMembers.classId, classId),
        with: {
          user: true,
        },
      });
      
      return reply.send({
        success: true,
        data: students.map(s => ({
          id: s.user.id,
          name: s.user.name,
          email: s.user.email,
          progress: s.progressPercent,
          joinedAt: s.joinedAt,
        })),
      });
    } catch (error) {
      console.error('Get students error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get students',
      });
    }
  });
}
