#!/usr/bin/env python3
"""
Simple script to test OpenAI API key
"""

import os
import sys

try:
    from openai import OpenAI
except ImportError:
    print("❌ OpenAI package not found. Install it with:")
    print("   pip install openai")
    sys.exit(1)

def test_openai_key():
    # Try to get API key from environment
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("🔑 OPENAI_API_KEY not found in environment.")
        api_key = input("Please paste your OpenAI API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided")
        sys.exit(1)
    
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)
    
    print("\n🧪 Testing OpenAI API key...")
    print("📤 Sending request: 'What is ChatGPT?'\n")
    
    try:
        # Make a simple request
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": "What is ChatGPT?"}
            ],
            max_tokens=150
        )
        
        # Extract response
        answer = response.choices[0].message.content
        
        print("✅ API Key is working!\n")
        print("📥 Response:")
        print("-" * 50)
        print(answer)
        print("-" * 50)
        print(f"\n📊 Model used: {response.model}")
        print(f"🎯 Tokens used: {response.usage.total_tokens}")
        print("\n✨ Your OpenAI API key is valid and working!")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\nPossible reasons:")
        print("  • Invalid API key")
        print("  • No credits in your account")
        print("  • Network connection issues")
        print("  • API key doesn't have proper permissions")
        sys.exit(1)

if __name__ == "__main__":
    test_openai_key()
