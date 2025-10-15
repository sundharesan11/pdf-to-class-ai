import { Agent } from '@mastra/core';
import { z } from 'zod';
import { parsePDF, detectChapters } from '../tools/pdfParser.tool.js';

export const pdfParserAgent = new Agent({
  name: 'PDFParserAgent',
  instructions: `You are an expert at analyzing educational PDFs and extracting structured content.
Your job is to:
1. Parse PDF content and identify chapters/sections
2. Extract key concepts from each section
3. Determine appropriate learning difficulty
4. Suggest optimal section durations based on content complexity`,
  model: {
    provider: 'OPEN_AI',
    name: 'gpt-4-turbo-preview',
    toolChoice: 'auto',
  },
});

export interface ParsedCourseStructure {
  title: string;
  chapters: {
    title: string;
    summary: string;
    sections: {
      title: string;
      content: string;
      duration: number;
      keyPoints: string[];
    }[];
  }[];
}

export async function parseAndStructurePDF(
  filePath: string,
  courseTitle?: string
): Promise<ParsedCourseStructure> {
  // Parse the PDF
  const parsed = await parsePDF(filePath);
  
  // Detect chapters and sections
  const chapters = detectChapters(parsed.text);
  
  // Use AI to enhance the structure
  const prompt = `Analyze this educational content and provide:
1. A concise summary for each chapter
2. Key learning points for each section
3. Improved titles if needed

Content:
${JSON.stringify(chapters, null, 2)}

Return a JSON object with enhanced chapter and section information.`;

  const result = await pdfParserAgent.generate(prompt);
  
  // Process the result
  const structured: ParsedCourseStructure = {
    title: courseTitle || 'Untitled Course',
    chapters: chapters.map((chapter, idx) => ({
      title: chapter.title,
      summary: `Summary for ${chapter.title}`, // Will be enhanced by AI
      sections: chapter.sections.map((section) => ({
        title: section.title,
        content: section.content,
        duration: section.estimatedDuration,
        keyPoints: [],
      })),
    })),
  };
  
  return structured;
}
