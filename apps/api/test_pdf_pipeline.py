#!/usr/bin/env python3
"""
Test script for PDF processing and Qdrant integration.
"""

import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.tools.pdf_tools import extract_text_from_pdf, get_pdf_metadata
from src.utils.text_processing import chunk_text, clean_text
from src.tools.qdrant_tools import generate_embedding, store_embeddings, search_vector_db
from src.utils.qdrant_client import init_qdrant_collections, get_qdrant_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')


def test_pdf_extraction():
    """Test PDF text extraction."""
    print("\n" + "=" * 60)
    print("TEST 1: PDF Text Extraction")
    print("=" * 60)

    pdf_path = "../../test/data/05-versions-space.pdf"

    if not os.path.exists(pdf_path):
        print(f"❌ Test PDF not found: {pdf_path}")
        return False

    try:
        # Test metadata extraction
        print("\n📋 Extracting metadata...")
        metadata = get_pdf_metadata(pdf_path)
        print(f"  Page count: {metadata.get('page_count')}")
        print(f"  Title: {metadata.get('title', 'N/A')}")

        # Test text extraction
        print("\n📄 Extracting text...")
        text = extract_text_from_pdf(pdf_path)
        print(f"  Extracted {len(text)} characters")
        print(f"  First 200 chars:\n  {text[:200]}...")

        print("\n✅ PDF extraction test passed!")
        return True

    except Exception as e:
        print(f"\n❌ PDF extraction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_text_chunking():
    """Test text chunking strategy."""
    print("\n" + "=" * 60)
    print("TEST 2: Text Chunking")
    print("=" * 60)

    sample_text = """
    Photosynthesis is the process by which plants convert light energy into chemical energy.
    
    This process occurs in the chloroplasts of plant cells. The chloroplasts contain chlorophyll,
    which is the green pigment that captures light energy.
    
    The process can be divided into two main stages: light-dependent reactions and light-independent
    reactions (also known as the Calvin cycle).
    
    In the light-dependent reactions, light energy is captured and used to produce ATP and NADPH.
    These energy-rich molecules are then used in the Calvin cycle to fix carbon dioxide into glucose.
    """

    try:
        print("\n✂️  Chunking text...")
        chunks = chunk_text(sample_text, chunk_size=150, chunk_overlap=30)

        print(f"  Created {len(chunks)} chunks")
        for i, chunk in enumerate(chunks, 1):
            print(f"\n  Chunk {i} ({len(chunk)} chars):")
            print(f"  {chunk[:100]}...")

        print("\n✅ Text chunking test passed!")
        return True

    except Exception as e:
        print(f"\n❌ Text chunking test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_embedding_generation():
    """Test OpenAI embedding generation."""
    print("\n" + "=" * 60)
    print("TEST 3: Embedding Generation")
    print("=" * 60)

    test_text = "Photosynthesis is how plants convert light into energy."

    try:
        print("\n🔮 Generating embedding...")
        embedding = generate_embedding(test_text)

        print(f"  Embedding dimension: {len(embedding)}")
        print(f"  First 5 values: {embedding[:5]}")

        if len(embedding) != 1536:
            print(f"  ⚠️  Expected 1536 dimensions, got {len(embedding)}")
            return False

        print("\n✅ Embedding generation test passed!")
        return True

    except Exception as e:
        print(f"\n❌ Embedding generation test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_qdrant_integration():
    """Test Qdrant storage and search."""
    print("\n" + "=" * 60)
    print("TEST 4: Qdrant Integration")
    print("=" * 60)

    try:
        # Initialize collections
        print("\n🗄️  Initializing Qdrant collections...")
        init_qdrant_collections()

        # Store test data
        print("\n💾 Storing test embeddings...")
        test_data = [
            {
                "content": "Photosynthesis occurs in chloroplasts and converts light energy to chemical energy.",
                "section_id": "test_section_1",
                "class_id": "test_class_1"
            },
            {
                "content": "Chlorophyll is the green pigment that captures light energy during photosynthesis.",
                "section_id": "test_section_2",
                "class_id": "test_class_1"
            },
            {
                "content": "The Calvin cycle is the light-independent reaction in photosynthesis.",
                "section_id": "test_section_3",
                "class_id": "test_class_1"
            }
        ]

        for item in test_data:
            result = store_embeddings(
                section_id=item["section_id"],
                content=item["content"],
                class_id=item["class_id"]
            )
            print(f"  Stored: {item['section_id']} - {result.get('vector_id', 'N/A')}")

        # Test search
        print("\n🔍 Testing semantic search...")
        query = "How do plants capture light?"
        results = search_vector_db(query, class_id="test_class_1", limit=3)

        print(f"\n  Query: '{query}'")
        print(f"  Found {len(results)} results:\n")

        for i, result in enumerate(results, 1):
            print(f"  {i}. Score: {result['score']:.4f}")
            print(f"     Content: {result['content'][:80]}...")
            print()

        print("✅ Qdrant integration test passed!")
        return True

    except Exception as e:
        print(f"\n❌ Qdrant integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("🧪 PDF PROCESSING & QDRANT PIPELINE TESTS")
    print("=" * 60)

    # Check environment
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key or api_key == 'sk-your-api-key-here':
        print("\n⚠️  WARNING: OPENAI_API_KEY not set in .env file")
        print("Please set your OpenAI API key in apps/api/.env")
        return

    tests = [
        ("PDF Extraction", test_pdf_extraction),
        ("Text Chunking", test_text_chunking),
        ("Embedding Generation", test_embedding_generation),
        ("Qdrant Integration", test_qdrant_integration),
    ]

    results = []
    for test_name, test_func in tests:
        passed = test_func()
        results.append((test_name, passed))

    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60 + "\n")

    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)

    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"  {status}: {test_name}")

    print(f"\n  Total: {passed_count}/{total_count} tests passed")

    if passed_count == total_count:
        print("\n🎉 All tests passed! PDF processing pipeline is ready.")
    else:
        print(f"\n⚠️  {total_count - passed_count} test(s) failed. Please review errors above.")


if __name__ == "__main__":
    main()
