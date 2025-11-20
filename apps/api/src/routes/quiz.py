"""
Quiz routes - Quiz Agent integration.
"""

from fastapi import APIRouter, HTTPException
from src.agents.quiz import get_quiz_agent
from src.models import QuizSubmissionRequest, QuizResponse
from pydantic import BaseModel
import logging

router = APIRouter(prefix="/api/quiz", tags=["quiz"])
logger = logging.getLogger(__name__)


class QuizSubmitRequest(BaseModel):
    session_id: str
    question_id: str
    answer: str
    section_id: str


@router.post("/submit")
async def submit_quiz_answer(request: QuizSubmitRequest):
    """
    Submit a quiz answer for evaluation.
    
    The Quiz Agent will:
    1. Verify answer using RAG (search course content)
    2. Provide feedback and explanation
    3. Adapt difficulty based on performance (moderate strategy)
    4. Suggest next step (try_again/review/move_to_next)
    
    Adaptive Difficulty (Moderate):
    - 2 consecutive correct → increase difficulty
    - 1 incorrect → maintain difficulty  
    - 2 consecutive incorrect → decrease difficulty
    """
    try:
        logger.info(f"Quiz submission for question {request.question_id}")
        
        # TODO: Call Quiz Agent
        # quiz_agent = get_quiz_agent()
        # response = await quiz_agent.run({
        #     "session_id": request.session_id,
        #     "question_id": request.question_id,
        #     "student_answer": request.answer,
        #     "section_id": request.section_id
        # })
        
        # Mock response
        mock_response = {
            "is_correct": True,
            "explanation": "Correct! According to your textbook (Section 2.1)...",
            "key_concept": "Main concept being tested",
            "confidence_level": 0.95,
            "hint_if_wrong": None,
            "next_step": "move_to_next",
            "adaptive_difficulty": "same"
        }
        
        return {
            "success": True,
            "evaluation": mock_response,
            "message": "Quiz evaluated (agents require OpenAI key)"
        }
        
    except Exception as e:
        logger.error(f"Quiz submission error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/generate/{section_id}")
async def generate_quiz(section_id: str, difficulty: str = "beginner"):
    """Generate quiz questions for a section."""
    # TODO: Implement quiz generation using content generator agent
    return {
        "section_id": section_id,
        "difficulty": difficulty,
        "questions": [],
        "message": "Quiz generation (requires content generator agent)"
    }
