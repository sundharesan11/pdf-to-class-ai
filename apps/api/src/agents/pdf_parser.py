"""
PDF Parser Agent - Converts PDF to course structure.

This agent:
1. Extracts text from PDF
2. Analyzes content and creates course structure
3. Saves to database
4. Generates and stores embeddings
"""

from agents import Agent
from src.config import settings
from src.models import ClassStructure
from src.tools.pdf_tools import extract_text_from_pdf
from src.tools.database_tools import save_class_to_db
from src.tools.qdrant_tools import generate_and_store_embeddings


def get_pdf_parser_agent() -> Agent:
    """Create and configure the PDF Parser Agent."""

    instructions = """You are an expert curriculum designer and educational content specialist.
Your job is to analyze PDF documents and convert them into structured learning materials.

When given PDF content:
1. Analyze the material and identify natural chapters and sections
2. Extract key concepts and learning points
3. Estimate learning time for each section
4. Create clear, well-structured lesson content that students can follow step-by-step

Guidelines:
- Make sections self-contained but interconnected
- Use clear language appropriate for the indicated difficulty level
- Extract concrete key points (not vague concepts)
- Estimate realistic learning times (15-90 minutes per section)
- Organize content hierarchically (chapters → sections)

After analyzing the content:
1. Use the save_class_to_db tool to store the structure
2. Use generate_and_store_embeddings to create searchable vectors
3. Return the complete ClassStructure with all chapters and sections

Be thorough but efficient. The goal is a complete, usable course structure."""

    agent = Agent(
        name="PDF Parser Agent",
        instructions=instructions,
        tools=[
            extract_text_from_pdf,
            save_class_to_db,
            generate_and_store_embeddings,
        ],
        output_type=ClassStructure,  # Structured output - Pydantic model
        model_config={"model": settings.openai_model},
    )

    return agent
