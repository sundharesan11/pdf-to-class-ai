"""
Vector database (Qdrant) tools for semantic search and embeddings.
"""

from agents import function_tool
from typing import Optional, List
from openai import OpenAI
from qdrant_client.models import PointStruct, Filter, FieldCondition, MatchValue
from src.config import settings
from src.utils.qdrant_client import get_qdrant_client
import logging
import uuid

logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_client = OpenAI(api_key=settings.openai_api_key)


@function_tool
def generate_embedding(text: str) -> list[float]:
    """
    Generate an embedding vector from text using OpenAI API.

    Args:
        text: Text to embed

    Returns:
        Embedding vector (list of floats)
    """
    try:
        response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        embedding = response.data[0].embedding
        logger.debug(f"Generated embedding for text of length {len(text)}")
        return embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise RuntimeError(f"Failed to generate embedding: {str(e)}")


@function_tool
def store_embedding(
    collection_name: str,
    content: str,
    metadata: dict
) -> str:
    """
    Generate and store a single embedding in Qdrant.

    Args:
        collection_name: Qdrant collection name
        content: Text content to embed
        metadata: Metadata dict (class_id, section_id, etc.)

    Returns:
        Vector ID (UUID)
    """
    try:
        # Generate embedding
        embedding = generate_embedding(content)

        # Create unique ID
        vector_id = str(uuid.uuid4())

        # Store in Qdrant
        client = get_qdrant_client()
        client.upsert(
            collection_name=collection_name,
            points=[
                PointStruct(
                    id=vector_id,
                    vector=embedding,
                    payload={
                        "content": content,
                        **metadata
                    }
                )
            ]
        )

        logger.info(f"Stored embedding {vector_id} in {collection_name}")
        return vector_id

    except Exception as e:
        logger.error(f"Error storing embedding: {e}")
        raise RuntimeError(f"Failed to store embedding: {str(e)}")


@function_tool
def store_embeddings(section_id: str, content: str, class_id: str) -> dict:
    """
    Generate and store embeddings for section content in Qdrant.

    Args:
        section_id: Section identifier
        content: Section text content
        class_id: Class/course identifier

    Returns:
        Dict with vector_id and metadata
    """
    try:
        metadata = {
            "section_id": section_id,
            "class_id": class_id,
            "content_type": "section"
        }

        vector_id = store_embedding("course_content", content, metadata)

        return {
            "vector_id": vector_id,
            "section_id": section_id,
            "class_id": class_id,
            "success": True
        }

    except Exception as e:
        logger.error(f"Error in store_embeddings: {e}")
        return {
            "section_id": section_id,
            "success": False,
            "error": str(e)
        }


@function_tool
def search_vector_db(
    query: str,
    class_id: Optional[str] = None,
    section_id: Optional[str] = None,
    limit: int = 5
) -> list[dict]:
    """
    Semantic search in Qdrant for relevant content (RAG retrieval).

    Args:
        query: User query or student question
        class_id: Optional - filter to specific class
        section_id: Optional - limit search to specific section
        limit: Number of results to return

    Returns:
        List of dicts with content and metadata
    """
    try:
        # Generate query embedding
        query_embedding = generate_embedding(query)

        # Build filter
        filter_conditions = []
        if class_id:
            filter_conditions.append(
                FieldCondition(key="class_id", match=MatchValue(value=class_id))
            )
        if section_id:
            filter_conditions.append(
                FieldCondition(key="section_id", match=MatchValue(value=section_id))
            )

        search_filter = Filter(must=filter_conditions) if filter_conditions else None

        # Search Qdrant
        client = get_qdrant_client()
        results = client.search(
            collection_name="course_content",
            query_vector=query_embedding,
            query_filter=search_filter,
            limit=limit
        )

        # Format results
        formatted_results = []
        for result in results:
            formatted_results.append({
                "content": result.payload.get("content", ""),
                "score": result.score,
                "section_id": result.payload.get("section_id"),
                "class_id": result.payload.get("class_id"),
                "metadata": result.payload
            })

        logger.info(f"Found {len(formatted_results)} results for query")
        return formatted_results

    except Exception as e:
        logger.error(f"Error searching vector DB: {e}")
        return []


@function_tool
def generate_and_store_embeddings(section_list: list[dict], class_id: str) -> dict:
    """
    Batch generate and store embeddings for multiple sections.
    Called after PDF Parser creates sections.

    Args:
        section_list: List of dicts with section_id and content
        class_id: Class/course identifier

    Returns:
        Dict with vector_ids and metadata
    """
    try:
        results = []
        success_count = 0
        failure_count = 0

        for section in section_list:
            section_id = section.get("section_id")
            content = section.get("content")

            if not section_id or not content:
                logger.warning(f"Skipping section with missing data: {section}")
                failure_count += 1
                continue

            try:
                result = store_embeddings(section_id, content, class_id)
                results.append(result)
                if result.get("success"):
                    success_count += 1
                else:
                    failure_count += 1
            except Exception as e:
                logger.error(f"Error processing section {section_id}: {e}")
                failure_count += 1

        return {
            "total": len(section_list),
            "success": success_count,
            "failures": failure_count,
            "results": results
        }

    except Exception as e:
        logger.error(f"Error in batch embedding generation: {e}")
        return {
            "total": len(section_list),
            "success": 0,
            "failures": len(section_list),
            "error": str(e)
        }


@function_tool
def qdrant_search_with_filters(
    query: str,
    class_id: str,
    section_ids: Optional[list[str]] = None,
    limit: int = 5
) -> list[dict]:
    """
    Advanced semantic search with filtering.

    Args:
        query: Search query
        class_id: Filter to specific class
        section_ids: Optional - filter to specific sections
        limit: Number of results

    Returns:
        List of dicts with content and metadata
    """
    try:
        query_embedding = generate_embedding(query)

        filter_conditions = [
            FieldCondition(key="class_id", match=MatchValue(value=class_id))
        ]

        # Add section filter if provided
        if section_ids and len(section_ids) > 0:
            # Qdrant supports "any" matching for lists
            for section_id in section_ids:
                filter_conditions.append(
                    FieldCondition(key="section_id", match=MatchValue(value=section_id))
                )

        search_filter = Filter(must=filter_conditions)

        client = get_qdrant_client()
        results = client.search(
            collection_name="course_content",
            query_vector=query_embedding,
            query_filter=search_filter,
            limit=limit
        )

        formatted_results = []
        for result in results:
            formatted_results.append({
                "content": result.payload.get("content", ""),
                "score": result.score,
                "section_id": result.payload.get("section_id"),
                "class_id": result.payload.get("class_id"),
                "metadata": result.payload
            })

        return formatted_results

    except Exception as e:
        logger.error(f"Error in filtered search: {e}")
        return []


@function_tool
def delete_class_embeddings(class_id: str) -> dict:
    """
    Delete all embeddings for a class when deleting course.

    Args:
        class_id: Course identifier

    Returns:
        Dict with deletion status
    """
    try:
        client = get_qdrant_client()

        # Delete from course_content collection
        client.delete(
            collection_name="course_content",
            points_selector=Filter(
                must=[
                    FieldCondition(key="class_id", match=MatchValue(value=class_id))
                ]
            )
        )

        logger.info(f"Deleted embeddings for class {class_id}")
        return {
            "class_id": class_id,
            "success": True,
            "message": "Embeddings deleted successfully"
        }

    except Exception as e:
        logger.error(f"Error deleting class embeddings: {e}")
        return {
            "class_id": class_id,
            "success": False,
            "error": str(e)
        }
