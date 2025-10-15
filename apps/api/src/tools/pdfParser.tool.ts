import pdfParse from 'pdf-parse';
import fs from 'fs/promises';

export interface ParsedPDF {
  text: string;
  numPages: number;
  metadata?: any;
}

export interface DetectedChapter {
  title: string;
  startIndex: number;
  endIndex: number;
  content: string;
  sections: DetectedSection[];
}

export interface DetectedSection {
  title: string;
  content: string;
  estimatedDuration: number; // in minutes
}

export async function parsePDF(filePath: string): Promise<ParsedPDF> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  
  return {
    text: data.text,
    numPages: data.numpages,
    metadata: data.metadata,
  };
}

export function detectChapters(text: string): DetectedChapter[] {
  // Simple heuristic-based chapter detection
  // Look for patterns like "Chapter 1", "Chapter I", numbered sections
  const chapterRegex = /(?:Chapter|CHAPTER|Section|SECTION)\s+(\d+|[IVX]+)[:\s]+([^\n]+)/g;
  const matches = Array.from(text.matchAll(chapterRegex));
  
  if (matches.length === 0) {
    // If no chapters detected, treat entire document as one chapter
    return [{
      title: 'Main Content',
      startIndex: 0,
      endIndex: text.length,
      content: text,
      sections: detectSections(text),
    }];
  }
  
  const chapters: DetectedChapter[] = [];
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const nextMatch = matches[i + 1];
    
    const startIndex = match.index || 0;
    const endIndex = nextMatch?.index || text.length;
    const content = text.slice(startIndex, endIndex);
    
    chapters.push({
      title: match[2].trim(),
      startIndex,
      endIndex,
      content,
      sections: detectSections(content),
    });
  }
  
  return chapters;
}

export function detectSections(chapterText: string): DetectedSection[] {
  // Split by major headings (lines that are short and followed by content)
  const lines = chapterText.split('\n');
  const sections: DetectedSection[] = [];
  let currentSection: { title: string; content: string[] } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Heuristic: section titles are short (< 100 chars), not empty, and might be followed by content
    if (line.length > 0 && line.length < 100 && !line.endsWith('.')) {
      // Check if next line has content
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && nextLine.length > 50) {
        // Start new section
        if (currentSection) {
          sections.push({
            title: currentSection.title,
            content: currentSection.content.join('\n').trim(),
            estimatedDuration: estimateDuration(currentSection.content.join(' ')),
          });
        }
        currentSection = { title: line, content: [] };
        continue;
      }
    }
    
    if (currentSection && line.length > 0) {
      currentSection.content.push(line);
    }
  }
  
  // Add last section
  if (currentSection && currentSection.content.length > 0) {
    sections.push({
      title: currentSection.title,
      content: currentSection.content.join('\n').trim(),
      estimatedDuration: estimateDuration(currentSection.content.join(' ')),
    });
  }
  
  // If no sections detected, create one default section
  if (sections.length === 0) {
    sections.push({
      title: 'Overview',
      content: chapterText,
      estimatedDuration: estimateDuration(chapterText),
    });
  }
  
  return sections;
}

function estimateDuration(text: string): number {
  // Estimate reading time: ~200 words per minute
  const wordCount = text.split(/\s+/).length;
  return Math.max(5, Math.ceil(wordCount / 200));
}

export function extractKeyPoints(text: string, count: number = 5): string[] {
  // Simple extraction: look for sentences that might be key points
  // - Sentences with words like "important", "key", "essential", "fundamental"
  // - Sentences that are definitions
  // - First sentence of each paragraph
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const keyPoints: string[] = [];
  
  const keywords = ['important', 'key', 'essential', 'fundamental', 'note that', 'remember'];
  
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    if (keywords.some(keyword => lower.includes(keyword))) {
      keyPoints.push(sentence.trim());
      if (keyPoints.length >= count) break;
    }
  }
  
  // If not enough key points, add first sentences
  if (keyPoints.length < count) {
    const paragraphs = text.split('\n\n');
    for (const para of paragraphs) {
      const firstSentence = para.split(/[.!?]/)[0];
      if (firstSentence && firstSentence.length > 30 && !keyPoints.includes(firstSentence.trim())) {
        keyPoints.push(firstSentence.trim());
        if (keyPoints.length >= count) break;
      }
    }
  }
  
  return keyPoints.slice(0, count);
}
