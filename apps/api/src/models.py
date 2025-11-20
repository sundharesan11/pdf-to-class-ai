"""
Pydantic models for agent outputs and database schemas.
All agents output structured JSON using these models.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ============================================================================
# PDF Parser Agent Output Models
# ============================================================================


class Section(BaseModel):
    """A section within a chapter - the smallest learning unit."""

    title: str = Field(..., description="Section title")
    content: str = Field(..., description="Full text content of the section")
    key_points: list[str] = Field(
        default_factory=list, description="Key concepts in this section"
    )
    estimated_duration: int = Field(
        ..., description="Estimated learning time in minutes"
    )
    difficulty: str = Field(
        ..., description="Difficulty level: beginner, intermediate, advanced"
    )
    embedding_id: Optional[str] = Field(
        default=None, description="Reference to Qdrant vector ID"
    )


class Chapter(BaseModel):
    """A chapter is a collection of related sections."""

    title: str = Field(..., description="Chapter title")
    description: str = Field(..., description="Brief description of chapter content")
    sections: list[Section] = Field(..., description="Sections in this chapter")


class ClassStructure(BaseModel):
    """
    Complete course structure output from PDF Parser Agent.
    This is what gets returned after parsing a PDF.
    """

    title: str = Field(..., description="Course title")
    description: str = Field(..., description="Course description")
    chapters: list[Chapter] = Field(..., description="All chapters in the course")
    learning_objectives: list[str] = Field(
        ..., description="High-level learning goals"
    )
    estimated_total_hours: int = Field(
        ..., description="Total estimated learning time in hours"
    )


# ============================================================================
# Tutor Agent Output Models
# ============================================================================


class TutorResponse(BaseModel):
    """Response from Tutor Agent to student message."""

    explanation: str = Field(..., description="Clear explanation of the concept")
    examples: list[str] = Field(
        default_factory=list, description="Concrete examples from course content"
    )
    key_concepts: list[str] = Field(
        default_factory=list, description="Main concepts covered"
    )
    follow_up_questions: list[str] = Field(
        default_factory=list, description="Questions to check understanding"
    )
    depth_adjustment: str = Field(
        default="appropriate",
        description="Indication if we should go deeper, simpler, or stay appropriate",
    )
    next_action: str = Field(
        default="continue",
        description="Suggested next step: continue, quiz, next_section",
    )


# ============================================================================
# Quiz Agent Output Models
# ============================================================================


class QuizResponse(BaseModel):
    """Response from Quiz Agent after evaluating an answer."""

    is_correct: bool = Field(..., description="Whether the answer is correct")
    explanation: str = Field(..., description="Explanation of correct answer")
    key_concept: str = Field(..., description="Main concept tested by this question")
    confidence_level: float = Field(
        ..., ge=0, le=1, description="Agent confidence in evaluation (0-1)"
    )
    hint_if_wrong: Optional[str] = Field(
        default=None, description="Hint for incorrect answers (no answer given away)"
    )
    next_step: str = Field(
        default="try_again",
        description="What student should do: try_again, review, move_to_next",
    )
    adaptive_difficulty: str = Field(
        default="same",
        description="Difficulty for next question: easier, same, harder",
    )


# ============================================================================
# Orchestrator Agent Output Models
# ============================================================================


class OrchestrationDecision(BaseModel):
    """Decision from Orchestrator Agent about what happens next in learning."""

    action: str = Field(
        ...,
        description="Next action: teach, quiz, review, next_section, congratulate",
    )
    target: str = Field(
        ..., description="Target section_id or special value like 'next_section'"
    )
    reasoning: str = Field(
        ..., description="Explanation of why this action was chosen"
    )
    student_message: str = Field(
        ...,
        description="Message to show student explaining what's next",
    )


# ============================================================================
# Chat/Conversation Models
# ============================================================================


class ChatMessage(BaseModel):
    """A single message in a chat conversation."""

    role: str = Field(..., description="Role: user, assistant")
    content: str = Field(..., description="Message content")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ConversationHistory(BaseModel):
    """Chat history for a learning session."""

    session_id: str = Field(..., description="Session identifier")
    messages: list[ChatMessage] = Field(
        default_factory=list, description="All messages in order"
    )
    section_id: str = Field(..., description="Current section being learned")


# ============================================================================
# Progress/Learning Models
# ============================================================================


class StudentProgress(BaseModel):
    """Student's progress in a course/section."""

    student_id: str = Field(..., description="Student identifier")
    section_id: str = Field(..., description="Section identifier")
    status: str = Field(
        default="not_started",
        description="Progress status: not_started, in_progress, completed",
    )
    quiz_score: Optional[float] = Field(
        default=None, ge=0, le=1, description="Quiz score as decimal (0-1)"
    )
    completed_at: Optional[datetime] = Field(default=None)


class LearningSession(BaseModel):
    """An active learning session for a student."""

    session_id: str = Field(..., description="Unique session identifier")
    student_id: str = Field(..., description="Student ID")
    class_id: str = Field(..., description="Class/course ID")
    current_section_id: Optional[str] = Field(
        default=None, description="Currently active section"
    )
    current_action: str = Field(
        default="start", description="Current mode: start, teach, quiz, review"
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Request Models for API Endpoints
# ============================================================================


class PDFUploadRequest(BaseModel):
    """Request to upload and parse a PDF."""

    subject: str = Field(..., description="Subject/title of the course")
    level: str = Field(
        default="beginner",
        description="Difficulty level: beginner, intermediate, advanced",
    )
    # PDF content is handled separately as file upload


class ChatMessageRequest(BaseModel):
    """Request to send message to tutor."""

    session_id: str = Field(..., description="Learning session ID")
    message: str = Field(..., description="Student's message")


class QuizSubmissionRequest(BaseModel):
    """Request to submit a quiz answer."""

    session_id: str = Field(..., description="Learning session ID")
    question_id: str = Field(..., description="Question identifier")
    answer: str = Field(..., description="Student's answer")
    difficulty: str = Field(
        default="beginner",
        description="Current question difficulty",
    )


class SessionStartRequest(BaseModel):
    """Request to start a new learning session."""

    class_id: str = Field(..., description="Class/course ID")
    student_id: str = Field(..., description="Student ID")
