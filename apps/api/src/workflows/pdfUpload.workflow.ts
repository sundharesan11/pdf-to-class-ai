import { Workflow } from '@mastra/core';
import { db, classes, chapters, sections, quizzes, quizQuestions } from '../db/index.js';
import { parseAndStructurePDF } from '../agents/pdfParser.agent.js';
import { generateQuiz, generateSummary } from '../agents/contentGenerator.agent.js';
import { createCollection, insertPoints, QdrantPoint } from '../tools/qdrant.tool.js';
import { nanoid } from 'nanoid';

export interface PDFUploadInput {
  filePath: string;
  title: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  teacherId: number;
}

export interface PDFUploadOutput {
  classId: number;
  joinCode: string;
  chaptersCount: number;
  sectionsCount: number;
}

export async function pdfUploadWorkflow(input: PDFUploadInput): Promise<PDFUploadOutput> {
  console.log('📄 Starting PDF upload workflow...');
  
  // Step 1: Parse PDF and extract structure
  console.log('🔍 Parsing PDF...');
  const structured = await parseAndStructurePDF(input.filePath, input.title);
  
  // Step 2: Create class
  console.log('📚 Creating class...');
  const joinCode = nanoid(8).toUpperCase();
  const [newClass] = await db.insert(classes).values({
    title: input.title,
    description: input.description,
    joinCode,
    difficulty: input.difficulty,
    createdBy: input.teacherId,
    pdfUrl: input.filePath,
    status: 'published',
  }).returning();
  
  console.log(`✓ Created class: ${newClass.title} (ID: ${newClass.id}, Join Code: ${joinCode})`);
  
  // Step 3: Create Qdrant collection
  const collectionName = `class_${newClass.id}`;
  await createCollection(collectionName);
  
  const qdrantPoints: QdrantPoint[] = [];
  let totalSections = 0;
  
  // Step 4: Create chapters, sections, and quizzes
  for (let chapterIdx = 0; chapterIdx < structured.chapters.length; chapterIdx++) {
    const chapterData = structured.chapters[chapterIdx];
    
    console.log(`📖 Creating chapter ${chapterIdx + 1}: ${chapterData.title}`);
    
    // Generate summary if not provided
    const summary = chapterData.summary || 
      await generateSummary(chapterData.sections.map(s => s.content).join('\n\n'));
    
    const [chapter] = await db.insert(chapters).values({
      classId: newClass.id,
      title: chapterData.title,
      orderIndex: chapterIdx,
      summary,
    }).returning();
    
    // Add chapter summary to Qdrant
    qdrantPoints.push({
      classId: newClass.id,
      chapterId: chapter.id,
      sectionId: 0, // Chapter-level content
      text: `Chapter: ${chapter.title}\n\nSummary: ${summary}`,
      contentType: 'summary',
    });
    
    // Create sections
    for (let sectionIdx = 0; sectionIdx < chapterData.sections.length; sectionIdx++) {
      const sectionData = chapterData.sections[sectionIdx];
      
      console.log(`  📝 Creating section ${sectionIdx + 1}: ${sectionData.title}`);
      
      const [section] = await db.insert(sections).values({
        chapterId: chapter.id,
        title: sectionData.title,
        content: sectionData.content,
        orderIndex: sectionIdx,
      }).returning();
      
      totalSections++;
      
      // Add section content to Qdrant
      qdrantPoints.push({
        classId: newClass.id,
        chapterId: chapter.id,
        sectionId: section.id,
        text: `Section: ${section.title}\n\n${section.content}`,
        contentType: 'section',
      });
      
      // Generate quiz for this section
      console.log(`  ❓ Generating quiz for section: ${sectionData.title}`);
      const quizQuestionsList = await generateQuiz(
        sectionData.title,
        sectionData.content,
        3 // 3 questions per section
      );
      
      if (quizQuestionsList.length > 0) {
        const [quiz] = await db.insert(quizzes).values({
          sectionId: section.id,
          title: `Quiz: ${sectionData.title}`,
          totalMarks: quizQuestionsList.reduce((sum, q) => sum + q.marks, 0),
        }).returning();
        
        // Insert quiz questions
        for (const q of quizQuestionsList) {
          await db.insert(quizQuestions).values({
            quizId: quiz.id,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            marks: q.marks,
          });
        }
        
        console.log(`  ✓ Created quiz with ${quizQuestionsList.length} questions`);
      }
    }
  }
  
  // Step 5: Insert all points into Qdrant
  console.log(`🗄️  Inserting ${qdrantPoints.length} embeddings into Qdrant...`);
  if (qdrantPoints.length > 0) {
    await insertPoints(collectionName, qdrantPoints);
  }
  
  console.log(`✅ PDF upload workflow complete!`);
  console.log(`   Class ID: ${newClass.id}`);
  console.log(`   Join Code: ${joinCode}`);
  console.log(`   Chapters: ${structured.chapters.length}`);
  console.log(`   Sections: ${totalSections}`);
  
  return {
    classId: newClass.id,
    joinCode,
    chaptersCount: structured.chapters.length,
    sectionsCount: totalSections,
  };
}
