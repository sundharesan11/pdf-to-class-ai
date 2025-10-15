import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db, users } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword, sanitizeUser } from '../lib/utils.js';
import { generateToken } from '../middleware/auth.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['teacher', 'student']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);
      
      // Check if user exists
      const existing = await db.query.users.findFirst({
        where: eq(users.email, body.email),
      });
      
      if (existing) {
        return reply.status(400).send({
          success: false,
          error: 'Email already registered',
        });
      }
      
      // Hash password
      const passwordHash = await hashPassword(body.password);
      
      // Create user
      const [newUser] = await db.insert(users).values({
        name: body.name,
        email: body.email,
        passwordHash,
        role: body.role,
      }).returning();
      
      // Generate token
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });
      
      return reply.send({
        success: true,
        data: {
          user: sanitizeUser(newUser),
          token,
        },
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      console.error('Register error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Registration failed',
      });
    }
  });
  
  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);
      
      // Find user
      const user = await db.query.users.findFirst({
        where: eq(users.email, body.email),
      });
      
      if (!user) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid credentials',
        });
      }
      
      // Verify password
      const isValid = await comparePassword(body.password, user.passwordHash);
      
      if (!isValid) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid credentials',
        });
      }
      
      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      
      return reply.send({
        success: true,
        data: {
          user: sanitizeUser(user),
          token,
        },
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      console.error('Login error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Login failed',
      });
    }
  });
  
  // Get current user
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
  }, async (request: any, reply) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, request.user.userId),
      });
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: 'User not found',
        });
      }
      
      return reply.send({
        success: true,
        data: sanitizeUser(user),
      });
    } catch (error) {
      console.error('Get user error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to get user',
      });
    }
  });
}
