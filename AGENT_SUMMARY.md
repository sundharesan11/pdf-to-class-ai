# Agent System Summary

## What We're Building

```
┌─────────────────────────────────────────────────────────────────┐
│                   PDF-POWERED AGENT SYSTEM                      │
│                                                                 │
│  Teacher uploads PDF → Agents create course structure          │
│  Student joins class → Agent drives learning experience        │
│  Student learns → Agent teaches, quizzes, adapts               │
└─────────────────────────────────────────────────────────────────┘
```

## 4 Core Agents

### 1️⃣ PDF Parser Agent
- **Job**: Turn PDF into lesson structure
- **Inputs**: PDF text, subject, difficulty
- **Outputs**: Chapters, sections, learning objectives
- **Tools**: PDF extraction, DB save, embeddings
- **No auth**: Anyone can upload

### 2️⃣ Tutor Agent  
- **Job**: Teach the student
- **Inputs**: Student message, section content, chat history
- **Outputs**: Explanation, examples, questions
- **Tools**: Get section content, search Qdrant, save messages
- **RAG**: Searches vector DB for relevant content

### 3️⃣ Quiz Agent
- **Job**: Test and adapt
- **Inputs**: Question, student answer, current difficulty
- **Outputs**: Correct/incorrect, explanation, next difficulty
- **Tools**: Get questions, evaluate, save progress
- **Adaptive**: Adjusts difficulty based on performance

### 4️⃣ Orchestrator Agent
- **Job**: Direct the flow
- **Inputs**: Session state, previous scores, current section
- **Outputs**: Next action (teach, quiz, next section, celebrate)
- **Tools**: Delegates to other agents as tools
- **Smart**: Decides what happens next

## How They Work Together

```
Teacher uploads PDF
    ↓ PDF_PARSER_AGENT
    ├─ Extracts text from PDF
    ├─ Structures into chapters/sections
    ├─ Saves to database
    └─ Generates embeddings to Qdrant
    ↓
Database: Chapters, sections, content
Qdrant: Vector embeddings for semantic search
    ↓
Student joins class
    ↓ ORCHESTRATOR_AGENT
    ├─ Gets class structure
    ├─ Checks student progress
    └─ Decides: "Teach Section 1"
    ↓
TUTOR_AGENT takes over
    ├─ Gets section content from DB
    ├─ Searches Qdrant for relevant info (RAG)
    ├─ Generates explanation
    └─ Returns: explanation + examples + questions
    ↓
Student reads and asks questions
    ↓ TUTOR_AGENT
    ├─ Receives student message
    ├─ Searches Qdrant again for relevant content
    ├─ Answers conversationally
    └─ When ready, suggests: "Time for quiz?"
    ↓
Student ready for quiz
    ↓ ORCHESTRATOR_AGENT
    └─ Decides: "Time for quiz"
    ↓
QUIZ_AGENT takes over
    ├─ Gets quiz questions
    ├─ Student answers
    ├─ Evaluates correctness
    ├─ Provides feedback
    └─ Returns score
    ↓
ORCHESTRATOR_AGENT decides next
    ├─ If 60%: Review this section
    ├─ If 80%: Move to next section
    └─ If 100%: Celebrate! Continue.
    ↓
Repeat cycle...
```

## Key Features

✅ **Agent-Driven**: Agents generate all content, no Python code
✅ **No Auth Demo**: Everyone accesses everything
✅ **RAG Teaching**: Tutor searches Qdrant for relevant content
✅ **Adaptive Learning**: Difficulty changes based on performance
✅ **Structured Output**: All agents return Pydantic models (JSON)
✅ **Tool-Based**: Agents use functions to interact with systems

## Tools (Not Agents Write Code)

```
Database Tools:
- get_section_content()
- save_quiz_attempt()
- save_progress()

Qdrant Tools:
- search_vector_db()
- store_embeddings()

PDF Tools:
- extract_text_from_pdf()

Utility Tools:
- create_embedding()
```

## Data Flow

```
POST /pdf/upload
  → PDF_PARSER_AGENT
    → Tools handle: save to DB, create embeddings
    → Agent generates: Chapter/section structure
  → Returns: ClassStructure (JSON)

GET /class/{id}
  → ORCHESTRATOR_AGENT
    → Tools handle: get class from DB, get progress
    → Agent generates: Next action
  → Returns: OrchestrationDecision

POST /chat/message
  → TUTOR_AGENT
    → Tools handle: get section, search Qdrant, save message
    → Agent generates: Explanation + examples + questions
  → Returns: TutorResponse

POST /quiz/submit
  → QUIZ_AGENT
    → Tools handle: evaluate, save attempt, update progress
    → Agent generates: Feedback + difficulty adjustment
  → Returns: QuizResponse
```

## Implementation Order

### Phase 1: Setup (2-3 hours)
- Python environment
- FastAPI scaffolding
- Database models
- Tool function definitions

### Phase 2: PDF Parser (4-6 hours)
- Implement PDF parsing
- Test agent structure generation

### Phase 3: Database & Tools (2-3 hours)
- Implement DB tools
- Implement Qdrant tools

### Phase 4: Tutor & Quiz (4-6 hours)
- Build and test conversation flow

### Phase 5: Orchestrator (2-3 hours)
- Build decision logic

### Phase 6: API Routes (2-3 hours)
- Connect agents to FastAPI endpoints

**Total**: ~16-24 hours to working system

## Design Principles

1. **Agent decides, tools execute** - Agents don't write code, tools do
2. **Structured output** - Everything comes back as JSON (Pydantic)
3. **Delegates, doesn't handoff** - Orchestrator calls agents as tools
4. **RAG for teaching** - Search vector DB for relevant content
5. **No auth initially** - Focus on agents, add security later

## Ready to Start?

Review:
- ✅ AGENT_ARCHITECTURE.md (detailed specs)
- ✅ AGENT_DISCUSSION.md (design decisions)
- ✅ This file (overview)

Questions or changes?

Once approved, let's build!
