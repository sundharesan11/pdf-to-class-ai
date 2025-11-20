# Agentic AI Tutor - Refined Planning Document

## Overview

This document refines the vision for building an **agentic AI tutor system** that actively drives learning experiences, not just responds to queries. The system uses a multi-agent architecture with OpenAI Agents SDK, Qdrant for vector storage, and PostgreSQL for structured data.

---

## Core Vision

### What Makes This "Agentic"?

Unlike traditional chatbots that **react** to student questions, this system **proactively drives** the learning experience:

1. **Agent Initiates**: The agent starts conversations, introduces topics, and guides pacing
2. **Agent Assesses**: Continuously evaluates understanding through questions and quizzes
3. **Agent Adapts**: Adjusts difficulty, depth, and teaching style based on student responses
4. **Agent Decides**: Determines when to move forward, review, or provide additional practice
5. **Agent Orchestrates**: Coordinates multiple specialized agents to deliver a cohesive learning experience

### Key Principle: The Agent is the Teacher

The student doesn't drive the session by asking "teach me X" - the agent says:
- "Let's start with photosynthesis. Here's what you need to know..."
- "You're doing great! Let me ask you a question to check understanding..."
- "I notice you're struggling with this concept. Let's try a different approach..."
- "Perfect! You've mastered this section. Ready for the next challenge?"

---

## Refined Architecture

### Multi-Agent System

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR AGENT                           │
│                  (Session Coordinator)                          │
│                                                                 │
│  Role: Drives the entire learning session                      │
│  - Initiates lesson                                            │
│  - Decides when to teach, quiz, review                         │
│  - Monitors student progress                                   │
│  - Adapts learning path in real-time                          │
│  - Maintains session state                                     │
└─────────────────────────────────────────────────────────────────┘
                            |
          ┌─────────────────┼─────────────────┬─────────────────┐
          ▼                 ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐    ┌──────────┐
    │  TUTOR   │      │   QUIZ   │      │ CONTENT  │    │   WEB    │
    │  AGENT   │      │  AGENT   │      │GENERATOR │    │ SEARCH   │
    └──────────┘      └──────────┘      └──────────┘    └──────────┘
         |                 |                 |                 |
         └─────────────────┴─────────────────┴─────────────────┘
                            |
                ┌───────────┴──────────┐
                ▼                      ▼
         ┌──────────────┐       ┌──────────────┐
         │   QDRANT     │       │  POSTGRESQL  │
         │  (Vectors)   │       │  (Structured)│
         └──────────────┘       └──────────────┘
```

### Agent Responsibilities

#### 1. **Orchestrator Agent** (Main Driver)
**Purpose**: Drives the entire learning session like a real teacher would

**Capabilities**:
- Initiates learning sessions
- Decides the flow: teach → assess → adapt → continue
- Monitors student engagement and comprehension
- Makes real-time decisions about pacing
- Coordinates other agents
- Maintains conversation context
- Recognizes when student needs help vs. when to push forward

**Example Flow**:
```
Orchestrator: "Welcome! Today we're learning about Photosynthesis.
               Let's start with the basics..."
  ↓ [delegates to Tutor Agent]
Tutor: [Teaches the concept]
  ↓
Orchestrator: "Great! Now let me check your understanding..."
  ↓ [delegates to Quiz Agent]
Quiz: [Asks a question]
  ↓
Student: [Answers]
  ↓
Orchestrator: [Analyzes answer, decides next step]
  - If correct (80%+): "Excellent! Let's move to chloroplasts..."
  - If partial (60-79%): "Good try! Let me clarify..."
  - If wrong (<60%): "Let's review that concept differently..."
```

#### 2. **Tutor Agent** (RAG-Powered Teacher)
**Purpose**: Explains concepts using content from vector DB and external sources

**Capabilities**:
- Retrieves relevant content from Qdrant (PDF sections, previous lessons)
- Generates clear, engaging explanations
- Provides examples from the course material
- Adapts language complexity to student level
- Answers student questions with context
- Uses external web search when PDF content insufficient
- Cites sources ("According to the textbook..." vs "Based on external research...")

**Knowledge Sources**:
```
Priority 1: Course PDF (stored in Qdrant)
  ↓
Priority 2: Related sections in same course
  ↓
Priority 3: Web search for supplementary info
```

**Example**:
```
Student: "I don't understand how chloroplasts work"
  ↓
Tutor Agent:
  1. Searches Qdrant for "chloroplast" content from PDF
  2. Retrieves relevant section: "Chloroplasts Chapter 2.3"
  3. Generates explanation using PDF content
  4. If PDF lacks detail → Triggers web search tool
  5. Responds: "Based on your textbook (Chapter 2.3), chloroplasts are..."
              [If web search used]: "For more detail, current research shows..."
```

#### 3. **Quiz Agent** (Assessment Specialist)
**Purpose**: Evaluates understanding and provides feedback

**Capabilities**:
- Generates questions from course content
- Evaluates open-ended and multiple-choice answers
- Provides constructive feedback
- Gives hints without revealing answers
- Adapts difficulty based on performance
- Tracks mastery level

**Adaptive Behavior**:
```
Student answers 3 questions correctly in a row
  ↓
Quiz Agent: Increases difficulty, asks deeper questions

Student struggles with 2 questions
  ↓
Quiz Agent: Simplifies, breaks down into smaller concepts
```

#### 4. **Content Generator Agent** (Dynamic Content Creator)
**Purpose**: Creates quizzes, summaries, and practice materials

**Capabilities**:
- Generates quiz questions from PDF sections
- Creates summaries of complex topics
- Develops practice exercises
- Produces hints and scaffolding questions

#### 5. **Web Search Agent** (External Knowledge)
**Purpose**: Fetches supplementary information from the internet

**Capabilities**:
- Searches for related concepts when PDF lacks depth
- Finds real-world examples and applications
- Retrieves latest research or news (e.g., "recent discoveries in photosynthesis")
- Always cites that information is from external sources

---

## Learning Session Flow (Agentic Behavior)

### Phase 1: Session Initiation
```
Student: Enters classroom

Orchestrator Agent:
  1. Gets course structure from DB
  2. Checks student's progress
  3. Determines starting point
  4. INITIATES conversation:
     "Welcome back! Last time you learned about [X].
      Today we're covering [Y]. Ready to start?"
```

### Phase 2: Teaching Phase
```
Orchestrator: Decides to teach Section 2.1

Tutor Agent (RAG-enabled):
  1. Retrieves Section 2.1 content from Qdrant
  2. Searches for related concepts
  3. Presents lesson:
     "Let's understand photosynthesis. Here's what happens..."
  4. Explains key points
  5. Provides examples from PDF
  6. Asks probing questions:
     "What do you think happens to the oxygen?"

Student: [Answers or asks questions]

Tutor Agent:
  - If student asks question:
    → Searches Qdrant for relevant content
    → If insufficient, uses web search
    → Responds with sourced information
  - If student seems confused:
    → Adjusts explanation depth
    → Provides simpler examples
  - If student ready:
    → Signals to Orchestrator: "Ready for assessment"
```

### Phase 3: Assessment Phase
```
Orchestrator: Decides student ready for quiz

Quiz Agent:
  1. Retrieves or generates quiz questions
  2. Asks question:
     "Which molecule captures light energy in photosynthesis?"
  3. Student answers
  4. Evaluates answer
  5. Provides feedback:
     - Correct: "Excellent! You understand the role of chlorophyll"
     - Incorrect: "Not quite. Think about what we just discussed..."
  6. Adapts difficulty for next question
```

### Phase 4: Decision Phase
```
Orchestrator: Analyzes quiz results

Decision Logic:
  - Score >= 80%:
    → "You've mastered this! Let's move to [next section]"
  - Score 60-79%:
    → "Good progress. Let me clarify one more thing..."
  - Score < 60%:
    → "Let's review this concept with a different approach"
    → Delegates back to Tutor with "simplify" instruction

Orchestrator: Maintains momentum, keeps student engaged
```

### Phase 5: Adaptive Continuation
```
Orchestrator: Monitors session continuously

Adaptive Behaviors:
  - Student answering quickly → Increase pace
  - Student taking long pauses → Slow down, offer help
  - Student asking many questions → Provide more detail
  - Student seems frustrated → Change teaching approach
  - Student mastering quickly → Introduce challenge material
```

---

## Key Features & Innovations

### 1. Proactive Teaching (Not Reactive)
- Agent initiates topics, doesn't wait for student to ask
- Agent maintains lesson structure and pacing
- Agent recognizes when to move forward vs. review

### 2. RAG-Powered Knowledge (Qdrant)
- All PDF content vectorized and stored in Qdrant
- Semantic search for relevant sections
- Maintains context across conversations
- Fast retrieval of related concepts

**Vector Collections**:
```
course_content:
  - Each section/paragraph from PDF
  - Metadata: class_id, chapter, section, page
  - Used for teaching and answering questions

quiz_bank:
  - Generated quiz questions
  - Metadata: difficulty, topic, concept
  - Used for adaptive assessments

conversation_history:
  - Student chat history
  - Used for personalization
```

### 3. Multi-Source Knowledge Retrieval
```
Student asks: "How does photosynthesis relate to climate change?"

Tutor Agent:
  1. Searches Qdrant for "photosynthesis climate" in course PDF
  2. If insufficient:
     → Calls Web Search tool
     → Searches: "photosynthesis role in climate change"
  3. Synthesizes response:
     "According to your textbook, photosynthesis removes CO2...
      [Source: Course PDF, Chapter 3]

      Recent studies also show that ocean photosynthesis...
      [Source: External research - Nature.com]"
```

### 4. Adaptive Learning Paths
- Difficulty adjusts based on performance
- Pacing adapts to student engagement
- Teaching style varies (visual, textual, examples)
- Review automatically triggered when needed

### 5. Conversation Memory & Context
- Orchestrator maintains session state
- Agents remember what was taught
- References previous interactions:
  "Remember when we discussed chloroplasts? This builds on that..."

---

## Technical Implementation

### Technology Stack

**Backend**:
- FastAPI (Python web framework)
- OpenAI Agents SDK (agentic behavior)
- PostgreSQL (structured data: users, classes, progress)
- Qdrant (vector storage: PDF content, conversations)
- SQLAlchemy ORM (database models)

**Frontend**:
- React + TypeScript (already built)
- Real-time chat interface
- Progress tracking UI

**AI/ML**:
- OpenAI GPT-4 (agent reasoning)
- OpenAI Embeddings (text-embedding-3-small for vectors)
- Web search integration (Tavily, SerpAPI, or similar)

### Database Schema

**PostgreSQL (Structured Data)**:
```sql
users            # Students and teachers
classes          # Course metadata
chapters         # Course structure
sections         # Learning units
quizzes          # Assessment data
quiz_attempts    # Student responses
progress         # Learning progress
chat_messages    # Conversation history
```

**Qdrant (Vector Data)**:
```
Collections:
  1. course_content
     - Vectors: PDF sections/paragraphs
     - Metadata: class_id, chapter_id, section_id, page_number
     - Use: RAG retrieval for teaching

  2. quiz_bank
     - Vectors: Question embeddings
     - Metadata: difficulty, topic, concept_tags
     - Use: Adaptive question selection

  3. conversation_context
     - Vectors: Chat history
     - Metadata: student_id, session_id, timestamp
     - Use: Personalization and context
```

### Agent Tools (Function Calling)

Each agent has access to specific tools:

**Orchestrator Tools**:
- `get_student_progress()` - Check what student has completed
- `get_session_state()` - Current session information
- `update_session_state()` - Track progress
- `delegate_to_tutor()` - Call Tutor Agent
- `delegate_to_quiz()` - Call Quiz Agent

**Tutor Tools**:
- `search_course_content(query)` - RAG search in Qdrant
- `get_section_content(section_id)` - Retrieve specific section
- `web_search(query)` - External knowledge retrieval
- `save_chat_message()` - Store conversation
- `get_related_concepts()` - Find connected topics

**Quiz Tools**:
- `generate_quiz_question(topic, difficulty)` - Create questions
- `evaluate_answer(question, student_answer)` - Grade response
- `get_quiz_questions(section_id)` - Retrieve existing quizzes
- `save_quiz_attempt()` - Log student performance
- `adjust_difficulty()` - Adaptive question selection

**Web Search Tool**:
- `search_web(query, max_results)` - External search
- Returns: List of relevant web snippets with sources
- Used when: PDF content insufficient or student asks beyond scope

---

## Conversation Examples

### Example 1: Proactive Teaching

```
[Student enters classroom]

ORCHESTRATOR: "Welcome back, Sarah! 🌟 Last session you learned about
               plant cells. Today, we're diving into photosynthesis -
               one of the most important processes in nature. Ready?"

STUDENT: "Yes!"

ORCHESTRATOR → TUTOR: [teach section "Introduction to Photosynthesis"]

TUTOR: "Great! Let's start with the basics. Photosynthesis is how
        plants make their own food using sunlight.

        According to your textbook (Chapter 4.1):
        🌞 Sunlight + Water + CO2 → Glucose + Oxygen

        Think of it like a recipe - plants combine these ingredients
        to create energy!

        Here's a key point: This happens in chloroplasts, which we
        studied last time. Remember those green structures?"

STUDENT: "Yes, I remember chloroplasts!"

TUTOR: "Perfect! You're connecting the concepts. Now, let me ask you:
        What do you think the plant does with the glucose it makes?"

STUDENT: "Uses it for energy?"

TUTOR: "Exactly right! 🎉 The plant uses glucose for energy and growth.
        Now you understand the basic purpose.

        Ready to learn about the two stages of photosynthesis?"

STUDENT: "Sure"

TUTOR: "Excellent! Photosynthesis has two main stages:

        1️⃣ Light-dependent reactions (need sunlight)
        2️⃣ Light-independent reactions (don't need direct sunlight)

        Let's focus on the first one..."

[Teaching continues...]

ORCHESTRATOR: [Monitors engagement, detects student is following well]

TUTOR: "You're doing great! I think you're ready for a quick check.
        Let me ask you a question to see how well you understand."

ORCHESTRATOR → QUIZ: [conduct assessment]

QUIZ: "Here's a question:

       In photosynthesis, what is the role of chlorophyll?

       A) Store water
       B) Capture light energy
       C) Release oxygen
       D) Create glucose"

STUDENT: "B"

QUIZ: "🎉 Excellent! You got it!

       Chlorophyll captures light energy, which is the first step
       in photosynthesis. You clearly understand how the process begins.

       Score: 100%"

ORCHESTRATOR: [Analyzes: Student scored 100%, understanding is solid]
              "Fantastic work, Sarah! You've mastered the introduction.
               Let's move on to the Light-dependent reactions in detail.
               This is where it gets really interesting!"

[Session continues with next section...]
```

### Example 2: Student Question with RAG + Web Search

```
[During teaching phase]

TUTOR: "...and that's how the Calvin cycle works."

STUDENT: "How does this relate to climate change?"

TUTOR: [Receives question]
       [Tool Call 1: search_course_content("photosynthesis climate change")]
       [Qdrant returns: Limited results, PDF mentions CO2 absorption briefly]

       [Tool Call 2: web_search("photosynthesis climate change carbon dioxide")]
       [Returns: Recent research articles]

       [Synthesizes response]:

       "Great question! Let me explain using both your course material
        and some current research.

        📚 From your textbook (Chapter 4.1):
        'Plants absorb CO2 during photosynthesis, removing it from
        the atmosphere.'

        🌍 Based on recent research (Source: NASA Climate):
        'Photosynthesis by plants and ocean organisms removes about
        30% of human-caused CO2 emissions each year. However,
        deforestation reduces this natural carbon sink.'

        So to answer your question: Photosynthesis fights climate change
        by removing CO2, but only if we protect our forests and oceans!

        Does that help connect the concepts?"

STUDENT: "Yes! That makes sense now."

TUTOR: "Excellent! This shows you're thinking beyond the textbook.
        That's exactly what we want. 🌟"
```

### Example 3: Struggling Student - Adaptive Response

```
QUIZ: "What are the products of photosynthesis?"

STUDENT: "Carbon dioxide and water"

QUIZ: [Evaluates: Incorrect - student has it backwards]
      [Score drops to 40%]

      "Not quite. I can see you're mixing up the inputs and outputs.

       💡 Hint: Think about what we discussed earlier.
       Plants TAKE IN carbon dioxide and water.
       What do they PRODUCE or GIVE OUT?

       Want to try again?"

STUDENT: "Glucose and oxygen?"

QUIZ: "Yes! Perfect! 🎉

       You got it:
       INPUT: CO2 + H2O + Sunlight
       OUTPUT: Glucose + O2

       Great recovery!"

ORCHESTRATOR: [Analyzes: Student struggled initially but recovered]
              [Decision: Provide reinforcement before moving on]

              "Good work correcting yourself! Let's make sure this
               sticks. Let me have the tutor review the equation
               one more time with a visual approach."

TUTOR: [Presents concept with different teaching method]
       "Let me show you a simple way to remember this:

        Plants are like factories:
        🏭 INPUT: Raw materials (CO2, H2O, Sunlight)
        ⚙️ PROCESS: Photosynthesis (in chloroplasts)
        📦 OUTPUT: Products (Glucose, O2)

        Think of it as:
        What goes IN → What comes OUT

        Does this visual help?"

STUDENT: "Yes! That's much clearer."

ORCHESTRATOR: [Decision: Student now understands, proceed with confidence]
              "Great! Now that you've got it, let's continue."
```

---

## Implementation Phases

### Phase 1: Foundation Setup (Week 1)
**Goal**: Get basic infrastructure running

**Tasks**:
- ✅ Setup Python backend structure (Already done in dev)
- ✅ Configure PostgreSQL and Qdrant via Docker (Already done)
- ✅ Create database models (Already done)
- ✅ Setup OpenAI Agents SDK
- [ ] Implement basic agent tools
- [ ] Test agent communication

**Deliverable**: Agents can be instantiated and call tools

---

### Phase 2: PDF Processing & Vector Storage (Week 1-2)
**Goal**: Ingest PDF content into the system

**Tasks**:
- [ ] Implement PDF text extraction
- [ ] Create chunking strategy for PDF content
- [ ] Generate embeddings using OpenAI
- [ ] Store vectors in Qdrant with metadata
- [ ] Test semantic search retrieval

**Deliverable**: Upload PDF → Content in Qdrant, searchable

---

### Phase 3: Tutor Agent with RAG (Week 2)
**Goal**: Build the teaching agent

**Tasks**:
- [ ] Implement Tutor Agent with RAG
- [ ] Connect to Qdrant for content retrieval
- [ ] Build web search tool integration
- [ ] Create response synthesis logic
- [ ] Test teaching conversations

**Deliverable**: Tutor can explain concepts using PDF + web

---

### Phase 4: Quiz Agent & Assessment (Week 2-3)
**Goal**: Build evaluation capabilities

**Tasks**:
- [ ] Implement Quiz Agent
- [ ] Build question generation from content
- [ ] Create answer evaluation logic
- [ ] Implement adaptive difficulty
- [ ] Test quiz flows

**Deliverable**: Quiz agent can assess and adapt

---

### Phase 5: Orchestrator Agent (Week 3)
**Goal**: Build the session coordinator

**Tasks**:
- [ ] Implement Orchestrator Agent
- [ ] Build decision logic (teach/quiz/review)
- [ ] Create agent delegation system
- [ ] Implement session state management
- [ ] Test complete learning flows

**Deliverable**: Full agentic learning session works end-to-end

---

### Phase 6: API Integration (Week 3-4)
**Goal**: Connect backend to frontend

**Tasks**:
- [ ] Build FastAPI endpoints
- [ ] Connect agents to routes
- [ ] Implement WebSocket for real-time chat
- [ ] Add authentication/authorization
- [ ] Test API integration

**Deliverable**: Frontend can communicate with agents

---

### Phase 7: Frontend Integration (Week 4)
**Goal**: Complete the user experience

**Tasks**:
- [ ] Update frontend to use backend APIs
- [ ] Implement real-time chat UI
- [ ] Add progress tracking
- [ ] Build student dashboard
- [ ] Test end-to-end flows

**Deliverable**: Complete working application

---

### Phase 8: Testing & Refinement (Week 4-5)
**Goal**: Polish and optimize

**Tasks**:
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Agent prompt refinement
- [ ] UI/UX improvements
- [ ] Documentation

**Deliverable**: Production-ready system

---

## Improvements Over Original Plan

### 1. **True Agentic Behavior**
   - Original: Agent responds to student questions
   - Improved: Agent drives the session, initiates topics, decides flow

### 2. **Multi-Source Knowledge**
   - Original: Only PDF content
   - Improved: PDF (primary) + Web search (supplementary) with clear sourcing

### 3. **Orchestrator-Driven Flow**
   - Original: Student controls pacing
   - Improved: Orchestrator manages pacing, adapts in real-time

### 4. **RAG Implementation**
   - Original: Basic content retrieval
   - Improved: Semantic search with metadata filtering, context maintenance

### 5. **Adaptive Teaching**
   - Original: Static difficulty
   - Improved: Real-time adaptation based on performance and engagement

### 6. **Clear Tool Architecture**
   - Original: Generic tools
   - Improved: Specific tools for each agent role, well-defined boundaries

---

## Design Decisions (Finalized)

### 1. **Pacing Control** ✅
   **Decision**: **Auto-detect**

   The Orchestrator Agent will automatically detect pacing needs by analyzing:
   - Response time patterns (slow responses → may need more time)
   - Error frequency (multiple errors → slow down)
   - Question complexity (deep questions → student engaged, can maintain pace)
   - Session duration (long session → suggest break)

   Implementation: Agent monitors metrics and adjusts teaching depth/speed accordingly.

---

### 2. **Web Search Scope** ✅
   **Decision**: **Only when PDF insufficient**

   Web search will be triggered:
   - When student asks question not covered in PDF
   - When PDF content lacks depth on specific topic
   - Agent will always clearly cite source:
     - "According to your textbook..." (PDF)
     - "Based on external research..." (Web)

   Implementation: Tutor Agent checks Qdrant first, web search as fallback.

---

### 3. **Quiz Difficulty Progression** ✅
   **Decision**: **Moderate** (2 correct → increase difficulty)

   Adaptive logic:
   - 2 consecutive correct answers → Increase difficulty
   - 1 incorrect answer → Maintain current difficulty
   - 2 consecutive incorrect → Decrease difficulty
   - Provides balanced challenge without frustration

   Implementation: Quiz Agent tracks recent performance and adjusts next question.

---

### 4. **Session Length** ✅
   **Decision**: **Suggest breaks** after 30-45 minutes

   Orchestrator behavior:
   - Track session start time
   - After 30-45 min, agent suggests: "You've been learning for 40 minutes! Great focus. Want to take a 5-minute break?"
   - Student can accept or decline
   - No forced interruptions

   Implementation: Orchestrator monitors session duration, makes suggestions.

---

### 5. **Multi-Modal Learning** ✅
   **Decision**: **Not in this phase** (text-only for Phase 1)

   Phase 1 scope:
   - Extract and process text from PDFs only
   - Images/diagrams deferred to Phase 2+
   - Faster MVP, focused on agentic behavior

   Future enhancement: Add image extraction and multi-modal embeddings later.

---

---

## Success Metrics

### Agent Performance
- Conversation coherence score
- Topic coverage completeness
- Adaptive decision accuracy

### Learning Outcomes
- Quiz score improvement over time
- Concept mastery rate
- Time to completion vs. comprehension

### Engagement
- Session duration
- Student questions asked
- Re-engagement rate

---

## Next Steps - Ready for Implementation! 🚀

### ✅ Planning Phase Complete

All design decisions have been finalized:
- ✅ Pacing: Auto-detect
- ✅ Web Search: Only when PDF insufficient
- ✅ Quiz Difficulty: Moderate (2 correct → increase)
- ✅ Session Length: Suggest breaks after 30-45 min
- ✅ Multi-Modal: Text-only for Phase 1

### 🏗️ Implementation Plan

**Start with Phase 2** (Phase 1 foundation already exists in dev branch):

1. **Phase 2: PDF Processing & Vector Storage** (~3-4 days)
   - Implement PDF text extraction
   - Create chunking strategy
   - Generate embeddings with OpenAI
   - Store vectors in Qdrant
   - Test semantic search

2. **Phase 3: Tutor Agent with RAG** (~2-3 days)
   - Build RAG-powered Tutor Agent
   - Implement Qdrant search tools
   - Add web search fallback
   - Test teaching conversations

3. **Phase 4: Quiz Agent & Assessment** (~2-3 days)
   - Build Quiz Agent with adaptive difficulty
   - Implement moderate progression logic
   - Test assessment flows

4. **Phase 5: Orchestrator Agent** (~2-3 days)
   - Build session coordination
   - Implement auto-pacing detection
   - Add break suggestions
   - Test complete learning flows

5. **Phases 6-8: Integration & Polish** (~1-2 weeks)
   - API endpoints
   - Frontend integration
   - Testing & refinement

### 📋 Immediate Next Actions

1. Verify OpenAI API key is configured
2. Start Docker services (PostgreSQL + Qdrant)
3. Begin Phase 2: PDF processing implementation
4. Set up test PDF for validation

---

## Summary

This refined plan transforms the AI tutor from a **reactive chatbot** into a **proactive teaching agent** that:

✅ Initiates and drives learning sessions
✅ Teaches using RAG-powered content retrieval (Qdrant)
✅ Assesses understanding continuously with adaptive difficulty
✅ Adapts in real-time to student needs (auto-pacing)
✅ Orchestrates multiple specialized agents
✅ Supplements PDF content with web search when needed (with clear sourcing)
✅ Maintains conversation context and memory
✅ Suggests breaks for optimal learning (30-45 min)
✅ Provides a cohesive, teacher-like experience

**Status**: ✅ Plan finalized, ready to build!
