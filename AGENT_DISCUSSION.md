# Agent Architecture Discussion

## Key Questions & Design Choices

### 1. Agent as Tools vs Handoffs

**Our Choice**: Agents as Tools (Manager Pattern)

```python
# Pattern: Orchestrator calls others as tools
orchestrator = Agent(
    tools=[
        tutor_agent.as_tool(),
        quiz_agent.as_tool(),
        database_tools,
        qdrant_tools,
    ]
)
```

**Why?**
- Orchestrator maintains control over the flow
- Easier to implement decision logic
- Clear separation of concerns
- Simpler to test

**Alternative** (Handoffs):
- Agents hand off to each other
- More decentralized
- Harder to control overall flow

**Decision**: Go with **Agents as Tools** ✅

---

### 2. Content Creation - Agent-Driven Only

**Our Choice**: Agents generate all content, no Python functions

**Example: PDF Upload Flow**
```
User uploads Biology.pdf
  ↓
PDF_PARSER_AGENT runs
  ↓
Agent uses tools:
  - extract_text_from_pdf()        # Python function tool
  - save_class_to_db()             # Python function tool
  - generate_embeddings()           # Python function tool
  ↓
Agent WRITES THE INSTRUCTIONS for the content:
  "This chapter covers photosynthesis..."
  ✅ Agent generated this, not Python code
  ↓
Database + Qdrant populated
```

**vs Wrong Approach**:
```
Python code directly:
  - pdf.split_into_chapters()  ❌ Avoid
  - chapter.create_sections()  ❌ Avoid
  - quiz.generate_questions()  ❌ Avoid
```

**Decision**: Agents only write content (text), tools do DB operations ✅

---

### 3. Demo Mode - No Auth

**Current Setup**: Anyone can:
- Create classes (as teacher)
- Upload PDFs
- Access all classes
- Be a student in any class
- See all content in Qdrant

**Why?**
- Faster development
- Focus on agents first
- Add auth later
- Simpler testing

**Data Flow**:
```
POST /pdf/upload          (anyone can upload)
  → Creates class in DB
  → Creates chapters/sections
  → All students can see it

POST /chat/message        (student sends message)
  → All students see same chat
  → No permission checking
  → RAG queries Qdrant (same for all)
```

**Will add auth later** when core agents work

**Decision**: No auth initially ✅

---

### 4. Session Management

**Question**: How do we track "current student" in learning flow?

**Current Design**:
```python
# Session contains student context
session = {
    "session_id": "...",
    "student_id": "...",      # Can be dummy/test
    "class_id": "...",
    "current_section_id": "...",
    "chat_history": [...],
    "quiz_score": 0.8,
}

# Orchestrator uses session to decide next step
orchestrator.run({
    "session_id": session_id,
    "class_id": session["class_id"],
    "student_id": session["student_id"],
    "current_action": "teach",
    "last_quiz_score": session["quiz_score"],
})
```

**Should we**:
- [ ] A) Store session in memory (simple, lose on restart)
- [ ] B) Store in database (persistent, more complex)
- [ ] C) Send session in each API call (stateless)

**Recommendation**: Option C (Stateless)
- Frontend maintains session
- Each API call includes session_id
- Database looks up session if needed
- Simplest for now

---

### 5. Agent Output Types

**Question**: Should agents always return Pydantic models or sometimes strings?

**Comparison**:

```python
# Option A: Always structured (Pydantic)
class TutorResponse(BaseModel):
    explanation: str
    examples: list[str]
    follow_up_questions: list[str]

tutor = Agent(output_type=TutorResponse)
result = await tutor.run(...)  # Returns TutorResponse object

# Pros: Structured, type-safe, easy to parse
# Cons: More restrictive, agent must follow schema
```

```python
# Option B: Return string, parse in API
tutor = Agent()  # No output_type
result = await tutor.run(...)  # Returns string (markdown)

# Parse in route:
parsed = json.loads(result)  # Hope it's JSON
# Or extract from markdown

# Pros: More flexible for agent
# Cons: Parsing errors, type unsafe
```

**Recommendation**: Option A (Pydantic models)
- Agents support structured outputs (OpenAI feature)
- Type safe
- Easy API response serialization
- Clearer contracts

---

### 6. Qdrant vs Traditional Search

**Question**: Should tutoring agent use Qdrant for everything?

**Design**:

```python
# When student asks: "Explain photosynthesis"
@function_tool
def search_vector_db(query: str, section_id: str = None):
    """
    Create embedding of query
    Search Qdrant for similar sections
    Return top-N matching sections
    """
    embedding = create_embedding(query)
    results = qdrant_client.search(
        collection_name="course_content",
        query_vector=embedding,
        limit=3
    )
    return [r.payload['content'] for r in results]
```

**Flow**:
```
Student: "What is photosynthesis?"
  ↓
Tutor Agent calls search_vector_db()
  ↓
Qdrant returns 3 most relevant sections
  ↓
Agent generates explanation using those sections as context
```

**Why Qdrant?**
- Semantic search (understands meaning, not just keywords)
- Handles variations ("How does photosynthesis work?" vs "Explain photosynthesis")
- Better for teaching (find explanations by meaning)
- Scale as content grows

**When to use traditional DB?**
- Getting specific section/chapter by ID
- Getting student progress
- Checking quiz answers

---

### 7. Adaptive Difficulty

**Question**: How should orchestrator adapt difficulty?

**Current Design**:
```python
# Quiz agent outputs difficulty recommendation
class QuizResponse(BaseModel):
    is_correct: bool
    adaptive_difficulty: str  # "easier", "same", "harder"

# Orchestrator uses this for next question
orchestrator decides:
  "Student got 85% → Keep same difficulty"
  "Student got 40% → Go to easier"
  "Student got 100% → Try harder"
```

**Should we**:
- [ ] A) Adjust difficulty after each question (too aggressive)
- [ ] B) Adjust after completing section quiz (balanced)
- [ ] C) Manual difficulty selection (no adaptation)

**Recommendation**: Option B
- Quiz agent evaluates overall performance on section
- Recommends next section difficulty
- Smooth experience, not too jarring

---

### 8. Initial Quiz vs No Quiz

**Question**: Should we test knowledge before teaching?

**Design**:

```python
# Option A: Diagnostic quiz first
Orchestrator → Quiz Agent (diagnostic)
  → If score > 80%: Skip to next section
  → If score < 80%: Teach with adjusted difficulty
  
# Option B: Just teach first
Orchestrator → Tutor Agent (teach)
  → Then Quiz Agent
```

**Recommendation**: Option B (simpler initially)
- Don't complicate first version
- Just teach → quiz → decide
- Add diagnostic testing later if needed

---

### 9. Streaming Responses

**Question**: Should agent responses stream to frontend?

**Current Design**: Full response after completion
```python
@router.post("/chat/message")
async def chat(message: str):
    result = await tutor_agent.run(...)
    return result  # Full response
```

**With Streaming**: Stream response as it's generated
```python
@router.post("/chat/message")
async def chat(message: str):
    async for event in tutor_agent.stream(...):
        yield event  # Send to frontend
```

**Recommendation**: Start without streaming
- Simpler implementation
- Add streaming later if needed
- OpenAI SDK supports both

---

### 10. Conversation Context

**Question**: How much history should agents see?

**Design**:
```python
# Option A: Full history every time
session.chat_history = [
    {"role": "student", "content": "What is photosynthesis?"},
    {"role": "tutor", "content": "It's..."},
    ...
]
# Use full history in each agent call

# Option B: Just recent context
recent = session.chat_history[-10:]  # Last 10 messages
# Use for context, but not full history
```

**Recommendation**: Recent context (Option B)
- Avoid token overload
- Keep conversations focused
- Recent context most relevant
- Can summarize old context if needed

---

## Summary of Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Agent pattern | Agents as Tools | Control + simplicity |
| Content creation | Agent-driven only | No Python code writes content |
| Auth | None (demo mode) | Focus on agents first |
| Session management | Stateless (frontend sent) | Simplest |
| Agent output | Structured (Pydantic) | Type-safe |
| Vector search | Qdrant for everything | Semantic search |
| Adaptive difficulty | After section quiz | Balanced |
| Initial testing | No diagnostic | Keep it simple |
| Streaming | No (initially) | Simpler first |
| Context window | Recent messages only | Token efficient |

---

## Ready to Implement?

1. **Agree on decisions above?** ✅
2. **Any changes?** Let me know
3. **Ready to code?** Let's start Phase 1!

---

## Next: Phase 1 Implementation

Once approved, we'll create:
- Agent base class
- Tool function signatures
- Pydantic models
- FastAPI route stubs
- Database setup

**Estimated time**: 2-3 hours setup, ready to build agents
