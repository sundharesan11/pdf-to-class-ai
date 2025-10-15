erDiagram

    USERS {
        int id PK
        string name
        string email
        string password_hash
        enum role "teacher | student"
        timestamp created_at
    }

    CLASSES {
        int id PK
        string title
        text description
        string join_code
        enum difficulty "beginner | intermediate | advanced"
        int created_by FK
        text pdf_url
        enum status "draft | published"
        timestamp created_at
    }

    CLASS_MEMBERS {
        int id PK
        int class_id FK
        int user_id FK
        decimal progress_percent
        timestamp joined_at
    }

    CHAPTERS {
        int id PK
        int class_id FK
        string title
        int order_index
        text summary
        timestamp created_at
    }

    SECTIONS {
        int id PK
        int chapter_id FK
        string title
        text content
        int order_index
        timestamp created_at
    }

    QUIZZES {
        int id PK
        int section_id FK
        string title
        int total_marks
        timestamp created_at
    }

    QUIZ_QUESTIONS {
        int id PK
        int quiz_id FK
        text question_text
        jsonb options
        string correct_answer
        text explanation
        int marks
    }

    QUIZ_ATTEMPTS {
        int id PK
        int quiz_id FK
        int student_id FK
        jsonb answers
        int score
        timestamp started_at
        timestamp completed_at
        text feedback
    }

    CHAT_MESSAGES {
        int id PK
        int class_id FK
        int student_id FK
        int section_id FK
        enum sender "student | tutor"
        text message
        timestamp created_at
    }

    PROGRESS {
        int id PK
        int student_id FK
        int section_id FK
        enum status "not_started | in_progress | completed"
        int score
        timestamp last_interaction
    }

    ANALYTICS {
        int id PK
        int class_id FK
        decimal avg_progress
        decimal avg_score
        int total_students
        int active_today
        timestamp updated_at
    }

    SESSIONS {
        int id PK
        int class_id FK
        int student_id FK
        int current_section_id FK
        enum status "active | paused | completed"
        timestamp started_at
        timestamp updated_at
        uuid transcript_id
        jsonb ai_decision_state
    }

    SESSION_STEPS {
        int id PK
        int session_id FK
        enum step_type "teach | quiz | feedback | transition | summary"
        text input
        text output
        int score
        string next_action
        timestamp created_at
    }

    SESSION_MEMORY {
        int id PK
        int session_id FK
        string key
        text value
        decimal relevance
        timestamp updated_at
    }

    %% === RELATIONSHIPS ===
    USERS ||--o{ CLASSES : "creates"
    USERS ||--o{ CLASS_MEMBERS : "enrolls"
    CLASSES ||--o{ CLASS_MEMBERS : "has"
    CLASSES ||--o{ CHAPTERS : "contains"
    CHAPTERS ||--o{ SECTIONS : "contains"
    SECTIONS ||--o{ QUIZZES : "has"
    QUIZZES ||--o{ QUIZ_QUESTIONS : "has"
    USERS ||--o{ QUIZ_ATTEMPTS : "attempts"
    QUIZZES ||--o{ QUIZ_ATTEMPTS : "recorded_in"
    USERS ||--o{ CHAT_MESSAGES : "sends"
    CLASSES ||--o{ CHAT_MESSAGES : "context"
    SECTIONS ||--o{ CHAT_MESSAGES : "context"
    USERS ||--o{ PROGRESS : "tracks"
    SECTIONS ||--o{ PROGRESS : "progress_on"
    CLASSES ||--o{ ANALYTICS : "summarized_by"
    USERS ||--o{ SESSIONS : "attends"
    CLASSES ||--o{ SESSIONS : "belongs_to"
    SECTIONS ||--o{ SESSIONS : "current_section"
    SESSIONS ||--o{ SESSION_STEPS : "has_many"
    SESSIONS ||--o{ SESSION_MEMORY : "stores"
