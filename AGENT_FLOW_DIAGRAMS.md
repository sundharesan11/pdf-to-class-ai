# Agent Flow Diagrams

## 1. Complete Learning Session Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LEARNING SESSION FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

START
  ↓
  ┌─────────────────────────────────────┐
  │   ORCHESTRATOR AGENT                │
  │   "What should student do next?"    │
  └─────────────────────────────────────┘
  ↓
  ├─→ Status: Not started section → "Teach!"
  ├─→ Status: In progress, asked question → "Answer via Tutor"
  ├─→ Status: Ready for quiz → "Quiz time!"
  └─→ Status: Completed all → "Congratulate!"
  ↓
  ┌─────────────────────────────────────┐
  │ [Branch 1] TUTOR AGENT              │
  │                                     │
  │ Inputs:                             │
  │  • Section ID                       │
  │  • Student message                  │
  │  • Chat history                     │
  │                                     │
  │ Tools:                              │
  │  • get_section_content()            │
  │  • search_vector_db(query)          │
  │  • save_chat_message()              │
  │                                     │
  │ Outputs:                            │
  │  • explanation                      │
  │  • examples                         │
  │  • follow_up_questions              │
  │  • next_action (quiz/continue)      │
  └─────────────────────────────────────┘
```

## 2. PDF Upload Flow

```
Teacher uploads PDF (any account, no auth)
  ↓
POST /pdf/upload {
  file: biology.pdf,
  title: "Introduction to Biology",
  level: "beginner"
}
  ↓
┌─────────────────────────────────────┐
│ PDF_PARSER_AGENT                    │
│                                     │
│ Step 1: extract_text_from_pdf()     │
│         ↓ Returns: Full text        │
│                                     │
│ Step 2: Agent analyzes structure    │
│                                     │
│ Step 3: Creates ClassStructure      │
│   Class {                           │
│     chapters: [                     │
│       {                             │
│         title: "Cell Biology"       │
│         sections: [                 │
│           {                         │
│             title: "Cell Structure" │
│             content: "Cells are.."  │
│             difficulty: "beginner"  │
│           }                         │
│         ]                           │
│       }                             │
│     ]                               │
│   }                                 │
│                                     │
│ Step 4: save_class_to_db()          │
│ Step 5: generate_embeddings()       │
│         (Store in Qdrant)           │
│                                     │
│ Return: ClassStructure (JSON)       │
└─────────────────────────────────────┘
```

## 3. Teaching with RAG

```
Student: "I don't understand photosynthesis"
  ↓
┌─────────────────────────────────────┐
│ TUTOR AGENT (RAG-enabled)           │
│                                     │
│ Tool 1: get_section_content()       │
│         ↓ Full section text         │
│                                     │
│ Tool 2: search_vector_db()          │
│         Query: "photosynthesis"     │
│         ↓ Create embedding          │
│         ↓ Search Qdrant             │
│         ↓ Get similar sections      │
│                                     │
│ Agent synthesizes:                  │
│ "Use main section + RAG results     │
│  to explain clearly"                │
│                                     │
│ Tool 3: save_chat_message()         │
│                                     │
│ Returns: TutorResponse {            │
│   explanation: "...",               │
│   examples: [...],                  │
│   follow_up_questions: [...]        │
│ }                                   │
└─────────────────────────────────────┘
```

## 4. Quiz Flow

```
Student ready for quiz
  ↓
┌─────────────────────────────────────┐
│ QUIZ_AGENT                          │
│                                     │
│ Tool: get_quiz_questions()          │
│       ↓ Returns questions           │
│                                     │
│ Student answers each question       │
│                                     │
│ For each answer:                    │
│   • Evaluate correctness            │
│   • Save attempt                    │
│   • Generate feedback               │
│   • Suggest difficulty for next     │
│                                     │
│ Tool: save_quiz_attempt()           │
│ Tool: save_progress()               │
│                                     │
│ Returns: QuizResponse {             │
│   is_correct: bool,                 │
│   explanation: "...",               │
│   next_step: "..."                  │
│ }                                   │
└─────────────────────────────────────┘
  ↓
ORCHESTRATOR decides next step based on score
```

## 5. Orchestrator Decision Tree

```
ORCHESTRATOR analyzes state:
  ↓
IF not_started(section):
    → TEACH (delegate to Tutor)
    
ELSE IF in_progress(section):
    IF student_has_question:
        → ANSWER (delegate to Tutor)
    ELSE:
        → OFFER_QUIZ
        
ELSE IF quiz_completed(section):
    IF score < 60%:
        → REVIEW (delegate to Tutor)
    ELSE IF score 60-80%:
        → NEXT_SECTION
    ELSE IF score > 80%:
        → CONGRATULATE + NEXT_SECTION
        
ELSE IF all_done:
    → CELEBRATE
```

## 6. Data Flow Summary

```
PDF UPLOAD:
POST /pdf/upload
  → PDF_PARSER_AGENT
    → Tools: extract, save, embed
    → Returns: ClassStructure
  → DB + Qdrant populated

LEARNING START:
GET /class/{id}/session
  → ORCHESTRATOR_AGENT
    → Decides: Teach this section
  → Returns: OrchestrationDecision

STUDENT ASKS QUESTION:
POST /chat/message
  → TUTOR_AGENT
    → Tools: get section, search Qdrant, save message
    → Returns: TutorResponse

QUIZ SUBMISSION:
POST /quiz/answer
  → QUIZ_AGENT
    → Tools: evaluate, save, update progress
    → Returns: QuizResponse
```

---

All flows use **OpenAI Agents SDK** with tools for DB/Qdrant operations.
