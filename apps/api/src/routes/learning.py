"""
Learning session routes.
Manages learning flow via the Orchestrator Agent.
"""

from fastapi import APIRouter
from agents import Runner
from src.agents.orchestrator import get_orchestrator_agent
from src.models import (
    SessionStartRequest,
    OrchestrationDecision,
    LearningSession,
)

router = APIRouter(prefix="/learning", tags=["learning"])


@router.post("/session/start")
async def start_learning_session(request: SessionStartRequest) -> OrchestrationDecision:
    """
    Start a new learning session.

    The Orchestrator Agent will:
    1. Get course structure
    2. Check student progress
    3. Decide what happens first (teach first section, etc)
    4. Create a learning session
    5. Return decision about what to do first

    Args:
        request: SessionStartRequest with class_id and student_id

    Returns:
        OrchestrationDecision with first action to take
    """
    # TODO: Implement
    # 1. Create learning session
    # 2. Call Orchestrator Agent
    # 3. Save session state
    # 4. Return OrchestrationDecision
    pass


@router.get("/session/{session_id}")
async def get_session(session_id: str) -> LearningSession:
    """
    Retrieve a learning session.

    Args:
        session_id: Session identifier

    Returns:
        LearningSession with all metadata
    """
    # TODO: Implement
    # Query database for session
    pass


@router.post("/session/{session_id}/next")
async def get_next_action(session_id: str) -> OrchestrationDecision:
    """
    Ask the Orchestrator what happens next in the learning session.

    The Orchestrator Agent will:
    1. Check current session state
    2. Review student progress
    3. Decide next action based on quiz scores, time spent, etc
    4. Update session state

    Args:
        session_id: Session identifier

    Returns:
        OrchestrationDecision with next action
    """
    # TODO: Implement
    # 1. Get session and progress
    # 2. Call Orchestrator Agent
    # 3. Update session state
    # 4. Return OrchestrationDecision
    pass


@router.get("/class/{class_id}/progress")
async def get_class_progress(class_id: str, student_id: str) -> dict:
    """
    Get student's overall progress in a course.

    Args:
        class_id: Course identifier
        student_id: Student identifier

    Returns:
        Dict with completion stats, scores, completed sections
    """
    # TODO: Implement
    # Query database for progress
    pass
