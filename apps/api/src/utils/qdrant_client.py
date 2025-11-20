"""
Qdrant client initialization and management.
"""

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from src.config import settings
import logging

logger = logging.getLogger(__name__)

# Global Qdrant client instance
_qdrant_client = None


def get_qdrant_client() -> QdrantClient:
    """
    Get or create Qdrant client instance (singleton).

    Returns:
        QdrantClient instance
    """
    global _qdrant_client

    if _qdrant_client is None:
        try:
            _qdrant_client = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key if settings.qdrant_api_key else None,
            )
            logger.info(f"Qdrant client initialized: {settings.qdrant_url}")
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant client: {e}")
            raise

    return _qdrant_client


def init_qdrant_collections():
    """
    Initialize Qdrant collections if they don't exist.

    Creates collections:
    - course_content: PDF section embeddings
    - quiz_bank: Question embeddings
    - conversation_context: Chat history embeddings
    """
    client = get_qdrant_client()

    # Collection: course_content (1536-dim for OpenAI text-embedding-3-small)
    try:
        client.get_collection("course_content")
        logger.info("Collection 'course_content' already exists")
    except Exception:
        client.create_collection(
            collection_name="course_content",
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        logger.info("Created collection 'course_content'")

    # Collection: quiz_bank
    try:
        client.get_collection("quiz_bank")
        logger.info("Collection 'quiz_bank' already exists")
    except Exception:
        client.create_collection(
            collection_name="quiz_bank",
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        logger.info("Created collection 'quiz_bank'")

    # Collection: conversation_context
    try:
        client.get_collection("conversation_context")
        logger.info("Collection 'conversation_context' already exists")
    except Exception:
        client.create_collection(
            collection_name="conversation_context",
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        logger.info("Created collection 'conversation_context'")


def close_qdrant_client():
    """Close Qdrant client connection."""
    global _qdrant_client
    if _qdrant_client:
        _qdrant_client.close()
        _qdrant_client = None
        logger.info("Qdrant client closed")
