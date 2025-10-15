# 📚 EduAgent - AI-Powered Interactive Learning Platform

> Transform any PDF into an intelligent, interactive AI classroom experience

EduAgent is an innovative educational platform that revolutionizes traditional learning by converting PDF documents into structured, AI-guided learning experiences. It empowers teachers to create engaging lessons and provides students with personalized, conversational tutoring powered by AI.

## 🌟 Project Overview

**EduAgent** bridges the gap between traditional educational materials and modern AI-powered learning. The platform allows:
- **Teachers** to upload PDF resources and automatically generate structured courses with chapters, sections, and quizzes
- **Students** to learn through interactive AI tutoring, real-time Q&A, and adaptive assessments
- **Real-time tracking** of student progress, comprehension, and engagement analytics

## ✨ Current MVP Features

### 🎯 For Teachers
- **PDF Upload & Auto-Parsing**: Upload PDFs and let AI extract content, detect chapters, and create course structure
- **Interactive Course Builder**: Edit generated chapters, sections, and customize learning paths
- **Class Management**: Create classes with unique join codes, manage multiple courses
- **Student Analytics**: Track student progress, quiz results, and engagement metrics
- **Teacher Dashboard**: Overview of all classes, student counts, and completion rates

### 🧑‍🎓 For Students
- **Interactive AI Tutor**: Real-time conversational AI that explains concepts, answers questions, and adapts to learning pace
- **Structured Learning Path**: Navigate through chapters and sections with clear progress tracking
- **Intelligent Quizzes**: Auto-generated quizzes with hints, explanations, and instant feedback
- **Progress Tracking**: Visual progress indicators, session time tracking, and achievement system
- **Personalized Experience**: AI adapts explanations based on student interactions and comprehension

### 💬 AI Chat Features
- Real-time question answering
- Contextual explanations with examples
- Hint system for quiz questions
- Positive reinforcement and encouragement
- Quick question suggestions
- Voice input support (UI ready)

### 📊 Current Tech Stack (Frontend)

```
Frontend (MVP - Built):
├── Framework: React 18 + TypeScript
├── Build Tool: Vite
├── UI Library: shadcn-ui + Radix UI
├── Styling: Tailwind CSS
├── Routing: React Router v6
├── State Management: React Query (TanStack Query)
├── Forms: React Hook Form + Zod validation
├── Icons: Lucide React
└── Deployment: Lovable Platform

Backend (Planned):
├── API Framework: Fastify + TypeScript
├── AI Framework: Mastra (Agentic AI)
├── Database: PostgreSQL + Prisma ORM
├── Vector Database: Qdrant (for RAG)
├── Authentication: JWT + Bcrypt
├── File Storage: AWS S3 / Local
├── Real-time: WebSocket
└── Deployment: Docker + Cloud Platform
```

## 🎨 Key Pages & Flows

### Teacher Flow
1. **Landing Page** → Role selection (Teacher/Student)
2. **Auth Page** → Login/Signup
3. **Teacher Dashboard** → Overview, stats, class management
4. **Upload Resource** (5-step wizard):
   - Step 1: Upload PDF
   - Step 2: AI Parsing (with progress indicator)
   - Step 3: Edit Course Structure (chapters/sections)
   - Step 4: Add Class Details (metadata, difficulty, description)
   - Step 5: Success + Join Code generation
5. **Teacher Class View** → Detailed class analytics
6. **Analytics Dashboard** → Cross-class insights

### Student Flow
1. **Landing Page** → Role selection
2. **Auth Page** → Login/Signup
3. **Join Class** → Enter join code
4. **Student Dashboard** → Enrolled classes, progress overview
5. **Classroom (Learning Interface)**:
   - Left Sidebar: Course content navigation
   - Center: Lesson content or quiz interface
   - Right Panel: AI Tutor chat
6. **Achievements** → Gamification and progress badges
7. **Student Profile** → Personal stats and settings

## 🏗️ Planned Architecture: Monorepo with Turborepo

### Migration Plan

```
pdf-to-class-ai/
├── apps/
│   ├── web/                    # Frontend (React + Vite) - Current codebase
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                    # Backend (Fastify + Mastra)
│       ├── src/
│       │   ├── routes/         # API endpoints
│       │   ├── services/       # Business logic
│       │   ├── agents/         # Mastra AI agents
│       │   ├── workflows/      # Mastra workflows
│       │   ├── tools/          # Custom Mastra tools
│       │   ├── db/             # Database schemas & migrations
│       │   ├── middleware/     # Auth, validation, etc.
│       │   └── index.ts        # Fastify app entry
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared-types/           # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── user.types.ts
│   │   │   ├── class.types.ts
│   │   │   ├── chat.types.ts
│   │   │   └── analytics.types.ts
│   │   └── package.json
│   │
│   ├── ui-components/          # Shared React components (optional)
│   │   ├── src/
│   │   └── package.json
│   │
│   └── config/                 # Shared configuration
│       ├── eslint-config/
│       └── typescript-config/
│
├── turbo.json                  # Turborepo configuration
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # PNPM workspace config
└── README.md                   # This file
```

### Backend Architecture (Fastify + Mastra)

#### **Fastify Backend**
Fast, low-overhead Node.js framework for building APIs

```typescript
Core Features:
├── Authentication & Authorization (JWT)
├── Rate Limiting & Security
├── Request Validation (Zod schemas)
├── Database Integration (PostgreSQL/Prisma)
├── Vector Database (Qdrant for RAG)
├── File Upload & Storage (S3/Local)
└── WebSocket Support (real-time chat)
```

#### **Mastra AI Framework**
Agentic AI framework for building intelligent workflows with RAG powered by Qdrant

```typescript
Mastra Integration:
├── Agents/
│   ├── SessionOrchestratorAgent   # Main coordinator for learning sessions
│   │   ├── TutorAgent            # RAG-based teaching of sections (Qdrant)
│   │   ├── QuizAgent             # Conducts assessments
│   │   ├── ProgressAgent         # Logs & analyzes performance
│   │   └── Decision Logic:
│   │       ├── Go to next section
│   │       ├── Repeat current section
│   │       └── Review related topics
│   │
│   ├── PDFParserAgent            # Extract & structure PDF content
│   ├── ContentGeneratorAgent     # Generate quizzes, summaries
│   └── AnalyticsAgent            # Insight generation from data
│
├── Workflows/
│   ├── PDF Upload Pipeline       # Parse → Structure → Store → Vectorize
│   ├── Quiz Generation          # Content → Questions → Validation
│   ├── Learning Session Flow    # Teach → Quiz → Evaluate → Decide
│   ├── Student Interaction      # Query → Context → Response
│   └── Progress Analysis        # Data → Insights → Recommendations
│
└── Tools/
    ├── PDFTextExtractor         # Custom PDF processing
    ├── ChapterDetector          # ML-based section identification
    ├── QuizValidator            # Answer checking & scoring
    ├── ConversationMemory       # Chat context management
    └── RAGRetriever             # Retrieve relevant content (Qdrant vector search)
```

#### **Vector Database: Qdrant**
High-performance vector database for semantic search and RAG

```typescript
Qdrant Integration:
├── Collections/
│   ├── course_content          # Vectorized PDF sections & chapters
│   ├── quiz_bank              # Question embeddings for retrieval
│   └── conversation_context    # Student chat history embeddings
│
├── Features/
│   ├── Semantic Search         # Find relevant content by meaning
│   ├── Filtered Search         # Filter by class, chapter, difficulty
│   ├── Hybrid Search          # Combine vector + keyword search
│   └── Multi-vector Support   # Different embedding models
│
└── Use Cases/
    ├── TutorAgent → Retrieves relevant sections for teaching
    ├── QuizAgent → Finds similar questions for variation
    ├── ContentGenerator → Discovers related topics
    └── Analytics → Semantic clustering of student queries
```

### 🤖 AI-Driven Learning Sessions

The **SessionOrchestratorAgent** is the core intelligence that drives each learning session, providing adaptive and personalized learning experiences:

```typescript
SessionOrchestratorAgent Architecture:
┌─────────────────────────────────────────────────────┐
│         SessionOrchestratorAgent (Main)             │
│  • Manages entire learning session lifecycle        │
│  • Coordinates sub-agents for different phases      │
│  • Makes intelligent decisions on learning path     │
└─────────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
   ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐
   │ Tutor   │  │  Quiz    │  │  Progress  │  │ Decision │
   │ Agent   │  │  Agent   │  │  Agent     │  │  Engine  │
   └─────────┘  └──────────┘  └────────────┘  └──────────┘
```

#### Session Flow:

1. **TutorAgent (RAG-based Teaching with Qdrant)**
   - Retrieves relevant content from parsed PDF sections using vector search
   - Performs semantic search in Qdrant to find contextually similar content
   - Explains concepts in conversational, adaptive manner
   - Answers student questions with precise context from vector database
   - Uses RAG (Retrieval-Augmented Generation) for factual accuracy

2. **QuizAgent (Assessment)**
   - Conducts short quizzes after each section
   - Generates dynamic questions based on content
   - Provides hints and real-time feedback
   - Evaluates comprehension level

3. **ProgressAgent (Performance Tracking)**
   - Logs student responses and quiz scores
   - Analyzes comprehension patterns
   - Identifies knowledge gaps
   - Tracks time spent on each section

4. **Decision Engine (Adaptive Path)**
   Based on student performance, the orchestrator decides:
   - ✅ **Next Section**: Good comprehension → Move forward
   - 🔄 **Repeat Section**: Low score → Re-teach with different approach
   - 📚 **Review Related Topic**: Gaps identified → Prerequisite review
   - 💡 **Extra Practice**: Borderline understanding → Additional exercises

#### Orchestration Logic:

```typescript
// Pseudocode for Session Orchestration
async function conductLearningSession(student, section) {
  // Phase 1: Teaching (RAG with Qdrant)
  const relevantContent = await qdrant.search({
    collection: 'course_content',
    query: section.embedding,
    filter: { class_id: student.classId, section_id: section.id }
  });
  
  const tutorResult = await TutorAgent.teach(section, {
    ragContent: relevantContent,
    studentContext: student.context
  });
  await ProgressAgent.logInteraction(student, tutorResult);
  
  // Phase 2: Assessment
  const quizResult = await QuizAgent.conductQuiz(section);
  await ProgressAgent.logQuizScore(student, quizResult);
  
  // Phase 3: Decision
  const decision = await SessionOrchestrator.decideNext({
    score: quizResult.score,
    timeSpent: tutorResult.duration,
    previousAttempts: student.history,
    comprehensionLevel: ProgressAgent.analyze(student)
  });
  
  // Phase 4: Execute Decision
  switch(decision.action) {
    case 'NEXT_SECTION':
      return navigate(section.next);
    case 'REPEAT_SECTION':
      return retryWithStrategy(section, decision.strategy);
    case 'REVIEW_PREREQUISITE':
      return navigate(decision.prerequisiteSection);
    case 'EXTRA_PRACTICE':
      return generateExercises(section, decision.focusAreas);
  }
}
```

This intelligent orchestration ensures:
- 🎯 **Personalized Learning**: Each student gets a unique path
- 📈 **Adaptive Difficulty**: Content adjusts to student level
- 🔍 **Gap Detection**: Identifies and addresses weak areas
- 🏆 **Mastery-Based Progress**: Move forward only when ready

## 🚀 Development Roadmap

### Phase 1: Monorepo Setup (Current)
- [ ] Initialize Turborepo structure
- [ ] Migrate existing frontend to `apps/web`
- [ ] Setup shared packages architecture
- [ ] Configure build pipeline

### Phase 2: Backend Foundation
- [ ] Setup Fastify server with TypeScript
- [ ] Configure Mastra AI framework
- [ ] Database schema design (PostgreSQL + Prisma)
- [ ] Setup Qdrant vector database
- [ ] Authentication system (JWT)
- [ ] File upload service (PDF handling)

### Phase 3: AI Agents & Workflows
- [ ] PDF Parser Agent (extract text, detect structure)
- [ ] Vector embedding pipeline (PDF content → Qdrant)
- [ ] RAG setup with Qdrant for content retrieval
- [ ] Content Generator Agent (quiz creation)
- [ ] Tutor Agent with RAG (conversational AI)
- [ ] SessionOrchestrator Agent (adaptive learning)
- [ ] Chapter Detection (ML-based section splitting)
- [ ] Real-time chat integration (WebSocket)

### Phase 4: API Integration
- [ ] Replace localStorage with real API calls
- [ ] Connect PDF upload to backend
- [ ] Integrate AI tutor with Mastra
- [ ] Real-time progress sync
- [ ] Analytics data pipeline

### Phase 5: Advanced Features
- [ ] Multi-modal learning (images, videos)
- [ ] Speech-to-text for voice input
- [ ] Advanced analytics dashboard
- [ ] Collaborative learning features
- [ ] Mobile app (React Native)

## 📋 API Endpoints (Planned)

```typescript
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

Classes:
GET    /api/classes                  # List all classes
POST   /api/classes                  # Create new class
GET    /api/classes/:id              # Get class details
PUT    /api/classes/:id              # Update class
DELETE /api/classes/:id              # Delete class
POST   /api/classes/:id/join         # Join class (student)
GET    /api/classes/:id/students     # List students
GET    /api/classes/:id/analytics    # Class analytics

PDF Processing:
POST   /api/pdf/upload               # Upload PDF
POST   /api/pdf/parse                # Parse PDF with AI
GET    /api/pdf/:id/structure        # Get parsed structure
PUT    /api/pdf/:id/structure        # Update structure

Learning:
GET    /api/learning/class/:id/content    # Get all content
GET    /api/learning/section/:id          # Get section content
POST   /api/learning/quiz/submit          # Submit quiz answers
GET    /api/learning/progress             # Get student progress

AI Tutor:
POST   /api/chat/message             # Send message to AI tutor
GET    /api/chat/history/:classId    # Get chat history
WS     /api/chat/stream              # WebSocket for real-time chat

Analytics:
GET    /api/analytics/teacher/overview     # Teacher dashboard
GET    /api/analytics/student/:id          # Student analytics
GET    /api/analytics/class/:id            # Class performance
```

## 🛠️ Getting Started (Current MVP)

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pdf-to-class-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup (Coming Soon)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/eduagent

# Vector Database (Qdrant)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION=course_content

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# AI Services (Mastra)
OPENAI_API_KEY=your-openai-key
MASTRA_API_KEY=your-mastra-key
EMBEDDING_MODEL=text-embedding-3-small

# File Storage
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key

# Application
PORT=3000
NODE_ENV=development
```

## 🧪 Testing Strategy (Planned)

```
Testing Framework:
├── Frontend: Vitest + React Testing Library
├── Backend: Jest + Supertest
├── E2E: Playwright
└── AI Agents: Mastra Testing Suite
```

## 📦 Database Schema (Planned)

```sql
PostgreSQL Tables:
├── users           # User accounts (teachers, students)
├── classes         # Course/class information
├── class_members   # Student enrollments
├── chapters        # Course chapters
├── sections        # Chapter sections
├── quizzes         # Quiz definitions
├── quiz_questions  # Quiz questions
├── quiz_attempts   # Student quiz submissions
├── chat_messages   # AI tutor conversations
├── progress        # Student learning progress
└── analytics       # Aggregated metrics

Qdrant Collections:
├── course_content      # Vectorized chapter/section content
│   ├── Fields: class_id, chapter_id, section_id, content_type
│   └── Vector: 1536-dim (OpenAI embedding)
│
├── quiz_bank          # Question embeddings
│   ├── Fields: class_id, difficulty, topic
│   └── Vector: 1536-dim
│
└── conversation_context  # Chat history for semantic retrieval
    ├── Fields: student_id, session_id, timestamp
    └── Vector: 1536-dim
```

## 🤝 Contributing

This is currently in MVP/development phase. Contribution guidelines will be added soon.

## 📄 License

[To be determined]

## 🎯 Next Steps

1. **Setup Turborepo monorepo structure**
2. **Initialize Fastify backend with TypeScript**
3. **Integrate Mastra AI framework**
4. **Design database schema and setup Prisma**
5. **Build PDF parsing agent with Mastra**
6. **Create authentication system**
7. **Connect frontend to backend APIs**
8. **Deploy full-stack application**

---

**Built with** ❤️ **for the future of education**

*Current Status: MVP Frontend Complete | Backend & AI Integration In Progress*
