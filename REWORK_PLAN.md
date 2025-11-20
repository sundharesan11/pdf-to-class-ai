# EduAgent Rework Plan: Python Backend + OpenAI Agents SDK

## 📋 Overview
Migrate from TypeScript/Mastra-based backend to a Python-based backend using **OpenAI Agents SDK**. Keep the existing React frontend unchanged.

---

## 🏗️ Project Structure (New)

```
pdf-to-class-ai/
├── apps/
│   ├── web/                          # React frontend (UNCHANGED)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                          # Python backend (NEW)
│       ├── src/
│       │   ├── agents/               # OpenAI agents definitions
│       │   │   ├── tutor_agent.py
│       │   │   ├── quiz_agent.py
│       │   │   ├── pdf_parser_agent.py
│       │   │   ├── content_generator_agent.py
│       │   │   └── orchestrator_agent.py
│       │   │
│       │   ├── api/                  # FastAPI routes
│       │   │   ├── __init__.py
│       │   │   ├── auth.py
│       │   │   ├── classes.py
│       │   │   ├── pdf.py
│       │   │   ├── chat.py
│       │   │   ├── learning.py
│       │   │   └── analytics.py
│       │   │
│       │   ├── services/             # Business logic
│       │   │   ├── __init__.py
│       │   │   ├── user_service.py
│       │   │   ├── class_service.py
│       │   │   ├── pdf_service.py
│       │   │   ├── chat_service.py
│       │   │   ├── progress_service.py
│       │   │   └── qdrant_service.py
│       │   │
│       │   ├── models/               # Database models & schemas
│       │   │   ├── __init__.py
│       │   │   ├── user.py
│       │   │   ├── class_model.py
│       │   │   ├── section.py
│       │   │   ├── quiz.py
│       │   │   ├── progress.py
│       │   │   └── chat.py
│       │   │
│       │   ├── db/                   # Database setup
│       │   │   ├── __init__.py
│       │   │   ├── database.py
│       │   │   └── migrations/
│       │   │
│       │   ├── utils/                # Utility functions
│       │   │   ├── __init__.py
│       │   │   ├── auth_utils.py
│       │   │   ├── validators.py
│       │   │   ├── embeddings.py
│       │   │   └── pdf_utils.py
│       │   │
│       │   ├── config.py             # Configuration management
│       │   ├── main.py               # FastAPI app entry
│       │   └── middleware.py         # Custom middleware
│       │
│       ├── tests/
│       │   ├── __init__.py
│       │   ├── test_agents.py
│       │   ├── test_api.py
│       │   └── test_services.py
│       │
│       ├── .env.example
│       ├── .env
│       ├── requirements.txt
│       ├── pyproject.toml
│       ├── setup.py
│       ├── Dockerfile
│       └── README.md
│
├── packages/
│   ├── shared-types/                 # Python types (Pydantic models)
│   │   ├── src/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── class_types.py
│   │   │   ├── chat_types.py
│   │   │   └── analytics_types.py
│   │   └── pyproject.toml
│   │
│   └── config/                       # Shared config
│       ├── .env.example
│       └── docker-compose.yml
│
├── docker-compose.yml                # Services orchestration
├── turbo.json                        # Turborepo config (minimal)
├── package.json                      # Root package (minimal, mostly frontend)
└── README.md
```

---

## 🔄 Tech Stack Changes

### Frontend (UNCHANGED)
```
✅ React 18 + TypeScript
✅ Vite
✅ shadcn-ui + Radix UI
✅ Tailwind CSS
✅ React Router v6
✅ React Query
✅ React Hook Form + Zod
```

### Backend (CHANGED)
```
❌ Fastify + TypeScript
❌ Mastra AI Framework
✅ FastAPI (Python web framework)
✅ OpenAI Agents SDK (latest)
✅ PostgreSQL + SQLAlchemy ORM
✅ Qdrant Vector Database
✅ PyJWT for authentication
✅ Python 3.11+
```

---

## 🎯 Phase Breakdown

### Phase 1: Setup & Infrastructure
**Duration: 1-2 days**

#### 1.1 Remove old TypeScript backend
```bash
rm -rf apps/api/src apps/api/dist apps/api/tsconfig.json
rm -rf apps/api/.env apps/api/drizzle.config.ts
```

#### 1.2 Create Python project structure
```bash
cd apps/api
# Initialize Python virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Create directory structure
mkdir -p src/{agents,api,services,models,db,utils}
mkdir -p tests
touch src/__init__.py src/main.py src/config.py
touch src/middleware.py
```

#### 1.3 Create requirements.txt
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pyjwt==2.8.1
openai==1.3.0
qdrant-client==2.7.0
python-multipart==0.0.6
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
PyPDF2==3.0.1
python-dotenv==1.0.0
alembic==1.12.1
```

#### 1.4 Setup environment files
- Create `.env.example` with all required variables
- Create `.env` with development values

#### 1.5 Docker setup
- Create `Dockerfile` for Python API
- Update `docker-compose.yml` with PostgreSQL, Qdrant, and API services

---

### Phase 2: Core Backend Infrastructure
**Duration: 2-3 days**

#### 2.1 FastAPI Application Setup
```python
# src/main.py
- Initialize FastAPI app
- Setup CORS middleware
- Setup error handling
- Setup logging
- Include API routers
```

#### 2.2 Database Layer
```python
# src/db/database.py
- SQLAlchemy engine/session factory
- Base model class
- Database initialization

# src/models/
- User, Class, Section, Quiz models
- Chat, Progress, Analytics models
```

#### 2.3 Configuration Management
```python
# src/config.py
- Environment variables
- Database URL
- OpenAI API settings
- Qdrant settings
- JWT secret
- CORS origins
```

#### 2.4 Authentication System
```python
# src/utils/auth_utils.py
- JWT token creation
- Token validation
- Password hashing
- User verification

# src/api/auth.py
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
```

#### 2.5 Middleware & Utils
```python
# src/middleware.py
- Authentication middleware
- Error handling
- Request logging

# src/utils/
- Validators
- PDF utilities
- Embedding utilities
```

---

### Phase 3: OpenAI Agents Implementation
**Duration: 3-4 days**

#### 3.1 Agent Architecture Setup
```python
# src/agents/base_agent.py
- Base agent class
- Common utilities
- Qdrant integration
- Tool definitions
```

#### 3.2 PDF Parser Agent
```python
# src/agents/pdf_parser_agent.py
Purpose: Extract & structure PDF content
Features:
  - Extract text from PDF
  - Detect chapters automatically
  - Parse sections with metadata
  - Return structured JSON
Tools:
  - extract_text_from_pdf
  - detect_chapters
  - validate_structure
```

#### 3.3 Content Generator Agent
```python
# src/agents/content_generator_agent.py
Purpose: Generate quizzes and summaries
Features:
  - Generate quiz questions from content
  - Create explanations
  - Validate question quality
Tools:
  - generate_questions
  - validate_questions
  - create_explanation
```

#### 3.4 Tutor Agent (RAG-enabled)
```python
# src/agents/tutor_agent.py
Purpose: RAG-based teaching with Qdrant
Features:
  - Semantic search in Qdrant
  - Generate contextual explanations
  - Answer student questions with sources
  - Adapt to student level
Tools:
  - search_qdrant_content
  - generate_explanation
  - retrieve_examples
  - answer_question_with_rag
```

#### 3.5 Quiz Agent
```python
# src/agents/quiz_agent.py
Purpose: Conduct assessments
Features:
  - Conduct quizzes
  - Provide hints
  - Evaluate answers
  - Calculate scores
Tools:
  - conduct_quiz
  - provide_hint
  - evaluate_answer
  - calculate_score
```

#### 3.6 Session Orchestrator Agent
```python
# src/agents/orchestrator_agent.py
Purpose: Manage adaptive learning sessions
Features:
  - Coordinate all sub-agents
  - Make learning path decisions
  - Track session state
  - Adapt based on performance
Methods:
  - start_session()
  - conduct_teaching_phase()
  - conduct_assessment_phase()
  - make_decision_on_next_action()
  - end_session()
```

---

### Phase 4: API Endpoints
**Duration: 2-3 days**

#### 4.1 Authentication Routes
```python
# src/api/auth.py
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

#### 4.2 Class Management Routes
```python
# src/api/classes.py
GET    /api/classes
POST   /api/classes
GET    /api/classes/{id}
PUT    /api/classes/{id}
DELETE /api/classes/{id}
POST   /api/classes/{id}/join
GET    /api/classes/{id}/students
GET    /api/classes/{id}/analytics
```

#### 4.3 PDF Processing Routes
```python
# src/api/pdf.py
POST   /api/pdf/upload
GET    /api/pdf/{id}/structure
PUT    /api/pdf/{id}/structure
POST   /api/pdf/{id}/generate-quiz
```

#### 4.4 Chat & Learning Routes
```python
# src/api/chat.py
POST   /api/chat/message
GET    /api/chat/history/{classId}

# src/api/learning.py
GET    /api/learning/class/{id}/content
GET    /api/learning/section/{id}
POST   /api/learning/quiz/submit
GET    /api/learning/progress
```

#### 4.5 Analytics Routes
```python
# src/api/analytics.py
GET    /api/analytics/teacher/overview
GET    /api/analytics/student/{id}
GET    /api/analytics/class/{id}
```

---

### Phase 5: Service Layer Implementation
**Duration: 2-3 days**

#### 5.1 Service Classes
```python
# src/services/user_service.py
- User CRUD operations
- User authentication logic

# src/services/class_service.py
- Class management
- Student enrollment
- Class analytics

# src/services/pdf_service.py
- PDF upload handling
- Call PDF parser agent
- Store parsed content
- Generate embeddings

# src/services/chat_service.py
- Store chat messages
- Call tutor agent for responses
- Maintain conversation context

# src/services/progress_service.py
- Track student progress
- Log quiz attempts
- Calculate metrics

# src/services/qdrant_service.py
- Vector embedding creation
- Qdrant collection management
- Semantic search operations
```

---

### Phase 6: Vector Database Integration
**Duration: 1-2 days**

#### 6.1 Qdrant Setup
```python
# src/services/qdrant_service.py
Collections:
  - course_content      # Vectorized sections
  - quiz_bank           # Question embeddings
  - conversation_context # Chat history embeddings

Features:
  - Create embeddings via OpenAI
  - Store vectors in Qdrant
  - Perform semantic search
  - Filter by metadata (class_id, chapter_id, etc.)
```

---

### Phase 7: Integration & Testing
**Duration: 2-3 days**

#### 7.1 API Testing
```python
# tests/test_api.py
- Test authentication endpoints
- Test class CRUD operations
- Test PDF upload flow
- Test chat endpoints
- Test learning endpoints
```

#### 7.2 Agent Testing
```python
# tests/test_agents.py
- Test PDF parser agent
- Test quiz generator agent
- Test tutor agent
- Test orchestrator logic
```

#### 7.3 Integration Testing
```python
# End-to-end flows
- PDF upload → Parsing → Vectorization
- Student learning session
- Chat interaction with RAG
- Quiz taking flow
```

---

### Phase 8: Frontend Integration
**Duration: 2-3 days**

#### 8.1 API Client Updates
- Update frontend API endpoints to Python backend
- Update request/response types to match Python Pydantic models
- Test all flows against backend

#### 8.2 WebSocket Integration
- Setup WebSocket support in FastAPI
- Real-time chat streaming
- Progress updates

---

## 📝 Key Implementation Details

### Authentication Flow
```
Frontend → POST /api/auth/login
           ↓
Backend  → Verify credentials
           ↓
           → Generate JWT token
           ↓
Frontend ← Return token + user info
           ↓
Frontend → Store in localStorage
           ↓
Frontend → Send token in Authorization header
```

### PDF Processing Flow
```
Frontend → Upload PDF
           ↓
Backend  → Store file temporarily
           ↓
           → Call PDF Parser Agent
           ↓
           → Extract text & structure
           ↓
           → Create embeddings
           ↓
           → Store in PostgreSQL
           ↓
           → Index in Qdrant
           ↓
Frontend ← Return parsed structure
```

### Learning Session Flow
```
Student  → Start session
           ↓
Backend  → Initialize orchestrator agent
           ↓
           → Teaching phase (Tutor Agent + RAG)
           ↓
           → Assessment phase (Quiz Agent)
           ↓
           → Decision phase (Calculate next action)
           ↓
           → Log progress (Progress Service)
           ↓
Student  ← Update UI with next action
```

### RAG Chat Flow
```
Student  → Send message
           ↓
Backend  → Create embedding of message
           ↓
           → Search Qdrant for relevant content
           ↓
           → Call Tutor Agent with context
           ↓
           → Generate response with RAG
           ↓
           → Save to chat history
           ↓
Student  ← Stream response
```

---

## 🔧 Development Setup

### Local Development
```bash
# 1. Setup Python environment
cd apps/api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start database services (Docker)
docker-compose up -d postgres qdrant

# 4. Run migrations
alembic upgrade head

# 5. Start API server
uvicorn src.main:app --reload --port 8000

# 6. In another terminal, start frontend
cd apps/web
pnpm dev
```

### Docker Deployment
```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f api
docker-compose logs -f postgres
docker-compose logs -f qdrant
```

---

## 📊 Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Classes
CREATE TABLE classes (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES users,
  name VARCHAR NOT NULL,
  description TEXT,
  join_code VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Class Members (Enrollments)
CREATE TABLE class_members (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes,
  student_id UUID REFERENCES users,
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Chapters
CREATE TABLE chapters (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes,
  title VARCHAR NOT NULL,
  order_index INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sections
CREATE TABLE sections (
  id UUID PRIMARY KEY,
  chapter_id UUID REFERENCES chapters,
  title VARCHAR NOT NULL,
  content TEXT,
  order_index INT,
  embedding_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  section_id UUID REFERENCES sections,
  title VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz Questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer VARCHAR,
  explanation TEXT,
  difficulty VARCHAR
);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes,
  student_id UUID REFERENCES users,
  answers JSONB,
  score INT,
  attempted_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES classes,
  student_id UUID REFERENCES users,
  message_text TEXT NOT NULL,
  response_text TEXT,
  role VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress
CREATE TABLE progress (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users,
  section_id UUID REFERENCES sections,
  status VARCHAR(20),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES users,
  class_id UUID REFERENCES classes,
  total_sections INT,
  completed_sections INT,
  total_quiz_attempts INT,
  average_score FLOAT,
  time_spent_minutes INT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Qdrant collections created
- [ ] OpenAI API key validated
- [ ] Frontend CORS settings updated
- [ ] All API endpoints tested
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Docker images built
- [ ] Production environment variables set
- [ ] Database backups configured
- [ ] Monitoring & alerts setup

---

## 📅 Timeline Estimate

| Phase | Tasks | Duration | Start | End |
|-------|-------|----------|-------|-----|
| 1 | Setup & Infrastructure | 1-2 days | Week 1 | Week 1 |
| 2 | Core Backend | 2-3 days | Week 1 | Week 2 |
| 3 | OpenAI Agents | 3-4 days | Week 2 | Week 2 |
| 4 | API Endpoints | 2-3 days | Week 2 | Week 3 |
| 5 | Services | 2-3 days | Week 3 | Week 3 |
| 6 | Vector DB | 1-2 days | Week 3 | Week 3 |
| 7 | Testing | 2-3 days | Week 3 | Week 4 |
| 8 | Frontend Integration | 2-3 days | Week 4 | Week 4 |

**Total: 15-23 days (~3-4 weeks)**

---

## ⚠️ Important Notes

1. **No TypeScript in backend** - Pure Python with Pydantic for type safety
2. **OpenAI Agents SDK only** - No Mastra, direct use of OpenAI API
3. **Frontend unchanged** - Continue using existing React setup
4. **FastAPI over Fastify** - Lighter, more Pythonic
5. **Same database schema** - PostgreSQL + Qdrant concepts remain
6. **Clear separation** - Frontend and backend are independent

---

## 📚 References

- FastAPI: https://fastapi.tiangolo.com/
- OpenAI Agents SDK: https://platform.openai.com/docs/agents
- SQLAlchemy: https://www.sqlalchemy.org/
- Qdrant: https://qdrant.tech/
- Pydantic: https://docs.pydantic.dev/

---

**Next Step:** Start Phase 1 - Setup & Infrastructure
