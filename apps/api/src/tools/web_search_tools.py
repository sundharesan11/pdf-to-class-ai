"""
Web search tools for external knowledge retrieval.
"""

from agents import function_tool
import logging
import httpx
from typing import List, Dict

logger = logging.getLogger(__name__)


@function_tool
def search_web(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    """
    Search the web for information when PDF content is insufficient.

    Uses DuckDuckGo as a simple fallback search engine.
    For production, consider using Tavily, SerpAPI, or Google Custom Search.

    Args:
        query: Search query
        max_results: Maximum number of results to return

    Returns:
        List of dicts with title, snippet, and url
    """
    try:
        # For now, return a mock response
        # In production, integrate with a real search API
        logger.info(f"Web search query: {query}")

        # Mock results for demonstration
        results = [
            {
                "title": f"Search result for: {query}",
                "snippet": "This is external web content that would be retrieved from a search engine. "
                          "In production, this would use Tavily API, SerpAPI, or similar service.",
                "url": "https://example.com/search-result",
                "source": "external"
            }
        ]

        logger.info(f"Retrieved {len(results)} web search results")
        return results[:max_results]

    except Exception as e:
        logger.error(f"Error performing web search: {e}")
        return []


@function_tool
def fetch_url_content(url: str) -> str:
    """
    Fetch content from a specific URL.

    Args:
        url: URL to fetch

    Returns:
        Text content from the URL
    """
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)
            response.raise_for_status()

            # Simple text extraction (in production, use BeautifulSoup or similar)
            content = response.text[:2000]  # Limit content length

            logger.info(f"Fetched content from {url}")
            return content

    except Exception as e:
        logger.error(f"Error fetching URL content: {e}")
        return ""


# Production-ready web search integration (commented out - requires API key)
"""
# Example with Tavily API (recommended for production)
from tavily import TavilyClient

tavily_client = TavilyClient(api_key=settings.tavily_api_key)

@function_tool
def search_web_tavily(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    try:
        response = tavily_client.search(
            query=query,
            max_results=max_results,
            search_depth="basic"
        )

        results = []
        for item in response.get("results", []):
            results.append({
                "title": item.get("title", ""),
                "snippet": item.get("content", ""),
                "url": item.get("url", ""),
                "source": "tavily"
            })

        return results
    except Exception as e:
        logger.error(f"Tavily search error: {e}")
        return []
"""
