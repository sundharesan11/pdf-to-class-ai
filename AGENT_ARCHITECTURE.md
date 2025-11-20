# Agent Architecture Plan - EduAgent

## Overview

This document describes how OpenAI Agents work together to create and drive interactive learning experiences. **All content creation is agent-driven** - no Python functions directly manipulate content.

## Key Principles

1. **Agent-Driven Content Creation** - Agents generate lessons, chapters, quizzes (not Python code)
2. **No Auth Initially** - Demo mode: all users access all content
3. **Tool-Based** - Agents use tools to interact with DB, Qdrant, and APIs
4. **Three Core Agents** - Orchestrator, Tutor, Quiz agents
5. **Structured Output** - Agents output Pydantic models (JSON structure)

---

## Agent Interaction Flow

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    API Endpoints (FastAPI)                  │
│                                                             │
│  POST /pdf/upload → PDF_PARSER_AGENT                      │
│  GET  /class/{id} → ORCHESTRATOR_AGENT                    │
│  POST /chat/message → TUTOR_AGENT                         │
│  POST /quiz/submit → QUIZ_AGENT                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────────┐
        │      OPENAI AGENTS SDK (LLM Loop)       │
        └──────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────────┐
        │   Tools (Function Calls)                 │
        │                                          │
        │  Database Tools:                        │
        │  • get_class_content()                  │
        │  • get_section()                        │
        │  • get_quiz()                           │
        │  • save_progress()                      │
        │                                          │
        │  Qdrant Tools:                          │
        │  • search_vector_db()                   │
        │  • store_embeddings()                   │
        │                                          │
        │  External:                              │
        │  • extract_pdf_text()                   │
        │  • generate_embeddings()                │
        └──────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────────┐
        │  Database & Vector Store                │
        │                                          │
        │  PostgreSQL:                            │
        │  • Users, Classes, Sections             │
        │  • Quizzes, Progress                    │
        │  • Chat History                         │
        │                                          │
        │  Qdrant:                                │
        │  • Section embeddings                   │
        │  • Question embeddings                  │
        │  • Chat history embeddings              │
        └──────────────────────────────────────────┘
```

---

## Agent Specifications

### 1. PDF Parser Agent

**Purpose**: Parse PDF and generate structured lesson content automatically

**Input**: 
```python
{
    "pdf_content": str,          # Raw PDF text
    "subject": str,              # Subject name
    "level": str,               # beginner, intermediate, advanced
}
```

**Output** (Pydantic):
```python
class Chapter(BaseModel):
    title: str
    description: str
    sections: list["Section"]

class Section(BaseModel):
    title: str
    content: str
    key_points: list[str]
    estimated_duration: int  # minutes
    difficulty: str

class ClassStructure(BaseModel):
    title: str
    description: str
    chapters: list[Chapter]
    learning_objectives: list[str]
    estimated_total_hours: int
```

**Tools**:
- `extract_text_from_pdf(pdf_path: str) -> str`
- `save_class_to_db(class_structure: ClassStructure) -> dict`
- `generate_and_store_embeddings(sections: list[Section]) -> list[str]`

**Instructions**:
```
You are an expert curriculum designer. Your job is to:
1. Analyze the provided PDF content
2. Identify natural chapters and sections
3. Extract key concepts and learning points
4. Estimate learning time for each section
5. Create clear, structured lesson content

Return a complete course structure that students can follow step-by-step.
Make sections self-contained but interconnected.
```

**Example Flow**:
```
Teacher uploads Biology.pdf
  ↓
PDF_PARSER_AGENT receives pdf_content
  ↓
Agent calls extract_text_from_pdf()
  ↓
Agent analyzes and structures content
  ↓
Agent generates ClassStructure JSON
  ↓
Agent calls save_class_to_db()
  ↓
Agent calls generate_and_store_embeddings()
  ↓
Database + Qdrant populated with lesson content
  ↓
Teacher sees generated course in UI
```

---

### 2. Tutor Agent

**Purpose**: Teach student through Socratic method, adapted to their level

**Context**: Per learning session

**Input**:
```python
{
    "section_id": str,
    "student_message": str,
    "session_history": list[dict],  # Conversation history
    "student_level": str,            # beginner, intermediate, advanced
}
```

**Output** (Pydantic):
```python
class TutorResponse(BaseModel):
    explanation: str
    examples: list[str]
    key_concepts: list[str]
    follow_up_questions: list[str]
    depth_adjustment: str  # "deeper", "simpler", "appropriate"
    next_action: str  # "continue", "quiz", "next_section"
```

**Tools**:
- `get_section_content(section_id: str) -> Section`
- `search_vector_db(query: str, section_id: str) -> list[str])`  # RAG retrieval
- `get_chat_history(session_id: str) -> list[dict]`
- `save_chat_message(session_id: str, role: str, content: str) -> str`

**Instructions**:
```
You are an expert tutor. Your role is to:
1. Understand what the student is asking
2. Search the vector database for relevant content
3. Provide clear, engaging explanations
4. Give concrete examples from the subject matter
5. Ask probing questions to check understanding
6. Adjust depth based on student responses

Use the Socratic method: ask questions that guide learning.
Be encouraging and patient.
Reference the actual course content retrieved from the database.

When you have explained enough, suggest moving to a quiz to test understanding.
```

**Example Flow**:
```
Student: "I don't understand photosynthesis"
  ↓
TUTOR_AGENT receives message
  ↓
Agent calls get_section_content("photosynthesis_section_id")
Agent calls search_vector_db("photosynthesis light energy") → Gets similar content
  ↓
Agent generates explanation with examples from DB
  ↓
Returns TutorResponse with explanation, examples, follow-up questions
  ↓
Student reads response
  ↓
If comprehension seems good, suggests quiz
```

---

### 3. Quiz Agent

**Purpose**: Evaluate student understanding through questions and feedback

**Context**: Per learning session

**Input**:
```python
{
    "section_id": str,
    "student_answer": str,  # Or multiple choice selection
    "question_id": str,
    "difficulty": str,
}
```

**Output** (Pydantic):
```python
class QuizResponse(BaseModel):
    is_correct: bool
    explanation: str
    key_concept: str
    confidence_level: float  # 0-1, how sure agent is
    hint_if_wrong: str  # For incorrect answers
    next_step: str  # "try_again", "review", "move_to_next"
    adaptive_difficulty: str  # Difficulty for next question
```

**Tools**:
- `get_quiz_questions(section_id: str, difficulty: str) -> list[Question]`
- `get_or_generate_questions(section_id: str, count: int) -> list[Question]`
- `save_quiz_attempt(student_id: str, question_id: str, answer: str, is_correct: bool) -> dict`
- `save_progress(student_id: str, section_id: str, score: float) -> dict`

**Instructions**:
```
You are an expert assessment specialist. Your role is to:
1. Evaluate if the student's answer is correct
2. Provide clear explanation of the correct answer
3. If wrong, provide a constructive hint without giving the answer away
4. Assess the student's mastery level
5. Decide if they should move on or review

Be fair and encouraging.
Provide learning feedback, not just right/wrong.
Adapt the next question's difficulty based on performance.

Save the attempt to track progress.
```

**Example Flow**:
```
Student sees quiz question
  ↓
Student submits answer
  ↓
QUIZ_AGENT receives answer
  ↓
Agent evaluates correctness using section content
  ↓
If correct: Saves progress, suggests next section or more practice
If wrong: Provides hint, suggests review, offers to retry
  ↓
Returns QuizResponse with feedback
  ↓
Student sees result and can retry or continue
```

---

### 4. Orchestrator Agent

**Purpose**: Direct learning flow - decides what happens next

**Context**: Per learning session

**Input**:
```python
{
    "session_id": str,
    "class_id": str,
    "student_id": str,
    "current_action": str,  # "start", "teach", "quiz", "review"
    "last_quiz_score": float,  # 0-1
    "student_level": str,
}
```

**Output** (Pydantic):
```python
class OrchestrationDecision(BaseModel):
    action: str  # "teach", "quiz", "review", "next_section", "congratulate"
    target: str  # section_id or "next_section" or "review_topic"
    reasoning: str
    student_message: str  # Message to show student
```

**Tools**:
- `get_class_structure(class_id: str) -> ClassStructure`
- `get_student_progress(student_id: str, class_id: str) -> StudentProgress`
- `get_next_section(current_section_id: str) -> Section`
- `delegate_to_tutor_agent(request: dict) -> TutorResponse`
- `delegate_to_quiz_agent(request: dict) -> QuizResponse`

**Instructions**:
```
You are the learning coordinator. Your role is to:
1. Manage the flow of the learning session
2. Decide when to teach, when to quiz, when to review
3. Adapt the pace based on student performance
4. Keep students motivated and on track
5. Provide clear next steps

Decision Logic:
- Student hasn't learned section yet → Teach it
- Student asks questions → Let them learn more
- Seems ready for quiz (or student asks) → Give quiz
- Quiz score < 60% → Review and retry
- Quiz score 60-80% → Move to next section
- Quiz score > 80% → Move to next section
- All sections done → Congratulate!

Delegate actual teaching/quizzing to specialized agents.
```

**Example Flow**:
```
Student enters learning session
  ↓
ORCHESTRATOR_AGENT receives session start request
  ↓
Agent gets class structure and student progress
  ↓
Decides: "Time to teach section 1"
  ↓
Delegates to TUTOR_AGENT with section content
  ↓
Student learns...
  ↓
Agent monitors progress
  ↓
Decides: "Ready for quiz"
  ↓
Delegates to QUIZ_AGENT
  ↓
Student takes quiz...
  ↓
Based on score, decides next action
  ↓
Repeats cycle
```

---

## How Agents Work Together

### Using Tools Instead of Handoffs

We use **Agents as Tools** pattern (not handoffs):

```python
# Orchestrator has other agents as tools
orchestrator = Agent(
    name="Orchestrator",
    instructions="...",
    tools=[
        tutor_agent.as_tool(),      # Call tutor as a tool
        quiz_agent.as_tool(),       # Call quiz as a tool
        # ... database tools ...
    ]
)
```

### Example: Complete Learning Session

```
1. Session Start
   POST /class/1/session → Orchestrator Agent
   
2. Orchestrator decides: "Teach Section 1"
   ↓
   Calls: tutor_agent.as_tool()
   
3. Tutor Agent:
   - Gets section from database
   - Searches Qdrant for relevant content
   - Generates explanation
   - Returns TutorResponse
   
4. Student reads explanation
   POST /class/1/chat → Tutor Agent
   
5. Tutor responds conversationally
   
6. After engagement, student ready for quiz
   POST /class/1/quiz → Quiz Agent
   
7. Quiz Agent:
   - Gets quiz questions
   - Evaluates answers
   - Saves progress
   - Provides feedback
   
8. Based on quiz score:
   Orchestrator decides next action
   
9. Repeats step 2-8
```

---

## Tools Implementation Structure

Each agent has Python functions that become tools:

```python
# src/agents/tools/database_tools.py
@function_tool
def get_section_content(section_id: str) -> Section:
    """Get section content from database"""
    # Query database
    # Return Section model

@function_tool
def save_quiz_attempt(student_id: str, question_id: str, answer: str) -> dict:
    """Save quiz attempt to database"""
    # Save to database
    # Return result

# src/agents/tools/qdrant_tools.py
@function_tool
def search_vector_db(query: str, section_id: str = None) -> list[str]:
    """Search Qdrant for relevant content"""
    # Create embedding from query
    # Search Qdrant
    # Return matching sections

@function_tool
def store_embeddings(section_id: str, content: str) -> str:
    """Store section embeddings in Qdrant"""
    # Create embedding
    # Store in Qdrant
    # Return vector_id

# src/agents/tools/pdf_tools.py
@function_tool
def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF file"""
    # Use PyPDF2 or similar
    # Return text content
```

---

## Database Models (Created by Agents)

Agents don't directly write Python - they output structured JSON that gets saved:

```python
# These are what agents produce (as Pydantic models)

class Class(BaseModel):
    id: str
    title: str
    description: str
    teacher_id: str  # Can be dummy initially
    created_at: datetime

class Chapter(BaseModel):
    id: str
    class_id: str
    title: str
    description: str
    order_index: int

class Section(BaseModel):
    id: str
    chapter_id: str
    title: str
    content: str  # Full text content
    key_points: list[str]
    estimated_duration: int
    difficulty: str
    embedding_id: str  # Reference to Qdrant vector
    
class Quiz(BaseModel):
    id: str
    section_id: str
    title: str
    
class QuizQuestion(BaseModel):
    id: str
    quiz_id: str
    question: str
    options: list[str]  # For MCQ
    correct_answer: str
    explanation: str
    difficulty: str
    embedding_id: str  # For semantic search
    
class StudentProgress(BaseModel):
    id: str
    student_id: str
    section_id: str
    status: str  # "not_started", "in_progress", "completed"
    quiz_score: float
    completed_at: datetime
```

---

## API Endpoints (Agent-Driven)

```python
# routes/pdf.py
@router.post("/pdf/upload")
async def upload_pdf(file: UploadFile, class_title: str, level: str):
    """
    Trigger PDF_PARSER_AGENT to:
    1. Extract text from PDF
    2. Generate course structure
    3. Save to database
    4. Generate embeddings
    """
    pdf_content = extract pdf...
    result = await pdf_parser_agent.run({
        "pdf_content": pdf_content,
        "subject": class_title,
        "level": level
    })
    return result  # ClassStructure with all chapters/sections

# routes/chat.py
@router.post("/chat/message")
async def chat_message(class_id: str, message: str, session_id: str):
    """
    Send message to TUTOR_AGENT
    """
    result = await tutor_agent.run({
        "section_id": session.current_section_id,
        "student_message": message,
        "session_history": get_session_history(session_id),
    })
    return result  # TutorResponse

# routes/quiz.py
@router.post("/quiz/submit")
async def submit_quiz(session_id: str, question_id: str, answer: str):
    """
    Send answer to QUIZ_AGENT
    """
    result = await quiz_agent.run({
        "section_id": session.current_section_id,
        "question_id": question_id,
        "student_answer": answer,
    })
    return result  # QuizResponse

# routes/learning.py
@router.post("/class/{class_id}/session/start")
async def start_session(class_id: str, student_id: str):
    """
    Trigger ORCHESTRATOR_AGENT to start learning
    """
    result = await orchestrator_agent.run({
        "class_id": class_id,
        "student_id": student_id,
        "current_action": "start",
    })
    return result  # OrchestrationDecision → First action
```

---

## Implementation Phases

### Phase 1: Core Agent Setup
- [ ] Create Agent base classes
- [ ] Define all tool functions (without implementation)
- [ ] Setup OpenAI Agents SDK integration
- [ ] Create Pydantic output models

### Phase 2: PDF Parser Agent
- [ ] Implement PDF extraction tool
- [ ] Implement database save tool
- [ ] Implement embedding generation tool
- [ ] Test agent end-to-end

### Phase 3: Database & Tools
- [ ] Implement all database tools
- [ ] Implement Qdrant tools
- [ ] Setup database models in SQLAlchemy

### Phase 4: Tutor & Quiz Agents
- [ ] Implement Tutor Agent
- [ ] Implement Quiz Agent
- [ ] Test conversation flow

### Phase 5: Orchestrator Agent
- [ ] Implement Orchestrator Agent
- [ ] Test agent delegation
- [ ] Test complete learning flow

### Phase 6: API Integration
- [ ] Create FastAPI routes
- [ ] Connect agents to routes
- [ ] Test end-to-end

---

## Key Design Decisions

✅ **Agents only generate content** - No Python code directly creates lessons
✅ **Structured outputs** - All agents output Pydantic models (JSON)
✅ **Tools for everything** - Agents interact with DB/Qdrant via function tools
✅ **No auth initially** - Everyone accesses everything (demo mode)
✅ **Agent delegation** - Orchestrator calls other agents as tools
✅ **RAG for teaching** - Tutor searches Qdrant for relevant content
✅ **Adaptive paths** - Orchestrator decides next steps based on performance

---

## Next Steps

1. Review this architecture
2. Discuss any changes/improvements
3. Start Phase 1: Create agent base structures
4. Implement tool functions
5. Build and test each agent

---

**Status**: ✅ Architecture designed, ready to discuss and implement
