# 🚀 EduAgent Backend Setup Guide

Complete guide to set up and run the EduAgent backend API.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **pnpm** - Install with `npm install -g pnpm`
3. **PostgreSQL** - [Download](https://www.postgresql.org/download/)
4. **Qdrant** - See setup options below
5. **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

## 🔧 Setup Steps

### Step 1: Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### Step 2: Setup PostgreSQL Database

#### Option A: Using createdb (macOS/Linux)

```bash
createdb eduagent
```

#### Option B: Using psql

```bash
psql -U postgres
```

Then in psql:

```sql
CREATE DATABASE eduagent;
\q
```

#### Option C: Using GUI Tool

Use pgAdmin, DBeaver, or TablePlus to create a database named `eduagent`.

### Step 3: Setup Qdrant Vector Database

#### Option A: Docker (Recommended)

```bash
docker run -d -p 6333:6333 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

#### Option B: Qdrant Cloud

1. Sign up at https://qdrant.tech/cloud/
2. Create a cluster
3. Get your cluster URL and API key

### Step 4: Configure Environment Variables

```bash
cd apps/api
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eduagent

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=  # Leave empty for local Docker

# OpenAI
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Auth
JWT_SECRET=your-very-secret-key-change-this-in-production

# Server
PORT=3000
HOST=0.0.0.0

# Frontend (for CORS)
FRONTEND_URL=http://localhost:8080
```

### Step 5: Push Database Schema

```bash
cd apps/api
pnpm db:push
```

This will create all tables in your PostgreSQL database.

### Step 6: Verify Setup

```bash
# Check PostgreSQL connection
psql $DATABASE_URL -c "SELECT version();"

# Check Qdrant connection
curl http://localhost:6333/collections
```

## 🎯 Running the Backend

### Development Mode

```bash
# From monorepo root
pnpm dev

# Or from apps/api
cd apps/api
pnpm dev
```

The API will start at `http://localhost:3000`

### Production Mode

```bash
# Build
pnpm build

# Start
pnpm start
```

## ✅ Testing the Backend

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-10-16T..."}
```

### 2. Register a Teacher

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Teacher",
    "email": "teacher@test.com",
    "password": "password123",
    "role": "teacher"
  }'
```

Save the returned `token` for next steps.

### 3. Upload a Sample PDF

First, create a simple PDF or download a sample. Then:

```bash
curl -X POST http://localhost:3000/api/pdf/upload \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -F "file=@path/to/your/file.pdf" \
  -F "title=Test Course" \
  -F "difficulty=beginner" \
  -F "description=A test course"
```

Note the returned `joinCode` and `classId`.

### 4. Register a Student

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "student@test.com",
    "password": "password123",
    "role": "student"
  }'
```

### 5. Join the Class

```bash
curl -X POST http://localhost:3000/api/classes/join \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"joinCode": "THE_JOIN_CODE_FROM_STEP_3"}'
```

### 6. Start a Learning Session

```bash
curl -X POST http://localhost:3000/api/sessions/start \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"classId": 1}'
```

Note the returned `sessionId`.

### 7. Get Teaching Content

```bash
curl -X POST http://localhost:3000/api/sessions/SESSION_ID/continue \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "teach"}'
```

### 8. Chat with AI Tutor

```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "classId": 1,
    "sectionId": 1,
    "message": "Can you explain this concept?"
  }'
```

## 🗄️ Database Management

### View Database in Drizzle Studio

```bash
cd apps/api
pnpm db:studio
```

Opens a web UI at `https://local.drizzle.studio`

### Generate Migrations

```bash
pnpm db:generate
```

### Apply Migrations

```bash
pnpm db:migrate
```

### Reset Database

```bash
# Drop and recreate
dropdb eduagent
createdb eduagent
pnpm db:push
```

## 🔍 Troubleshooting

### Issue: "ECONNREFUSED" for PostgreSQL

**Solution:**
- Check if PostgreSQL is running: `pg_isready`
- Verify your DATABASE_URL in `.env`
- Try connecting manually: `psql $DATABASE_URL`

### Issue: Qdrant connection failed

**Solution:**
- If using Docker: `docker ps` to verify container is running
- Try: `curl http://localhost:6333/collections`
- Check QDRANT_URL in `.env`

### Issue: OpenAI API errors

**Solution:**
- Verify your API key is correct
- Check you have sufficient credits
- Test with: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

### Issue: PDF parsing fails

**Solution:**
- Ensure PDF is not encrypted
- Check file size (< 20MB)
- Verify file is actually a PDF

### Issue: "EADDRINUSE" port already in use

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 pnpm dev
```

## 📚 Understanding the Flow

### Teacher Flow

1. **Register** → Get token
2. **Upload PDF** → PDF is parsed, chapters/sections extracted
3. **Embeddings created** → Content stored in Qdrant
4. **Quizzes generated** → AI creates questions per section
5. **Class published** → Join code generated
6. **Share join code** → With students

### Student Flow

1. **Register** → Get token
2. **Join class** → Using join code
3. **Start session** → Begin learning journey
4. **Teach** → AI tutor explains section
5. **Quiz** → Test understanding
6. **Progress** → Track performance
7. **Decision** → AI decides next step (continue/review/repeat)
8. **Chat** → Ask questions anytime (RAG-powered)

### AI Orchestration

```
SessionOrchestratorAgent
├── TutorAgent (RAG from Qdrant)
│   └── Retrieves relevant context
│   └── Explains concepts conversationally
├── QuizAgent
│   └── Evaluates answers
│   └── Provides feedback
├── ProgressAgent
│   └── Logs performance
│   └── Tracks mastery
└── Decision Engine
    ├── Score >= 80% → Next section
    ├── Score 60-79% → Review concepts
    └── Score < 60% → Repeat section
```

## 🎓 Next Steps

1. **Test the complete flow** end-to-end
2. **Integrate with frontend** (already in `apps/web`)
3. **Add more sample PDFs** for testing
4. **Customize agents** in `apps/api/src/agents/`
5. **Monitor logs** for debugging
6. **Scale Qdrant** for production use

## 📖 Additional Resources

- [Fastify Documentation](https://fastify.dev/)
- [Drizzle ORM Guide](https://orm.drizzle.team/)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Mastra Framework](https://mastra.ai/)
- [OpenAI API Reference](https://platform.openai.com/docs/)

---

**Need help?** Check the logs in terminal or file an issue in the repository.
