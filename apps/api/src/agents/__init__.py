"""
Agent definitions - the core of the system.
Each agent uses tools to accomplish specific tasks.
"""

from agents import Agent
from src.config import settings

__all__ = ["get_pdf_parser_agent", "get_tutor_agent", "get_quiz_agent", "get_orchestrator_agent"]
