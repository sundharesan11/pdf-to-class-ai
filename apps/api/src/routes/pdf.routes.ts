import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { pdfUploadWorkflow } from '../workflows/pdfUpload.workflow.js';

const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
await fs.mkdir(uploadDir, { recursive: true });

const uploadSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

export async function pdfRoutes(fastify: FastifyInstance) {
  // Upload PDF
  fastify.post('/upload', {
    preHandler: [fastify.authenticate, fastify.requireTeacher],
  }, async (request: any, reply) => {
    try {
      const data = await request.file();
      
      if (!data) {
        return reply.status(400).send({
          success: false,
          error: 'No file uploaded',
        });
      }
      
      // Validate file type
      if (data.mimetype !== 'application/pdf') {
        return reply.status(400).send({
          success: false,
          error: 'Only PDF files are allowed',
        });
      }
      
      // Get form fields
      const fields = data.fields;
      const metadata = uploadSchema.parse({
        title: (fields.title as any)?.value,
        description: (fields.description as any)?.value,
        difficulty: (fields.difficulty as any)?.value,
      });
      
      // Save file
      const filename = `${Date.now()}-${data.filename}`;
      const filepath = path.join(uploadDir, filename);
      
      const buffer = await data.toBuffer();
      await fs.writeFile(filepath, buffer);
      
      console.log(`📄 Saved PDF: ${filepath}`);
      
      // Run PDF upload workflow
      const result = await pdfUploadWorkflow({
        filePath: filepath,
        title: metadata.title,
        description: metadata.description,
        difficulty: metadata.difficulty,
        teacherId: request.user.userId,
      });
      
      return reply.send({
        success: true,
        data: result,
        message: 'PDF processed successfully',
      });
    } catch (error: any) {
      console.error('PDF upload error:', error);
      
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: 'PDF upload failed',
        message: error.message,
      });
    }
  });
}
