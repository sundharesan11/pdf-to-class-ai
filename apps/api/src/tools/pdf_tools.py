"""
PDF extraction and processing tools.
"""

from agents import function_tool
from PyPDF2 import PdfReader
from io import BytesIO
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


@function_tool
def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text content from a PDF file.

    Args:
        pdf_path: Path to the PDF file

    Returns:
        Extracted text content from the PDF
    """
    try:
        path = Path(pdf_path)
        if not path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        reader = PdfReader(str(path))
        text_content = []

        for page_num, page in enumerate(reader.pages, start=1):
            try:
                page_text = page.extract_text()
                if page_text:
                    # Add page marker for reference
                    text_content.append(f"\n--- Page {page_num} ---\n{page_text}")
            except Exception as e:
                logger.warning(f"Error extracting text from page {page_num}: {e}")
                continue

        full_text = "\n".join(text_content)
        logger.info(f"Extracted {len(full_text)} characters from {len(reader.pages)} pages")

        return full_text

    except Exception as e:
        logger.error(f"Error extracting PDF: {e}")
        raise RuntimeError(f"Failed to extract text from PDF: {str(e)}")


@function_tool
def extract_pdf_from_bytes(file_content: bytes) -> str:
    """
    Extract text from PDF file content (bytes).

    Args:
        file_content: Raw PDF file bytes

    Returns:
        Extracted text content
    """
    try:
        # Create a file-like object from bytes
        pdf_file = BytesIO(file_content)
        reader = PdfReader(pdf_file)
        text_content = []

        for page_num, page in enumerate(reader.pages, start=1):
            try:
                page_text = page.extract_text()
                if page_text:
                    text_content.append(f"\n--- Page {page_num} ---\n{page_text}")
            except Exception as e:
                logger.warning(f"Error extracting text from page {page_num}: {e}")
                continue

        full_text = "\n".join(text_content)
        logger.info(f"Extracted {len(full_text)} characters from {len(reader.pages)} pages")

        return full_text

    except Exception as e:
        logger.error(f"Error extracting PDF from bytes: {e}")
        raise RuntimeError(f"Failed to extract text from PDF: {str(e)}")


@function_tool
def get_pdf_metadata(pdf_path: str) -> dict:
    """
    Extract metadata from PDF file.

    Args:
        pdf_path: Path to PDF file

    Returns:
        Dict with PDF metadata (page count, title, etc.)
    """
    try:
        reader = PdfReader(pdf_path)
        metadata = {
            "page_count": len(reader.pages),
            "title": reader.metadata.title if reader.metadata else None,
            "author": reader.metadata.author if reader.metadata else None,
            "subject": reader.metadata.subject if reader.metadata else None,
        }
        return metadata
    except Exception as e:
        logger.error(f"Error extracting PDF metadata: {e}")
        return {"page_count": 0, "error": str(e)}
