# Quick Start Guide - 5 Minutes to Running System

**Get the agentic AI tutor running in 5 minutes**

---

## ⚡ Super Quick Start

```bash
# 1. Clone and navigate
git clone <repo-url>
cd pdf-to-class-ai

# 2. Backend setup
cd apps/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 3. Start services
cd ../..
docker-compose up -d postgres qdrant

# 4. Run backend
cd apps/api
uvicorn src.main:app --reload
# Backend running at http://localhost:8000

# 5. Frontend (new terminal)
cd apps/web
pnpm install
cp .env.example .env
pnpm dev
# Frontend running at http://localhost:5173
```

**Done!** 🎉

---

## ✅ Verify It's Working

1. **Backend**: http://localhost:8000
   - Should show API info with agents and features

2. **API Docs**: http://localhost:8000/docs
   - Interactive Swagger UI

3. **Frontend**: http://localhost:5173
   - Should see "Backend connected" indicator

4. **Run Tests**:
   ```bash
   cd apps/api
   python test_full_system.py
   # Should show: 🎉 ALL TESTS PASSED!
   ```

---

## 🎯 Try It Out

### Test Chat with Tutor Agent

```bash
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session",
    "message": "What is photosynthesis?",
    "class_id": "test_class"
  }'
```

Response will show:
- Explanation based on course material
- Examples
- Follow-up questions
- Next action suggestion

### Test Quiz Evaluation

```bash
curl -X POST http://localhost:8000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test_session",
    "question_id": "q1",
    "answer": "Chloroplasts",
    "section_id": "test_section"
  }'
```

Response will show:
- Correctness
- Feedback and explanation
- Adaptive difficulty adjustment
- Next step recommendation

---

## 📝 What You Need

**Required**:
- Python 3.11+
- Node.js 18+
- Docker Desktop
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

**Time**: 5-10 minutes
**Cost**: ~$0.01-0.10 per hour of usage

---

## 🚨 Troubleshooting

**Backend won't start?**
```bash
# Check OpenAI key is set
cat apps/api/.env | grep OPENAI_API_KEY

# Should show: OPENAI_API_KEY=sk-proj-...
```

**Frontend can't connect?**
```bash
# Check backend is running
curl http://localhost:8000/health

# Should return: {"status": "ok", ...}
```

**Docker services not running?**
```bash
# Check status
docker-compose ps

# Should show postgres and qdrant as "Up"
```

---

## 📚 Next Steps

1. **Upload a PDF**: Use `/api/pdf/upload` endpoint
2. **Start a Session**: Use `/api/learning/session/start`
3. **Chat with Tutor**: Use `/api/chat/message`
4. **Take a Quiz**: Use `/api/quiz/submit`

See `DEPLOYMENT_GUIDE.md` for full details and production setup.

---

## 🎊 System Overview

You now have running:
- ✅ **FastAPI backend** with 4 AI agents
- ✅ **React frontend** with shadcn UI
- ✅ **PostgreSQL** database
- ✅ **Qdrant** vector database for RAG
- ✅ **OpenAI GPT-4** agents

**Features**:
- Proactive teaching (agent drives sessions)
- RAG-powered responses from PDF content
- Web search fallback
- Adaptive quiz difficulty
- Auto-pacing detection
- Break suggestions (30-45 min)

**Enjoy building!** 🚀
