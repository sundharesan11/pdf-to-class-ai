import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'teacher' | 'student';
}

export interface AuthenticatedRequest extends FastifyRequest {
  user?: JWTPayload;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function authenticateRequest(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        error: 'No token provided',
      });
    }
    
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid or expired token',
      });
    }
    
    // Verify user still exists
    const user = await db.query.users.findFirst({
      where: eq(db.schema.users.id, payload.userId),
    });
    
    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'User not found',
      });
    }
    
    // Attach user to request
    request.user = payload;
  } catch (error) {
    return reply.status(500).send({
      success: false,
      error: 'Authentication failed',
    });
  }
}

export async function requireRole(
  roles: ('teacher' | 'student')[],
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  if (!request.user) {
    return reply.status(401).send({
      success: false,
      error: 'Authentication required',
    });
  }
  
  if (!roles.includes(request.user.role)) {
    return reply.status(403).send({
      success: false,
      error: 'Insufficient permissions',
    });
  }
}
