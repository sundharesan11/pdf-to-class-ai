import { Agent } from '@mastra/core';
import { retrieveContext, formatContextForPrompt } from '../tools/ragRetriever.tool.js';

export const tutorAgent = new Agent({
  name: 'TutorAgent',
  instructions: `You are a friendly, knowledgeable AI tutor helping students learn.

Your teaching style:
- Break down complex concepts into simple explanations
- Use analogies and examples
- Encourage questions and curiosity
- Provide positive reinforcement
- Adapt to the student's pace
- Use the provided context to give accurate, relevant answers

Remember:
- Be patient and supportive
- Never sound condescending
- Celebrate progress
- Offer hints before giving direct answers`,
  model: {
    provider: 'OPEN_AI',
    name: 'gpt-4-turbo-preview',
    toolChoice: 'auto',
  },
});

export async function teachSection(
  classId: number,
  sectionId: number,
  sectionTitle: string,
  sectionContent: string
): Promise<string> {
  const prompt = `Introduce and teach the following section to a student:

Section: ${sectionTitle}

Content:
${sectionContent}

Explain the key concepts in a friendly, engaging way. Use examples where helpful.`;

  const result = await tutorAgent.generate(prompt);
  return result.text;
}

export async function answerQuestion(
  classId: number,
  sectionId: number,
  studentQuestion: string,
  chatHistory: { role: string; content: string }[] = []
): Promise<string> {
  // Retrieve relevant context from Qdrant
  const contexts = await retrieveContext(classId, studentQuestion, sectionId, 3);
  const contextStr = formatContextForPrompt(contexts);
  
  const conversationHistory = chatHistory
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join('\n');
  
  const prompt = `You are tutoring a student. Answer their question using the provided context.

Context from course materials:
${contextStr}

Conversation history:
${conversationHistory}

Student's question: ${studentQuestion}

Provide a helpful, friendly answer that guides the student to understanding.`;

  const result = await tutorAgent.generate(prompt);
  return result.text;
}
