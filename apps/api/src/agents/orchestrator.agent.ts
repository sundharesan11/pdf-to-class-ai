import { Agent } from '@mastra/core';

export const orchestratorAgent = new Agent({
  name: 'SessionOrchestratorAgent',
  instructions: `You are the session orchestrator managing the learning flow.

Your decisions:
- Decide when a student is ready to move to the next section
- Determine if a student needs to review material
- Balance pacing with mastery
- Choose between teaching, quizzing, or providing additional practice

Decision criteria:
- Quiz score >= 80%: Move to next section
- Quiz score 60-79%: Offer review with additional examples
- Quiz score < 60%: Re-teach section with different approach
- After 2 failed attempts: Recommend prerequisite review`,
  model: {
    provider: 'OPEN_AI',
    name: 'gpt-4-turbo-preview',
    toolChoice: 'auto',
  },
});

export interface SessionDecision {
  action: 'next_section' | 'repeat_section' | 'review_concepts' | 'extra_practice' | 'prerequisite_review';
  reason: string;
  nextSectionId?: number;
  conceptsToReview?: string[];
}

export async function decideNextStep(
  currentSectionId: number,
  quizScore: number,
  totalMarks: number,
  attemptCount: number,
  timeSpent: number,
  previousScores: number[]
): Promise<SessionDecision> {
  const percentage = (quizScore / totalMarks) * 100;
  
  // Rule-based decision with AI enhancement
  if (percentage >= 80 && attemptCount === 1) {
    return {
      action: 'next_section',
      reason: 'Great performance! You\'ve demonstrated mastery of this material.',
      nextSectionId: currentSectionId + 1,
    };
  }
  
  if (attemptCount >= 2 && percentage < 70) {
    return {
      action: 'prerequisite_review',
      reason: 'You might benefit from reviewing some foundational concepts before continuing.',
    };
  }
  
  if (percentage >= 60 && percentage < 80) {
    const prompt = `A student scored ${percentage.toFixed(1)}% on their quiz (attempt #${attemptCount}).
Previous scores: ${previousScores.join(', ')}
Time spent: ${timeSpent} minutes

Should they:
A) Review specific concepts with additional examples
B) Practice with more exercises
C) Move on but keep an eye on related topics

Respond with a JSON object: { "action": "review_concepts" | "extra_practice" | "next_section", "reason": "..." }`;

    const result = await orchestratorAgent.generate(prompt);
    
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const decision = JSON.parse(jsonMatch[0]);
        return decision;
      }
    } catch (error) {
      console.error('Failed to parse orchestrator decision:', error);
    }
    
    return {
      action: 'review_concepts',
      reason: 'Let\'s review some key concepts to strengthen your understanding.',
    };
  }
  
  // Low score - repeat section
  return {
    action: 'repeat_section',
    reason: 'Let\'s go through this material again with a different approach to help you master it.',
  };
}
