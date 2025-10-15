import { Agent } from '@mastra/core';
import { z } from 'zod';

export const contentGeneratorAgent = new Agent({
  name: 'ContentGeneratorAgent',
  instructions: `You are an expert educational content creator.
Your responsibilities:
1. Generate quiz questions based on section content
2. Create explanations for complex concepts
3. Design hints that guide without giving away answers
4. Ensure questions test understanding, not just memorization`,
  model: {
    provider: 'OPEN_AI',
    name: 'gpt-4-turbo-preview',
    toolChoice: 'auto',
  },
});

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
}

export async function generateQuiz(
  sectionTitle: string,
  sectionContent: string,
  numQuestions: number = 3
): Promise<QuizQuestion[]> {
  const prompt = `Based on the following educational content, generate ${numQuestions} multiple-choice quiz questions.

Section: ${sectionTitle}

Content:
${sectionContent}

Requirements:
- Test deep understanding, not just recall
- Provide 4 options per question (A, B, C, D)
- Include clear explanations for the correct answer
- Vary difficulty levels

Return a JSON array of questions in this format:
[{
  "questionText": "...",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctAnswer": "A",
  "explanation": "...",
  "marks": 10
}]`;

  const result = await contentGeneratorAgent.generate(prompt);
  
  try {
    // Extract JSON from the response
    const jsonMatch = result.text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    }
  } catch (error) {
    console.error('Failed to parse quiz questions:', error);
  }
  
  // Return default questions if parsing fails
  return [{
    questionText: `What is the main concept covered in "${sectionTitle}"?`,
    options: ['A) Placeholder', 'B) Placeholder', 'C) Placeholder', 'D) Placeholder'],
    correctAnswer: 'A',
    explanation: 'This is a placeholder explanation.',
    marks: 10,
  }];
}

export async function generateSummary(content: string): Promise<string> {
  const prompt = `Summarize the following educational content in 2-3 concise sentences, highlighting the key learning objectives:

${content}`;

  const result = await contentGeneratorAgent.generate(prompt);
  return result.text;
}
