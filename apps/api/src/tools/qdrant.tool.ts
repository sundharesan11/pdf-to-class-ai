import { QdrantClient } from '@qdrant/js-client-rest';
import { OpenAI } from 'openai';

const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
const qdrantApiKey = process.env.QDRANT_API_KEY;

export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QdrantPoint {
  classId: number;
  chapterId: number;
  sectionId: number;
  text: string;
  contentType: 'section' | 'summary' | 'explanation';
}

export async function createCollection(collectionName: string) {
  try {
    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 1536, // OpenAI text-embedding-3-small dimension
        distance: 'Cosine',
      },
    });
    console.log(`✓ Created Qdrant collection: ${collectionName}`);
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log(`✓ Collection ${collectionName} already exists`);
    } else {
      throw error;
    }
  }
}

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

export async function insertPoints(
  collectionName: string,
  points: QdrantPoint[]
) {
  const qdrantPoints = await Promise.all(
    points.map(async (point, index) => {
      const embedding = await getEmbedding(point.text);
      return {
        id: Math.random().toString(36).substring(7) + index,
        vector: embedding,
        payload: {
          classId: point.classId,
          chapterId: point.chapterId,
          sectionId: point.sectionId,
          text: point.text,
          contentType: point.contentType,
        },
      };
    })
  );

  await qdrantClient.upsert(collectionName, {
    wait: true,
    points: qdrantPoints,
  });

  console.log(`✓ Inserted ${qdrantPoints.length} points into ${collectionName}`);
}

export async function search(
  collectionName: string,
  query: string,
  filter?: { classId?: number; sectionId?: number },
  limit: number = 5
) {
  const queryEmbedding = await getEmbedding(query);

  const searchFilter = filter
    ? {
        must: [
          ...(filter.classId
            ? [{ key: 'classId', match: { value: filter.classId } }]
            : []),
          ...(filter.sectionId
            ? [{ key: 'sectionId', match: { value: filter.sectionId } }]
            : []),
        ],
      }
    : undefined;

  const results = await qdrantClient.search(collectionName, {
    vector: queryEmbedding,
    filter: searchFilter,
    limit,
  });

  return results.map((result) => ({
    text: result.payload?.text as string,
    score: result.score,
    classId: result.payload?.classId as number,
    sectionId: result.payload?.sectionId as number,
    chapterId: result.payload?.chapterId as number,
    contentType: result.payload?.contentType as string,
  }));
}

export async function deleteCollection(collectionName: string) {
  try {
    await qdrantClient.deleteCollection(collectionName);
    console.log(`✓ Deleted collection: ${collectionName}`);
  } catch (error) {
    console.error(`Failed to delete collection: ${collectionName}`, error);
  }
}
