import { search } from './qdrant.tool.js';

export interface RAGContext {
  text: string;
  score: number;
  sectionId: number;
  chapterId: number;
}

export async function retrieveContext(
  classId: number,
  query: string,
  sectionId?: number,
  topK: number = 5
): Promise<RAGContext[]> {
  const collectionName = `class_${classId}`;
  
  try {
    const results = await search(
      collectionName,
      query,
      {
        classId,
        ...(sectionId && { sectionId }),
      },
      topK
    );
    
    return results.map((result) => ({
      text: result.text,
      score: result.score || 0,
      sectionId: result.sectionId,
      chapterId: result.chapterId,
    }));
  } catch (error) {
    console.error('Failed to retrieve context from Qdrant:', error);
    return [];
  }
}

export function formatContextForPrompt(contexts: RAGContext[]): string {
  if (contexts.length === 0) {
    return 'No relevant context found.';
  }
  
  return contexts
    .map((ctx, index) => 
      `[Context ${index + 1}] (relevance: ${(ctx.score * 100).toFixed(1)}%)\n${ctx.text}`
    )
    .join('\n\n---\n\n');
}
