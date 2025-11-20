"""
PDF extraction and processing tools.
"""

from agents import function_tool


@function_tool
def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text content from a PDF file.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Extracted text content from the PDF
    """
    # TODO: Implement PDF extraction using PyPDF2
    pass


@function_tool
def extract_pdf_with_path(file_content: bytes) -> str:
    """
    Extract text from PDF file content (bytes).
    
    Args:
        file_content: Raw PDF file bytes
        
    Returns:
        Extracted text content
    """
    # TODO: Implement extraction from bytes
    pass
