# Phase 1: Python Backend Infrastructure Setup

**Status**: ✅ COMPLETE

## What Was Created

### Directory Structure
```
apps/api/src/
├── __init__.py
├── main.py                    # FastAPI application
├── config.py                  # Settings & environment
├── models.py                  # Pydantic schemas (agent outputs)
├── agents/
│   ├── __init__.py
│   ├── pdf_parser.py          # PDF Parser Agent definition
│   ├── tutor.py               # Tutor Agent definition
│   ├── quiz.py                # Quiz Agent definition
│   └── orchestrator.py        # Orchestrator Agent definition
├── tools/
│   ├── __init__.py
│   ├── pdf_tools.py           # PDF extraction tools
│   ├── database_tools.py      # Database operation tools
│   └── qdrant_tools.py        # Vector DB tools
├── db/
│   ├── __init__.py
│   └── database.py            # SQLAlchemy setup
└── routes/
    ├── __init__.py
    ├── pdf.py                 # PDF upload endpoint
    ├── chat.py                # Tutor chat endpoint
    ├── quiz.py                # Quiz submission endpoint
    └── learning.py            # Learning session endpoint
```

## Phase 1 Components

### 1. Configuration (config.py)
- OpenAI API settings
- Database URL and options
- Qdrant vector DB settings
- Agent configuration (model, temperature, etc)
- Session configuration
- API settings

### 2. Models (models.py) - Pydantic Schemas
**Agent Output Models** (what agents return):
- `ClassStructure` - PDF Parser output
- `TutorResponse` - Tutor Agent output
- `QuizResponse` - Quiz Agent output
- `OrchestrationDecision` - Orchestrator output

**Supporting Models**:
- `Section`, `Chapter` - Course structure components
- `ChatMessage`, `ConversationHistory` - Chat tracking
- `StudentProgress`, `LearningSession` - Session state
- Request models for API endpoints

### 3. Tools (tools/ directory)
**Tool stubs created** (implementation in Phase 3):

**pdf_tools.py**:
- `extract_text_from_pdf()` - Extract from PDF file
- `extract_pdf_with_path()` - Extract from bytes

**database_tools.py** (11 tools):
- `save_class_to_db()` - Save parsed course
- `get_section_content()` - Retrieve section
- `get_class_structure()` - Get full course
- `save_chat_message()` - Log chat messages
- `get_chat_history()` - Retrieve conversation
- `get_student_progress()` - Get progress stats
- `save_quiz_attempt()` - Record quiz answer
- `save_progress()` - Update section progress
- `create_learning_session()` - Create session
- `get_learning_session()` - Retrieve session
- `update_learning_session()` - Update session state

**qdrant_tools.py** (6 tools):
- `generate_embedding()` - Create vector embedding
- `store_embeddings()` - Save to Qdrant
- `search_vector_db()` - Semantic search (RAG)
- `generate_and_store_embeddings()` - Batch process
- `qdrant_search_with_filters()` - Advanced search
- `delete_class_embeddings()` - Cleanup vectors

### 4. Agents (agents/ directory)

**All agents use OpenAI Agents SDK with**:
- Structured instructions defining behavior
- Tool definitions
- Output types (Pydantic models)
- Model configuration

**PDF Parser Agent** (`pdf_parser.py`):
- Analyzes PDF content
- Creates course structure (chapters/sections)
- Outputs: `ClassStructure`
- Tools: extract PDF, save to DB, generate embeddings

**Tutor Agent** (`tutor.py`):
- Teaches via Socratic method
- Searches Qdrant for relevant content (RAG)
- Outputs: `TutorResponse`
- Tools: get section content, search vector DB, save messages

**Quiz Agent** (`quiz.py`):
- Evaluates student answers
- Provides constructive feedback
- Adapts difficulty
- Outputs: `QuizResponse`
- Tools: search content, check answers, save progress

**Orchestrator Agent** (`orchestrator.py`):
- Manages learning flow
- Decides: teach, quiz, review, next section
- Adapts to student performance
- Outputs: `OrchestrationDecision`
- Tools: get course structure, check progress, manage sessions

### 5. API Routes (routes/ directory)

**pdf.py** - PDF processing
- `POST /pdf/upload` - Upload and parse PDF
- `GET /pdf/{class_id}/structure` - Get course structure

**chat.py** - Tutor interaction
- `POST /chat/message` - Send message to tutor
- `GET /chat/{session_id}/history` - Get conversation history

**quiz.py** - Quiz interaction
- `POST /quiz/submit` - Submit answer
- `GET /quiz/{session_id}/questions` - Get questions

**learning.py** - Learning sessions
- `POST /learning/session/start` - Start new session
- `GET /learning/session/{session_id}` - Get session
- `POST /learning/session/{session_id}/next` - Get next action
- `GET /learning/class/{class_id}/progress` - Get progress

### 6. Main Application (main.py)
- FastAPI app initialization
- CORS middleware
- Health check endpoint
- Root endpoint

### 7. Database Setup (db/database.py)
- SQLAlchemy engine configuration
- Session factory
- Database helper functions

## Dependencies Updated

Added to requirements.txt:
- `openai-agents==0.1.0` - OpenAI Agents SDK

Existing dependencies:
- FastAPI, SQLAlchemy, Pydantic, PostgreSQL, Qdrant, PyPDF2, etc.

## What's Ready

✅ Project structure complete
✅ All agent definitions created with proper instructions
✅ All tool stubs defined with docstrings
✅ All route stubs created
✅ Pydantic models for all agent outputs
✅ Configuration system ready
✅ Main FastAPI app initialized

## Next: Phase 2

Implementation tasks (in priority order):

### Phase 2a: Database Models & Tools (2-3 hours)
1. Create SQLAlchemy ORM models for:
   - Class, Chapter, Section
   - Quiz, QuizQuestion
   - StudentProgress
   - LearningSession
   - ChatHistory

2. Implement database tools:
   - `save_class_to_db()` - Core for PDF Parser
   - `get_section_content()` - Core for Tutor
   - `save_quiz_attempt()` - Core for Quiz
   - `save_progress()` - Track progress
   - Session management tools

### Phase 2b: Qdrant Integration (2 hours)
1. Initialize Qdrant client
2. Implement embeddings:
   - `generate_embedding()` - Use OpenAI API
   - `store_embeddings()` - Save to Qdrant
   - `search_vector_db()` - RAG retrieval

### Phase 2c: PDF Tools (1-2 hours)
1. Implement `extract_text_from_pdf()` using PyPDF2
2. Handle file upload in routes

### Phase 3: End-to-End Testing (2-3 hours)
1. Test PDF Parser Agent:
   - Upload sample PDF
   - Verify course structure generated
   - Check database saved correctly
   - Verify embeddings created

2. Test Tutor Agent:
   - Verify RAG search works
   - Test conversation flow

3. Test Quiz Agent:
   - Test answer evaluation
   - Check progress saving

## Key Architecture Decisions

✅ **Agent-Driven**: All content creation via agents, not code
✅ **Structured Output**: Agents output Pydantic models (JSON)
✅ **Tool-Based**: Agents use tools, don't write code
✅ **RAG Teaching**: Tutor searches Qdrant for relevant content
✅ **Adaptive Learning**: Quiz and Orchestrator adapt to performance
✅ **No Auth Initially**: Demo mode - everyone accesses all content

## Running the App (when Phase 2 complete)

```bash
# Activate venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY=sk-...
export DATABASE_URL=postgresql://...
export QDRANT_URL=http://localhost:6333

# Run the app
python -m uvicorn src.main:app --reload
```

## Important Notes

### Tool Functions
- All tool functions are decorated with `@function_tool`
- They have detailed docstrings (used as tool descriptions)
- Function signatures define tool parameters
- Tools handle side effects (DB, API calls, etc)
- Agents orchestrate and decide logic

### Agent Instructions
- Clear, step-by-step guidance
- Specific behaviors and constraints
- Success criteria
- Examples when relevant
- Teaching style and tone

### Structured Output
- Agents have `output_type=PydanticModel`
- Forces structured output via OpenAI's structured outputs
- No ambiguous text - always JSON
- Type-safe and validated

## Testing Strategy

1. **Unit Tests**: Test individual tools in isolation
2. **Integration Tests**: Test agent + tools together
3. **End-to-End Tests**: Test complete learning flow
4. **Mock Tests**: Test with mock agents without API calls

## Next Steps

1. Review this Phase 1 setup
2. Ask questions about architecture
3. Start Phase 2 implementation
4. Test end-to-end with sample PDF

---

**Phase 1 Status**: ✅ COMPLETE
**Next Phase**: Phase 2 - Database & Tools Implementation
**Estimated Duration**: 2-3 hours for Phase 2
