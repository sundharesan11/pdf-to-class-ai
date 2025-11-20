"""
Quiz routes.
Sends quiz answers to the Quiz Agent for evaluation.
"""

from fastapi import APIRouter
from agents import Runner
from src.agents.quiz import get_quiz_agent
from src.models import QuizSubmissionRequest, QuizResponse

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/submit")
async def submit_answer(request: QuizSubmissionRequest) -> QuizResponse:
    """
    Submit a quiz answer for evaluation.

    The Quiz Agent will:
    1. Evaluate if the answer is correct
    2. Provide explanation of correct answer
    3. If wrong, give a hint without revealing answer
    4. Assess mastery level
    5. Decide next step (try_again, review, move_to_next)
    6. Adapt difficulty for next question
    7. Save attempt for progress tracking

    Args:
        request: QuizSubmissionRequest with session_id, question_id, answer

    Returns:
        QuizResponse with correctness, explanation, and next steps
    """
    # TODO: Implement
    # 1. Load learning session
    # 2. Get question details from database
    # 3. Call Quiz Agent with student answer
    # 4. Save attempt to database
    # 5. Return QuizResponse
    pass


@router.get("/{session_id}/questions")
async def get_quiz_questions(session_id: str, count: int = 1) -> list:
    """
    Get quiz questions for a section.

    Args:
        session_id: Learning session identifier
        count: Number of questions to return

    Returns:
        List of quiz questions with options
    """
    # TODO: Implement
    # 1. Get current section from session
    # 2. Get or generate quiz questions
    # 3. Return questions (with options for MCQ)
    pass
