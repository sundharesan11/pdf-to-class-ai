# Phase 1: Complete System Architecture

## System Overview

```
┌────────────────────────────────────────────────────────────────┐
│                     Client (Web/Mobile)                        │
└────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────┐
│                   FastAPI Application                          │
│  (apps/api/src/main.py)                                       │
│                                                                │
│  Routes:                                                       │
│  ├─ POST /pdf/upload                                          │
│  ├─ POST /chat/message                                        │
│  ├─ POST /quiz/submit                                         │
│  └─ POST /learning/session/start                              │
└────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴──────────────────────┐
        ↓                                            ↓
  ┌─────────────────────┐           ┌──────────────────────────┐
  │  OpenAI Agents SDK  │           │   External Services      │
  │                     │           │                          │
  │ ┌─────────────────┐ │           │ ┌──────────────────────┐ │
  │ │ PDF Parser      │ │           │ │ OpenAI API           │ │
  │ │ Agent           │ │           │ │ (gpt-4o-mini, embeddings) │ │
  │ └─────────────────┘ │           │ └──────────────────────┘ │
  │                     │           └──────────────────────────┘
  │ ┌─────────────────┐ │                        ↑
  │ │ Tutor Agent     │ │────────────────────────┘
  │ │ (RAG+Socratic)  │ │
  │ └─────────────────┘ │
  │                     │
  │ ┌─────────────────┐ │
  │ │ Quiz Agent      │ │
  │ │ (Evaluator)     │ │
  │ └─────────────────┘ │
  │                     │
  │ ┌─────────────────┐ │
  │ │ Orchestrator    │ │
  │ │ Agent           │ │
  │ └─────────────────┘ │
  └─────────────────────┘
         ↓         ↓
    ┌────┴─────────┴─────────┐
    ↓                        ↓
 ┌──────────────┐      ┌──────────────────┐
 │ PostgreSQL   │      │ Qdrant Vector DB │
 │ Database     │      │ (Embeddings)     │
 │              │      │                  │
 │ Classes      │      │ Section vectors  │
 │ Chapters     │      │ Question vectors │
 │ Sections     │      │ (for RAG search) │
 │ Progress     │      │                  │
 │ Chat History │      │                  │
 └──────────────┘      └──────────────────┘
```

## Agent Flow Diagram

### Complete Learning Journey

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PDF UPLOAD                                               │
│                                                             │
│ Teacher: POST /pdf/upload (Biology.pdf)                   │
│   ↓                                                         │
│ PDF_PARSER_AGENT:                                          │
│   ├─ extract_text_from_pdf()                              │
│   ├─ analyze and structure                                │
│   ├─ save_class_to_db() → Save course structure           │
│   ├─ generate_and_store_embeddings() → Create vectors     │
│   └─ Output: ClassStructure (JSON)                        │
│   ↓                                                         │
│ Response: {chapters, sections, learning_objectives}       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SESSION START                                            │
│                                                             │
│ Student: POST /learning/session/start                     │
│   ↓                                                         │
│ ORCHESTRATOR_AGENT:                                        │
│   ├─ get_class_structure(class_id)                        │
│   ├─ get_student_progress(student_id, class_id)           │
│   ├─ Decide: "Teach section 1"                           │
│   └─ Output: OrchestrationDecision                        │
│   ↓                                                         │
│ Response: {action: "teach", target: "section_1"}          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. LEARNING (Tutor Phase)                                   │
│                                                             │
│ Student: POST /chat/message ("Explain photosynthesis")   │
│   ↓                                                         │
│ TUTOR_AGENT:                                              │
│   ├─ get_section_content(section_id)                      │
│   ├─ search_vector_db("photosynthesis light") → RAG       │
│   ├─ Generate explanation with examples                   │
│   ├─ save_chat_message(session_id, user, message)         │
│   └─ Output: TutorResponse                                │
│   ↓                                                         │
│ Response: {                                                │
│   explanation: "Photosynthesis is...",                    │
│   examples: [...],                                         │
│   follow_up_questions: [...],                             │
│   next_action: "continue"                                 │
│ }                                                           │
│   ↓ (Repeat: student asks more questions)                 │
│   ↓ (Agent recommends quiz when ready)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. QUIZ (Evaluation Phase)                                   │
│                                                             │
│ Student: POST /quiz/submit (answer: "A")                  │
│   ↓                                                         │
│ QUIZ_AGENT:                                               │
│   ├─ search_vector_db(question) → Verify answer           │
│   ├─ Evaluate correctness                                 │
│   ├─ save_quiz_attempt(student_id, question_id, answer)   │
│   ├─ save_progress(student_id, section_id, score)         │
│   └─ Output: QuizResponse                                 │
│   ↓                                                         │
│ Response: {                                                │
│   is_correct: true,                                        │
│   explanation: "Correct! Because...",                      │
│   next_step: "move_to_next",                              │
│   adaptive_difficulty: "harder"                            │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. NEXT DECISION                                            │
│                                                             │
│ App: POST /learning/session/{session_id}/next             │
│   ↓                                                         │
│ ORCHESTRATOR_AGENT:                                        │
│   ├─ get_learning_session(session_id)                     │
│   ├─ get_student_progress() → Check score                │
│   ├─ Decide based on score:                              │
│   │  - 60-80%: move to next section                       │
│   │  - >80%: move to next (challenge option)              │
│   │  - <60%: review this section                          │
│   └─ update_learning_session(new_section, new_action)     │
│   ↓                                                         │
│ Response: {action: "next_section", target: "section_2"}   │
│   ↓ (Repeat from step 3)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### PDF → Database → Qdrant

```
PDF File
  ↓
extract_text_from_pdf()
  ↓
PDF Content (text string)
  ↓
PDF_PARSER_AGENT
  ├─ Analyzes and structures
  └─ Creates ClassStructure {
       title, description,
       chapters: [{
         title, description,
         sections: [{
           title, content,
           key_points, duration,
           difficulty
         }]
       }]
     }
  ↓
save_class_to_db() → PostgreSQL
  ├─ Create Class record
  ├─ Create Chapter records (FK to Class)
  ├─ Create Section records (FK to Chapter)
  └─ Return class_id, section_ids
  ↓
generate_and_store_embeddings()
  ├─ For each section content:
  │  ├─ generate_embedding(content)
  │  │  └─ Call OpenAI embeddings API
  │  └─ Store in Qdrant
  └─ Create mapping: section_id → vector_id
  ↓
Now ready for:
  - TUTOR_AGENT: search_vector_db() for RAG
  - QUIZ_AGENT: semantic search for answers
```

### Chat → RAG → Response

```
Student Message
  ↓
save_chat_message() → PostgreSQL
  │  (persist for history)
  │
TUTOR_AGENT
  ├─ get_section_content(section_id) → PostgreSQL
  │
  ├─ search_vector_db(student_question) → Qdrant
  │  ├─ generate_embedding(student_question) via OpenAI
  │  ├─ Search Qdrant for similar vectors
  │  └─ Return top N relevant content snippets
  │
  └─ Generate response combining:
     - Section content
     - Retrieved RAG content
     - Socratic method
  ↓
TutorResponse (JSON)
  - explanation
  - examples (from course)
  - follow_up_questions
  - next_action
```

## Component Breakdown

### 1. PDF Parser Agent

**Input Type**:
```python
{
    "pdf_content": str,      # Raw text from PDF
    "subject": str,          # Subject title
    "level": str             # "beginner" | "intermediate" | "advanced"
}
```

**Output Type** (Pydantic):
```python
ClassStructure {
    title: str
    description: str
    chapters: [Chapter]
    learning_objectives: [str]
    estimated_total_hours: int
}
```

**Tools Available**:
1. `extract_text_from_pdf()` - Extract text from file
2. `save_class_to_db()` - Save course structure to PostgreSQL
3. `generate_and_store_embeddings()` - Create vectors in Qdrant

**Key Instruction**:
- Analyze PDF and create structured course
- Identify chapters and sections
- Extract key concepts
- Estimate learning times

### 2. Tutor Agent

**Input Type**:
```python
{
    "section_id": str,
    "student_message": str,
    "session_history": [ChatMessage],
    "student_level": str
}
```

**Output Type** (Pydantic):
```python
TutorResponse {
    explanation: str
    examples: [str]
    key_concepts: [str]
    follow_up_questions: [str]
    depth_adjustment: str  # "deeper" | "simpler" | "appropriate"
    next_action: str       # "continue" | "quiz" | "next_section"
}
```

**Tools Available**:
1. `get_section_content()` - Retrieve section from PostgreSQL
2. `search_vector_db()` - RAG semantic search in Qdrant
3. `save_chat_message()` - Save to conversation history

**Key Features**:
- Socratic teaching method
- RAG-powered relevant content
- Adaptive depth adjustments
- Conversation awareness

### 3. Quiz Agent

**Input Type**:
```python
{
    "section_id": str,
    "student_answer": str,
    "question_id": str,
    "difficulty": str
}
```

**Output Type** (Pydantic):
```python
QuizResponse {
    is_correct: bool
    explanation: str
    key_concept: str
    confidence_level: float  # 0-1
    hint_if_wrong: str (optional)
    next_step: str           # "try_again" | "review" | "move_to_next"
    adaptive_difficulty: str # "easier" | "same" | "harder"
}
```

**Tools Available**:
1. `get_section_content()` - Get course material for validation
2. `search_vector_db()` - Find relevant content for answer check
3. `save_quiz_attempt()` - Record attempt
4. `save_progress()` - Update section progress

**Key Features**:
- Evaluates correctness
- Provides constructive feedback
- Adaptive difficulty
- Progress tracking

### 4. Orchestrator Agent

**Input Type**:
```python
{
    "session_id": str,
    "class_id": str,
    "student_id": str,
    "current_action": str,      # "start" | "teach" | "quiz" | "review"
    "last_quiz_score": float,   # 0-1
    "student_level": str
}
```

**Output Type** (Pydantic):
```python
OrchestrationDecision {
    action: str          # "teach" | "quiz" | "review" | "next_section" | "congratulate"
    target: str          # section_id or special value
    reasoning: str       # Explanation of decision
    student_message: str # Friendly message to show
}
```

**Tools Available**:
1. `get_class_structure()` - Get full course structure
2. `get_student_progress()` - Check completion and scores
3. `get_learning_session()` - Get current session state
4. `update_learning_session()` - Update session state

**Decision Logic**:
- Not started → Teach
- In progress → Continue or quiz
- Low quiz score (<60%) → Review
- Good quiz score (60-80%) → Next section
- Excellent (>80%) → Challenge or next
- All done → Celebrate

## Tool Matrix

### Tools by Type

**Database Tools** (PostgreSQL):
- save_class_to_db
- get_section_content
- get_class_structure
- save_chat_message
- get_chat_history
- get_student_progress
- save_quiz_attempt
- save_progress
- create_learning_session
- get_learning_session
- update_learning_session

**Vector DB Tools** (Qdrant):
- generate_embedding
- store_embeddings
- search_vector_db (RAG)
- generate_and_store_embeddings (batch)
- qdrant_search_with_filters
- delete_class_embeddings

**PDF Tools**:
- extract_text_from_pdf
- extract_pdf_with_path

### Tools by Agent

| Agent | Database | Qdrant | PDF |
|-------|----------|--------|-----|
| PDF Parser | save_class_to_db, get_class_structure | generate_and_store_embeddings | extract_text_from_pdf |
| Tutor | get_section_content, save_chat_message | search_vector_db | - |
| Quiz | save_quiz_attempt, save_progress, get_section_content | search_vector_db | - |
| Orchestrator | get_class_structure, get_student_progress, create_learning_session, get_learning_session, update_learning_session | - | - |

## Structured Output Pattern

All agents return Pydantic models:

```python
# Agent definition
agent = Agent(
    name="Example",
    instructions="...",
    tools=[...],
    output_type=MyOutputModel  # ← Forces structured output
)

# When run, agent MUST return instance of MyOutputModel
result = await Runner.run(agent, input_data)
output = result.final_output_as(MyOutputModel)  # Type-safe
```

**Benefits**:
- Type-safe
- JSON serializable
- Validated by Pydantic
- Frontend can rely on structure
- Easy to document
- No ambiguous text

## Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pdf_to_class

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=... (optional)

# API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false
```

## Development Checklist

**Phase 1** ✅ (Complete)
- [x] Project structure
- [x] Agent definitions
- [x] Tool stubs
- [x] Pydantic models
- [x] FastAPI routes
- [x] Configuration

**Phase 2** (Next)
- [ ] SQLAlchemy ORM models
- [ ] Database tools implementation
- [ ] Qdrant integration
- [ ] PDF extraction implementation
- [ ] Route implementations

**Phase 3** (After Phase 2)
- [ ] End-to-end testing
- [ ] Agent fine-tuning
- [ ] Performance optimization
- [ ] Error handling

---

**Architecture Status**: ✅ Complete
**Implementation Status**: Phase 1 Complete, Phase 2 Ready
