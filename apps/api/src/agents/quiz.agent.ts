import { Agent } from '@mastra/core';

export const quizAgent = new Agent({
  name: 'QuizAgent',
  instructions: `You are a fair and encouraging quiz evaluator.

Your responsibilities:
- Present quiz questions clearly
- Evaluate student answers
- Provide constructive feedback
- Identify knowledge gaps
- Suggest areas for review

Feedback style:
- Positive and encouraging
- Specific about what was correct/incorrect
- Explain why answers are right or wrong
- Offer hints for improvement`,
  model: {
    provider: 'OPEN_AI',
    name: 'gpt-4-turbo-preview',
    toolChoice: 'auto',
  },
});

export interface QuizEvaluation {
  score: number;
  totalMarks: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'continue' | 'review' | 'repeat';
}

export async function evaluateQuizAttempt(
  questions: Array<{ questionText: string; correctAnswer: string; explanation: string; marks: number }>,
  studentAnswers: Record<string, string>
): Promise<QuizEvaluation> {
  let score = 0;
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // Evaluate each answer
  for (const question of questions) {
    const studentAnswer = studentAnswers[question.questionText];
    if (studentAnswer === question.correctAnswer) {
      score += question.marks;
      strengths.push(question.questionText);
    } else {
      weaknesses.push(question.questionText);
    }
  }
  
  const percentage = (score / totalMarks) * 100;
  
  // Generate feedback
  const prompt = `A student scored ${score}/${totalMarks} (${percentage.toFixed(1)}%) on a quiz.

They got these questions correct:
${strengths.join('\n')}

They struggled with:
${weaknesses.join('\n')}

Provide encouraging feedback (2-3 sentences) and recommend next steps.`;

  const result = await quizAgent.generate(prompt);
  
  // Determine recommendation
  let recommendation: 'continue' | 'review' | 'repeat';
  if (percentage >= 80) {
    recommendation = 'continue';
  } else if (percentage >= 60) {
    recommendation = 'review';
  } else {
    recommendation = 'repeat';
  }
  
  return {
    score,
    totalMarks,
    feedback: result.text,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    recommendation,
  };
}
