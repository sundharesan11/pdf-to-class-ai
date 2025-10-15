# @eduagent/api

Backend API for EduAgent platform built with Fastify, Mastra, Drizzle, and Qdrant.

## Tech Stack

- **Framework**: Fastify + TypeScript
- **AI Framework**: Mastra
- **Database**: PostgreSQL + Drizzle ORM
- **Vector DB**: Qdrant
- **Auth**: JWT + Bcrypt
- **File Upload**: Multipart

## Prerequisites

1. **Node.js 18+** and **pnpm**
2. **PostgreSQL** database running
3. **Qdrant** vector database (local or cloud)
4. **OpenAI API Key**

## Setup

### 1. Install Dependencies

```bash
# From monorepo root
pnpm install

# Or from this directory
pnpm install
```

### 2. Setup PostgreSQL

```bash
# Create database
createdb eduagent

# Or using psql
psql -U postgres
CREATE DATABASE eduagent;
```

### 3. Setup Qdrant

**Option A: Docker (Recommended)**
```bash
docker run -p 6333:6333 qdrant/qdrant
```

**Option B: Cloud**
Sign up at https://qdrant.tech and get your cluster URL and API key.

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `QDRANT_URL` - Qdrant server URL
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Secret for JWT signing

### 5. Run Database Migrations

```bash
pnpm db:push
```

## Development

```bash
# Run dev server with hot reload
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# View database in Drizzle Studio
pnpm db:studio
```

The API will be available at http://localhost:3000

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### PDF Upload & Processing

```
POST /api/pdf/upload
```

Upload a PDF file with metadata:
- `file`: PDF file (multipart)
- `title`: Class title
- `description`: Class description
- `difficulty`: beginner | intermediate | advanced

### Classes

```
GET  /api/classes
GET  /api/classes/:id
POST /api/classes/join
GET  /api/classes/:id/students
```

### Learning Sessions

```
POST /api/sessions/start
POST /api/sessions/:id/continue
GET  /api/sessions/:id
POST /api/sessions/:id/pause
```

### AI Chat

```
POST /api/chat/message
GET  /api/chat/history/:classId
```

## Architecture

### Agents (Mastra)

- **PDFParserAgent**: Parses PDFs and extracts structure
- **ContentGeneratorAgent**: Generates quizzes and summaries
- **TutorAgent**: Conversational AI tutor (RAG-based)
- **QuizAgent**: Evaluates quiz attempts
- **ProgressAgent**: Tracks student progress
- **OrchestratorAgent**: Manages learning flow decisions

### Workflows

- **pdfUploadWorkflow**: Parse → Structure → Store → Embed → Generate Quizzes
- **sessionFlowWorkflow**: Teach → Quiz → Evaluate → Decide → Progress

### Database Schema

Tables:
- users, classes, class_members
- chapters, sections
- quizzes, quiz_questions, quiz_attempts
- chat_messages, progress, analytics
- sessions, session_steps, session_memory

### Vector Storage (Qdrant)

Collections:
- `class_{id}`: Embedded course content per class
- Stores: chapter summaries, section content, explanations
- Used for: RAG-based tutoring, semantic search

## Testing the API

### 1. Register a Teacher

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Teacher",
    "email": "teacher@example.com",
    "password": "password123",
    "role": "teacher"
  }'
```

### 2. Upload a PDF

```bash
curl -X POST http://localhost:3000/api/pdf/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@sample.pdf" \
  -F "title=Introduction to Biology" \
  -F "difficulty=beginner"
```

### 3. Register a Student

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Student",
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### 4. Join Class

```bash
curl -X POST http://localhost:3000/api/classes/join \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"joinCode": "ABCD1234"}'
```

### 5. Start Learning Session

```bash
curl -X POST http://localhost:3000/api/sessions/start \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"classId": 1}'
```

### 6. Get Teaching Content

```bash
curl -X POST http://localhost:3000/api/sessions/1/continue \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "teach"}'
```

### 7. Chat with AI Tutor

```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "classId": 1,
    "sectionId": 1,
    "message": "Can you explain photosynthesis?"
  }'
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL
```

### Qdrant Connection Issues

```bash
# Check if Qdrant is running
curl http://localhost:6333/collections
```

### OpenAI API Issues

Ensure your API key has sufficient credits and proper permissions.

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:generate  # Generate migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| QDRANT_URL | Qdrant server URL | http://localhost:6333 |
| QDRANT_API_KEY | Qdrant API key (optional) | - |
| OPENAI_API_KEY | OpenAI API key | - |
| JWT_SECRET | Secret for JWT signing | - |
| PORT | Server port | 3000 |
| HOST | Server host | 0.0.0.0 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:8080 |

## Production Deployment

1. Set all environment variables
2. Build the application: `pnpm build`
3. Run migrations: `pnpm db:push`
4. Start server: `pnpm start`

Consider using:
- Docker for containerization
- PM2 for process management
- Nginx for reverse proxy

---

**Built with** ❤️ **by the EduAgent team**
