"""
Learning session routes - Orchestrator Agent integration.
"""

from fastapi import APIRouter, HTTPException
from src.agents.orchestrator import get_orchestrator_agent
from src.models import SessionStartRequest, OrchestrationDecision
from pydantic import BaseModel
import logging
from datetime import datetime

router = APIRouter(prefix="/api/learning", tags=["learning"])
logger = logging.getLogger(__name__)


class SessionResponse(BaseModel):
    session_id: str
    class_id: str
    student_id: str
    current_section_id: str | None
    started_at: str
    status: str


@router.post("/session/start")
async def start_learning_session(request: SessionStartRequest):
    """
    Start a new learning session.
    
    The Orchestrator Agent will:
    1. Check student progress
    2. Determine starting point
    3. Initialize session state
    4. Decide first action (teach/quiz/review)
    """
    try:
        logger.info(f"Starting session for student {request.student_id} in class {request.class_id}")
        
        # TODO: Call Orchestrator Agent
        # orchestrator = get_orchestrator_agent()
        # decision = await orchestrator.run({
        #     "class_id": request.class_id,
        #     "student_id": request.student_id,
        #     "current_action": "start"
        # })
        
        # Mock response
        session_id = f"session_{datetime.now().timestamp()}"
        
        return {
            "success": True,
            "session_id": session_id,
            "class_id": request.class_id,
            "student_id": request.student_id,
            "current_section_id": "section_1",
            "started_at": datetime.now().isoformat(),
            "status": "active",
            "next_action": {
                "action": "teach",
                "target": "section_1",
                "reasoning": "Starting with first section",
                "student_message": "Welcome! Let's begin with the first topic..."
            },
            "message": "Session started (agents require OpenAI key)"
        }
        
    except Exception as e:
        logger.error(f"Session start error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}/state")
async def get_session_state(session_id: str):
    """Get current session state."""
    # TODO: Implement session state retrieval
    return {
        "session_id": session_id,
        "status": "active",
        "message": "Session state (requires database)"
    }


@router.post("/session/{session_id}/next")
async def session_next_action(session_id: str):
    """
    Get next action from Orchestrator based on current state.
    
    Uses auto-pacing to determine:
    - Continue teaching
    - Move to quiz
    - Suggest break (30-45 min)
    - Review material
    - Next section
    """
    try:
        # TODO: Call Orchestrator Agent with session history
        # orchestrator = get_orchestrator_agent()
        # decision = await orchestrator.run({
        #     "session_id": session_id,
        #     "current_action": "decide_next"
        # })
        
        return {
            "success": True,
            "decision": {
                "action": "quiz",
                "target": "current_section",
                "reasoning": "Student engaged well, ready for assessment",
                "student_message": "Great! Let's test your understanding..."
            },
            "message": "Next action (agents require OpenAI key)"
        }
        
    except Exception as e:
        logger.error(f"Next action error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/progress/{student_id}/{class_id}")
async def get_student_progress(student_id: str, class_id: str):
    """Get student progress in a class."""
    # TODO: Implement progress retrieval
    return {
        "student_id": student_id,
        "class_id": class_id,
        "sections_completed": 0,
        "total_sections": 0,
        "message": "Progress tracking (requires database)"
    }
