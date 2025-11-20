# Agent Implementation - Starting Point

## What You've Just Read

✅ **AGENT_ARCHITECTURE.md** - Detailed specs of each agent, inputs/outputs, tools
✅ **AGENT_DISCUSSION.md** - Design decisions and trade-offs
✅ **AGENT_SUMMARY.md** - High-level overview of all 4 agents
✅ **AGENT_FLOW_DIAGRAMS.md** - Visual flows of each process

## Key Takeaways

### 4 Core Agents
1. **PDF_PARSER** - Converts PDF to course structure (chapters/sections)
2. **TUTOR** - Teaches with RAG (searches Qdrant for relevant content)
3. **QUIZ** - Tests student and provides feedback
4. **ORCHESTRATOR** - Manages flow, decides what happens next

### Core Principles
- ✅ Agents generate all content, tools execute operations
- ✅ All output is structured (Pydantic models → JSON)
- ✅ No authentication initially (demo mode)
- ✅ RAG teaching (Qdrant semantic search)
- ✅ Agents call other agents via tools

### Tech Stack
- **Framework**: OpenAI Agents SDK (Python)
- **Web**: FastAPI
- **Database**: PostgreSQL + SQLAlchemy
- **Vector DB**: Qdrant
- **LLM**: OpenAI gpt-4o-mini

## Questions for You

Before we start coding, clarify:

1. **Output Format**: Should we always use Pydantic models or allow flexibility?
   - Recommend: Always Pydantic (structured)

2. **Session State**: Where do we store session data?
   - Recommend: In database, referenced by session_id

3. **Conversation Memory**: How much history in each agent call?
   - Recommend: Last 10 messages (not full history)

4. **Error Handling**: What if agent fails?
   - Recommend: Return error message, let frontend retry

5. **Testing**: Should we build offline test mode first?
   - Recommend: Yes, mock agents without API calls

## Ready to Build?

### Phase 1 (Immediate) - ~2-3 hours

Create the foundation:

```
src/
├── main.py                 # FastAPI app
├── config.py              # Settings
├── models.py              # SQLAlchemy models + Pydantic schemas
├── agents/
│   ├── __init__.py
│   ├── base_agent.py      # Base agent class (if needed)
│   ├── pdf_parser.py      # PDF parser agent definition
│   ├── tutor.py           # Tutor agent definition
│   ├── quiz.py            # Quiz agent definition
│   └── orchestrator.py    # Orchestrator agent definition
├── tools/
│   ├── __init__.py
│   ├── database_tools.py  # DB operation functions
│   ├── qdrant_tools.py    # Vector DB functions
│   └── pdf_tools.py       # PDF extraction functions
├── db/
│   ├── __init__.py
│   └── database.py        # SQLAlchemy setup
└── routes/
    ├── __init__.py
    ├── pdf.py             # PDF upload route
    ├── chat.py            # Chat route
    ├── quiz.py            # Quiz route
    └── learning.py        # Learning session routes
```

### What to Start With

**Option A: Hands-on**
1. Create venv and install requirements
2. Build database models first
3. Create tool function signatures (without implementation)
4. Build PDF parser agent
5. Test with sample PDF

**Option B: Discuss First**
1. Review architecture one more time
2. Ask any questions
3. Discuss any changes
4. Then start coding

## Suggested Next Steps

### Immediate (Next 30 min)
- [ ] Review AGENT_ARCHITECTURE.md carefully
- [ ] Ask any questions about design
- [ ] Confirm all 4 agents as specified
- [ ] Confirm tool-based approach

### Then (Start coding)
- [ ] Create Python venv in apps/api
- [ ] Create src/ directory structure
- [ ] Create models.py with all Pydantic schemas
- [ ] Create tools/ with function stubs
- [ ] Create first agent (PDF Parser)

### After Phase 1
- Build database tools
- Build Qdrant tools
- Test PDF parser end-to-end
- Move to Phase 2 (Tutor + Quiz)

## Key Files in Order of Importance

1. **AGENT_ARCHITECTURE.md** - Technical specifications (most important)
2. **AGENT_FLOW_DIAGRAMS.md** - Visual understanding
3. **AGENT_DISCUSSION.md** - Design decisions
4. **AGENT_SUMMARY.md** - Quick reference

## Code Examples (Coming in Phase 1)

Once we start, you'll write code like:

```python
# agents/pdf_parser.py
from openai_agents_sdk import Agent, function_tool
from tools.pdf_tools import extract_text_from_pdf
from tools.database_tools import save_class_to_db
from tools.qdrant_tools import generate_and_store_embeddings

pdf_parser_agent = Agent(
    name="PDFParserAgent",
    instructions="""You are an expert curriculum designer...
    Analyze the PDF content and create a structured course.
    Use your tools to save the course and generate embeddings.""",
    tools=[
        extract_text_from_pdf,
        save_class_to_db,
        generate_and_store_embeddings,
    ],
    output_type=ClassStructure,  # Pydantic model
)
```

```python
# routes/pdf.py
from fastapi import FastAPI, UploadFile, File
from agents.pdf_parser import pdf_parser_agent

@router.post("/pdf/upload")
async def upload_pdf(file: UploadFile):
    pdf_content = await file.read()
    result = await pdf_parser_agent.run({
        "pdf_content": pdf_content.decode(),
        "subject": file.filename,
        "level": "beginner"
    })
    return result
```

## Common Pitfalls to Avoid

❌ **Don't**: Have agents write Python code directly
✅ **Do**: Have agents output structured JSON, tools handle DB ops

❌ **Don't**: Store full conversation history in memory
✅ **Do**: Store in database, load recent messages for context

❌ **Don't**: Try to do auth from the start
✅ **Do**: Skip auth initially, add it later

❌ **Don't**: Have agents handoff to each other
✅ **Do**: Have orchestrator call other agents as tools

❌ **Don't**: Return plain text from agents
✅ **Do**: Use Pydantic models (structured output)

## Timeline

- **Phase 1 Setup**: 2-3 hours (today)
- **Phase 2 PDF Parser**: 4-6 hours
- **Phase 3 DB + Tools**: 2-3 hours
- **Phase 4 Tutor + Quiz**: 4-6 hours
- **Phase 5 Orchestrator**: 2-3 hours
- **Phase 6 API Routes**: 2-3 hours

**Total**: ~16-24 hours to working system

## You're All Set!

Everything is planned. Now let's code.

---

## Phase 1 Status

**✅ COMPLETE**

Phase 1 has been fully implemented. See `PHASE_1_IMPLEMENTATION.md` for details.

What was created:
- ✅ src/ directory structure with agents, tools, routes, db modules
- ✅ Pydantic models for all agent outputs
- ✅ 4 agent definitions with OpenAI Agents SDK
- ✅ 17 tool stubs with docstrings
- ✅ 4 API route modules
- ✅ Configuration system
- ✅ Main FastAPI app
- ✅ Database initialization

Ready for Phase 2: Database tools implementation

---

**Status**: ✅ Phase 1 complete
**Next**: Phase 2 - Implement database models and tools
