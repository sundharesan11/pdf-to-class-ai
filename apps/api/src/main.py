"""
Main FastAPI application.
Initializes the app and registers routes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings
from src.routes import pdf, chat, quiz, learning
import logging

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.api_debug and "DEBUG" or "INFO"),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="AI-powered educational platform with multi-agent system (OpenAI Agents SDK)",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "version": settings.api_version,
        "agents": "ready (require OpenAI API key)"
    }


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "title": settings.api_title,
        "version": settings.api_version,
        "status": "running",
        "docs": "/docs",
        "agents": {
            "pdf_parser": "Extract and structure PDF content",
            "tutor": "RAG-powered teaching with web search fallback",
            "quiz": "Adaptive assessment (moderate difficulty)",
            "orchestrator": "Session coordination with auto-pacing"
        },
        "features": {
            "rag": "Qdrant vector search",
            "web_search": "External knowledge fallback",
            "adaptive_difficulty": "2 correct → increase",
            "auto_pacing": "Response time + error tracking",
            "break_suggestions": "30-45 min intervals"
        }
    }


# Register API routes
app.include_router(pdf.router)
app.include_router(chat.router)
app.include_router(quiz.router)
app.include_router(learning.router)

logger.info(f"FastAPI application initialized: {settings.api_title} v{settings.api_version}")
logger.info("Registered routes: /api/pdf, /api/chat, /api/quiz, /api/learning")


# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    logger.info("Application startup")
    logger.info("Note: Agents require OPENAI_API_KEY in .env to function")
    
    # TODO: Initialize Qdrant collections
    # from src.utils.qdrant_client import init_qdrant_collections
    # init_qdrant_collections()


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("Application shutdown")
    
    # TODO: Close Qdrant client
    # from src.utils.qdrant_client import close_qdrant_client
    # close_qdrant_client()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_debug,
    )
