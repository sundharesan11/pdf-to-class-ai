# Phase 1 - Quick Start Guide

## What You Have

A complete Python backend scaffolding for an AI-powered educational system using OpenAI Agents SDK.

## File Overview

### Core Files

**config.py** - Environment configuration
- OpenAI, Database, Qdrant settings
- Agent tuning parameters
- API settings

**models.py** - Pydantic schemas (ALL AGENT OUTPUTS)
- ClassStructure (PDF Parser output)
- TutorResponse (Tutor output)
- QuizResponse (Quiz output)
- OrchestrationDecision (Orchestrator output)
- Support models: Section, Chapter, ChatMessage, StudentProgress, etc.

**main.py** - FastAPI application
- Initialize app
- Health checks
- CORS setup

### Agents (agents/)

Each agent is a separate module with one main function:

**pdf_parser.py**
- `get_pdf_parser_agent()` - Returns Agent for PDF parsing
- Takes: PDF text, subject, level
- Returns: ClassStructure (course with chapters/sections)
- Tools: extract_text, save to DB, generate embeddings

**tutor.py**
- `get_tutor_agent()` - Returns Agent for teaching
- Takes: Student message, section content, chat history
- Returns: TutorResponse (explanation, examples, questions)
- Tools: get section, search vector DB (RAG), save messages

**quiz.py**
- `get_quiz_agent()` - Returns Agent for evaluation
- Takes: Question, student answer, difficulty
- Returns: QuizResponse (correct/incorrect, feedback, next difficulty)
- Tools: search content, check answers, save attempts

**orchestrator.py**
- `get_orchestrator_agent()` - Returns Agent for flow control
- Takes: Session state, progress
- Returns: OrchestrationDecision (teach, quiz, review, next section)
- Tools: get course structure, check progress, manage sessions

### Tools (tools/)

**Stubs created** - implementation in Phase 2

**pdf_tools.py** (2 tools)
- extract_text_from_pdf()
- extract_pdf_with_path()

**database_tools.py** (11 tools)
- save_class_to_db()
- get_section_content()
- save_chat_message()
- save_quiz_attempt()
- etc.

**qdrant_tools.py** (6 tools)
- generate_embedding()
- store_embeddings()
- search_vector_db() ← Key for RAG
- etc.

### Routes (routes/)

**pdf.py**
- POST /pdf/upload - Upload and parse PDF
- GET /pdf/{class_id}/structure - Get course structure

**chat.py**
- POST /chat/message - Send message to tutor
- GET /chat/{session_id}/history - Get conversation

**quiz.py**
- POST /quiz/submit - Submit answer
- GET /quiz/{session_id}/questions - Get questions

**learning.py**
- POST /learning/session/start - Start session
- GET /learning/session/{session_id} - Get session
- POST /learning/session/{session_id}/next - Get next action

## How It Works

### 1. Teacher uploads PDF
```
POST /pdf/upload (PDF file)
  ↓
PDF Parser Agent:
  - Extract text from PDF
  - Analyze and structure content
  - Save to database
  - Generate embeddings
  ↓
Returns: ClassStructure with chapters/sections
```

### 2. Student starts learning
```
POST /learning/session/start
  ↓
Orchestrator Agent:
  - Get course structure
  - Check progress
  - Decide: "Teach section 1"
  ↓
Returns: OrchestrationDecision
```

### 3. Student learns
```
POST /chat/message ("I don't understand X")
  ↓
Tutor Agent:
  - Search Qdrant for relevant content (RAG)
  - Generate explanation with examples
  - Ask follow-up questions
  ↓
Returns: TutorResponse with explanation + examples + questions
```

### 4. Student takes quiz
```
POST /quiz/submit (answer)
  ↓
Quiz Agent:
  - Evaluate correctness
  - Provide feedback
  - Adapt difficulty
  - Save progress
  ↓
Returns: QuizResponse with correctness + explanation + next steps
```

### 5. Orchestrator decides next
```
POST /learning/session/{session_id}/next
  ↓
Orchestrator Agent:
  - Check quiz score
  - Decide: review, next section, or quiz again
  ↓
Returns: OrchestrationDecision with next action
```

## Agent SDK Key Concepts

### Creating an Agent
```python
from agents import Agent

agent = Agent(
    name="My Agent",
    instructions="You are...",  # The prompt/system message
    tools=[tool1, tool2, ...],   # Functions agent can call
    output_type=MyModel,          # Pydantic model for structured output
    model_config={"model": "gpt-4o-mini"}
)
```

### Tools
```python
from agents import function_tool

@function_tool
def my_tool(param1: str) -> str:
    """
    Tool description (shown to agent).
    
    Args:
        param1: Parameter description (shown to agent)
    """
    # Implementation
    return result
```

### Running an Agent
```python
from agents import Runner

result = await Runner.run(agent, "User input here")
output = result.final_output  # The agent's response
```

## Key Files to Understand

1. **models.py** - Start here to understand outputs
2. **agents/pdf_parser.py** - Simplest agent, shows pattern
3. **agents/tutor.py** - Most complex (RAG + Socratic method)
4. **tools/database_tools.py** - List of what database needs to do
5. **tools/qdrant_tools.py** - List of what vector DB needs to do

## Next Steps: Phase 2

### What to implement:

1. **Database Models** (SQLAlchemy ORM)
   - Class, Chapter, Section
   - Quiz, QuizQuestion
   - StudentProgress
   - LearningSession
   - ChatHistory

2. **Database Tools** - Implement the stubs
   - save_class_to_db()
   - get_section_content()
   - save_chat_message()
   - etc.

3. **Qdrant Integration**
   - Initialize client
   - Implement search_vector_db() (RAG)
   - Implement store_embeddings()

4. **PDF Tools**
   - Implement extract_text_from_pdf()

5. **Test End-to-End**
   - Upload sample PDF
   - Check course structure
   - Test tutor chat
   - Test quiz flow

## Testing Tips

### Test a single agent:
```python
from agents import Runner
from src.agents.pdf_parser import get_pdf_parser_agent

agent = get_pdf_parser_agent()
result = await Runner.run(agent, {
    "pdf_content": "...",
    "subject": "Biology",
    "level": "beginner"
})
```

### Test tool function:
```python
from src.tools.database_tools import save_class_to_db

result = save_class_to_db(class_structure)
print(result)
```

## Important Notes

✅ **Agents = Logic Orchestrators**
- They decide what to do
- They think and reason
- They choose which tools to use
- They output structured responses

✅ **Tools = Side Effect Executors**
- Database operations
- API calls
- File processing
- External system interactions

✅ **Structured Output**
- All agents return Pydantic models (JSON)
- Type-safe and validated
- Easy to consume in frontend

✅ **OpenAI Agents SDK**
- Lightweight and simple
- Automatic tool calling
- Built-in loop handling
- Structured outputs via OpenAI's feature

## Common Patterns

### Tool that saves to DB:
```python
@function_tool
def save_thing(data: MyModel) -> dict:
    """Save to database."""
    db_record = create_record(data)
    return {"id": db_record.id, "status": "saved"}
```

### Tool that queries DB:
```python
@function_tool
def get_thing(id: str) -> Optional[MyModel]:
    """Get from database."""
    record = query_database(id)
    return record
```

### Agent using tools:
```python
agent = Agent(
    name="Processor",
    instructions="Use get_thing to retrieve, then save_thing to store",
    tools=[get_thing, save_thing],
    output_type=OutputModel
)
```

## Helpful References

- OpenAI Agents SDK: https://openai.github.io/openai-agents-python/
- Pydantic: https://docs.pydantic.dev/
- FastAPI: https://fastapi.tiangolo.com/
- SQLAlchemy: https://docs.sqlalchemy.org/

---

**Status**: Phase 1 Complete ✅
**Next**: Phase 2 - Database & Tools (2-3 hours)
