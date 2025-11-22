"""
Text processing utilities for chunking and cleaning text.
"""

from typing import List
import re


def clean_text(text: str) -> str:
    """
    Clean extracted text by removing extra whitespace and normalizing.

    Args:
        text: Raw text to clean

    Returns:
        Cleaned text
    """
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove page numbers and common artifacts
    text = re.sub(r'\n\d+\n', '\n', text)
    # Normalize line breaks
    text = text.replace('\r\n', '\n')
    return text.strip()


def chunk_text(
    text: str,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
    separator: str = "\n\n"
) -> List[str]:
    """
    Split text into chunks for embedding generation.

    Uses semantic chunking by splitting on paragraph boundaries when possible,
    with overlap to maintain context.

    Args:
        text: Text to chunk
        chunk_size: Target size of each chunk in characters
        chunk_overlap: Number of characters to overlap between chunks
        separator: Primary separator (paragraph boundaries)

    Returns:
        List of text chunks
    """
    if not text or len(text) == 0:
        return []

    # If text is smaller than chunk_size, return as is
    if len(text) <= chunk_size:
        return [text]

    chunks = []

    # Split by separator first (paragraphs)
    paragraphs = text.split(separator)

    current_chunk = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        # If adding this paragraph exceeds chunk_size
        if len(current_chunk) + len(para) + len(separator) > chunk_size:
            if current_chunk:
                chunks.append(current_chunk.strip())
                # Add overlap from end of previous chunk
                overlap_text = current_chunk[-chunk_overlap:] if len(current_chunk) > chunk_overlap else current_chunk
                current_chunk = overlap_text + separator + para
            else:
                # Single paragraph is larger than chunk_size, split it
                chunks.extend(split_long_paragraph(para, chunk_size, chunk_overlap))
                current_chunk = ""
        else:
            if current_chunk:
                current_chunk += separator + para
            else:
                current_chunk = para

    # Add remaining chunk
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks


def split_long_paragraph(paragraph: str, chunk_size: int, chunk_overlap: int) -> List[str]:
    """
    Split a long paragraph that exceeds chunk_size.

    Args:
        paragraph: Long paragraph to split
        chunk_size: Target chunk size
        chunk_overlap: Overlap size

    Returns:
        List of chunks
    """
    chunks = []
    start = 0

    while start < len(paragraph):
        end = start + chunk_size

        # If this is not the last chunk, try to break at sentence boundary
        if end < len(paragraph):
            # Look for sentence endings near the chunk boundary
            sentence_end = paragraph.rfind('. ', start, end + 100)
            if sentence_end > start:
                end = sentence_end + 1

        chunk = paragraph[start:end].strip()
        if chunk:
            chunks.append(chunk)

        # Move start position with overlap
        start = end - chunk_overlap if end < len(paragraph) else len(paragraph)

    return chunks


def extract_metadata_from_text(text: str, page_num: int = None) -> dict:
    """
    Extract metadata from text chunk.

    Args:
        text: Text chunk
        page_num: Page number if available

    Returns:
        Metadata dict
    """
    metadata = {
        "char_count": len(text),
        "word_count": len(text.split()),
    }

    if page_num is not None:
        metadata["page_number"] = page_num

    # Try to identify if this is a heading/title
    lines = text.strip().split('\n')
    if lines:
        first_line = lines[0].strip()
        # Simple heuristic: short first line might be a heading
        if len(first_line) < 100 and len(first_line) > 3:
            metadata["potential_heading"] = first_line

    return metadata
