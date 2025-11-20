"""
Chat and tutoring routes.
Sends messages to the Tutor Agent.
"""

from fastapi import APIRouter
from agents import Runner
from src.agents.tutor import get_tutor_agent
from src.models import ChatMessageRequest, TutorResponse

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/message")
async def send_message(request: ChatMessageRequest) -> TutorResponse:
    """
    Send a message to the tutor for the current section.

    The Tutor Agent will:
    1. Understand what the student is asking
    2. Search Qdrant for relevant course content (RAG)
    3. Provide a clear explanation with examples
    4. Ask follow-up questions to check understanding
    5. Suggest next steps (continue, quiz, next_section)

    Args:
        request: ChatMessageRequest with session_id and message

    Returns:
        TutorResponse with explanation, examples, questions, and next action
    """
    # TODO: Implement
    # 1. Load learning session
    # 2. Get chat history
    # 3. Call Tutor Agent with student message
    # 4. Save response to history
    # 5. Return TutorResponse
    pass


@router.get("/{session_id}/history")
async def get_conversation_history(session_id: str, limit: int = 10) -> list:
    """
    Retrieve chat history for a session.

    Args:
        session_id: Learning session identifier
        limit: Number of recent messages to return

    Returns:
        List of ChatMessage objects
    """
    # TODO: Implement
    # Query database for conversation history
    pass
