import { Agent } from '@mastra/core';
import { db, progress, Progress } from '../db/index.js';
import { eq, and } from 'drizzle-orm';

export const progressAgent = new Agent({
  name: 'ProgressAgent',
  instructions: `You are a learning analytics specialist tracking student progress.

Your role:
- Monitor student interactions and quiz performance
- Identify learning patterns
- Detect knowledge gaps
- Recommend personalized learning paths
- Track mastery of concepts`,
  model: {
    provider: 'OPEN_AI',
    name: 'gpt-4-turbo-preview',
    toolChoice: 'auto',
  },
});

export async function logProgress(
  studentId: number,
  sectionId: number,
  status: 'not_started' | 'in_progress' | 'completed',
  score?: number
): Promise<void> {
  // Check if progress record exists
  const existing = await db.query.progress.findFirst({
    where: and(
      eq(progress.studentId, studentId),
      eq(progress.sectionId, sectionId)
    ),
  });
  
  if (existing) {
    // Update existing progress
    await db.update(progress)
      .set({
        status,
        score: score ?? existing.score,
        lastInteraction: new Date(),
      })
      .where(eq(progress.id, existing.id));
  } else {
    // Create new progress record
    await db.insert(progress).values({
      studentId,
      sectionId,
      status,
      score,
      lastInteraction: new Date(),
    });
  }
}

export async function analyzeStudentPerformance(
  studentId: number,
  recentScores: number[]
): Promise<{
  trend: 'improving' | 'stable' | 'declining';
  recommendation: string;
}> {
  if (recentScores.length < 2) {
    return {
      trend: 'stable',
      recommendation: 'Keep learning! Complete more sections to track your progress.',
    };
  }
  
  // Calculate simple trend
  const avgFirst = recentScores.slice(0, Math.floor(recentScores.length / 2))
    .reduce((a, b) => a + b, 0) / Math.floor(recentScores.length / 2);
  const avgLast = recentScores.slice(Math.floor(recentScores.length / 2))
    .reduce((a, b) => a + b, 0) / Math.ceil(recentScores.length / 2);
  
  let trend: 'improving' | 'stable' | 'declining';
  if (avgLast > avgFirst + 5) {
    trend = 'improving';
  } else if (avgLast < avgFirst - 5) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }
  
  const prompt = `A student's recent quiz scores show a ${trend} trend:
Scores: ${recentScores.join(', ')}

Provide a brief, encouraging recommendation (1-2 sentences) on how they should proceed.`;

  const result = await progressAgent.generate(prompt);
  
  return {
    trend,
    recommendation: result.text,
  };
}
