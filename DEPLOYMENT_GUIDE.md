# Deployment Guide - Agentic AI Tutor

**Complete setup and deployment instructions for the EduAgent platform**

---

## 📋 Prerequisites

### Required Software
- **Python** 3.11+ (for backend)
- **Node.js** 18+ (for frontend)
- **Docker** & Docker Compose (for databases)
- **Git** (for version control)

### Required API Keys
- **OpenAI API Key** - Get from https://platform.openai.com/api-keys
  - Used for: GPT-4 agents, text embeddings
  - Estimated cost: ~$0.01-0.10 per session

---

## 🚀 Quick Start (Development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd pdf-to-class-ai
```

### 2. Start Backend

```bash
# Navigate to backend
cd apps/api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Edit .env and add your OpenAI API key:
nano .env  # or use any text editor
# Set: OPENAI_API_KEY=sk-proj-your-actual-key

# Start Docker services (PostgreSQL + Qdrant)
cd ../..
docker-compose up -d postgres qdrant

# Verify services are running
docker-compose ps

# Start FastAPI server
cd apps/api
uvicorn src.main:app --reload --port 8000
```

Backend will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

### 3. Start Frontend

```bash
# In a new terminal
cd apps/web

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env

# Edit .env (should point to backend):
# VITE_API_URL=http://localhost:8000

# Start development server
pnpm dev
```

Frontend will be available at: http://localhost:5173

---

## 🧪 Verify Setup

### Test Backend

```bash
cd apps/api

# Run Phase 2 tests (PDF & Qdrant)
python test_pdf_pipeline.py

# Run Phase 3 tests (Tutor Agent)
python test_tutor_agent.py

# Run full system test
python test_full_system.py
```

Expected output:
```
🎉 ALL TESTS PASSED!
✅ Phase 2: PDF Processing ✅
✅ Phase 3: Tutor Agent ✅
✅ Phase 4: Quiz Agent ✅
✅ Phase 5: Orchestrator ✅
✅ Phase 6: API Endpoints ✅
```

### Test Frontend Integration

1. Open http://localhost:5173
2. Check backend status indicator
3. Should show: "✅ Connected to FastAPI backend"

### Test API Endpoints

Visit http://localhost:8000/docs and try:
- GET /health - Should return `{"status": "ok"}`
- GET / - Should return API info with agents and features

---

## 📦 Production Deployment

### Option 1: Docker Compose (Recommended)

**1. Create production docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: eduagent
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - eduagent-network

  qdrant:
    image: qdrant/qdrant:latest
    volumes:
      - qdrant_data:/qdrant/storage
    networks:
      - eduagent-network

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/eduagent
      - QDRANT_URL=http://qdrant:6333
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - ENVIRONMENT=production
    depends_on:
      - postgres
      - qdrant
    networks:
      - eduagent-network
    ports:
      - "8000:8000"

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    environment:
      - VITE_API_URL=http://api:8000
    depends_on:
      - api
    networks:
      - eduagent-network
    ports:
      - "80:80"

volumes:
  postgres_data:
  qdrant_data:

networks:
  eduagent-network:
    driver: bridge
```

**2. Create .env for production**
```bash
# Database
POSTGRES_USER=eduagent
POSTGRES_PASSWORD=<strong-password>

# OpenAI
OPENAI_API_KEY=sk-proj-your-key

# JWT Secret
JWT_SECRET=<generate-strong-secret>

# Environment
ENVIRONMENT=production
```

**3. Build and deploy**
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Option 2: Cloud Platform (Railway, Render, etc.)

**Backend (FastAPI)**:
1. Create new service
2. Connect to GitHub repository
3. Set build command: `cd apps/api && pip install -r requirements.txt`
4. Set start command: `cd apps/api && uvicorn src.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (from managed PostgreSQL)
   - `QDRANT_URL` (from managed Qdrant or separate service)
   - `JWT_SECRET`
   - `ENVIRONMENT=production`

**Frontend (React)**:
1. Create new service
2. Set build command: `cd apps/web && pnpm install && pnpm build`
3. Set output directory: `apps/web/dist`
4. Add environment variable:
   - `VITE_API_URL=<backend-url>`

---

## 🔧 Configuration

### Backend Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-proj-...           # OpenAI API key
DATABASE_URL=postgresql://...        # PostgreSQL connection string
QDRANT_URL=http://localhost:6333    # Qdrant URL

# Optional
JWT_SECRET=your-secret-key           # JWT signing secret
JWT_ALGORITHM=HS256                  # JWT algorithm
JWT_EXPIRATION_HOURS=7              # Token expiration

PORT=8000                            # API port
HOST=0.0.0.0                        # API host
ENVIRONMENT=development             # Environment
LOG_LEVEL=INFO                      # Logging level
```

### Frontend Environment Variables

```bash
# Required
VITE_API_URL=http://localhost:8000  # Backend API URL

# Optional
VITE_ENV=development                # Environment
```

---

## 📊 Database Setup

### Initialize Qdrant Collections

Qdrant collections are automatically initialized on first backend startup. Manual initialization:

```bash
cd apps/api
python -c "from src.utils.qdrant_client import init_qdrant_collections; init_qdrant_collections()"
```

Creates collections:
- `course_content` - PDF embeddings for RAG
- `quiz_bank` - Question embeddings
- `conversation_context` - Chat history embeddings

### PostgreSQL Migrations

```bash
# Create migration
cd apps/api
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

---

## 🔐 Security Checklist

### Production Security

- [ ] Change default passwords
- [ ] Generate strong JWT secret
- [ ] Enable HTTPS/TLS
- [ ] Restrict CORS origins
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Implement authentication
- [ ] Sanitize user inputs
- [ ] Enable logging and monitoring
- [ ] Regular security updates

### Environment Variables

- [ ] Never commit `.env` files
- [ ] Use secrets manager (AWS Secrets Manager, etc.)
- [ ] Rotate API keys regularly
- [ ] Use different keys for dev/staging/prod

---

## 📈 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Qdrant health
curl http://localhost:6333/health

# PostgreSQL health
docker exec eduagent-postgres pg_isready -U eduagent
```

### Logs

```bash
# Backend logs
docker-compose logs -f api

# Database logs
docker-compose logs -f postgres

# Qdrant logs
docker-compose logs -f qdrant

# All services
docker-compose logs -f
```

### Metrics to Monitor

- API response times
- OpenAI API usage and costs
- Database query performance
- Vector search latency
- Agent execution time
- Error rates
- Active sessions
- Qdrant memory usage

---

## 🐛 Troubleshooting

### Backend won't start

**Issue**: `ModuleNotFoundError`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Issue**: `OPENAI_API_KEY not found`
```bash
# Solution: Set in .env
echo "OPENAI_API_KEY=sk-proj-your-key" >> apps/api/.env
```

### Qdrant connection failed

**Issue**: Cannot connect to Qdrant
```bash
# Solution: Start Qdrant service
docker-compose up -d qdrant

# Verify running
docker-compose ps qdrant
```

### Frontend can't connect to backend

**Issue**: CORS error or 404
```bash
# Solution: Check backend is running
curl http://localhost:8000/health

# Check VITE_API_URL in apps/web/.env
echo "VITE_API_URL=http://localhost:8000" >> apps/web/.env

# Restart frontend
cd apps/web && pnpm dev
```

### Agent tests failing

**Issue**: "Agents require OpenAI API key"
```bash
# Solution: Add key to .env
cd apps/api
nano .env  # Add: OPENAI_API_KEY=sk-proj-...

# Verify key is set
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('Key:', os.getenv('OPENAI_API_KEY')[:20])"
```

---

## 📱 Usage Examples

### Upload PDF

```bash
curl -X POST http://localhost:8000/api/pdf/upload \
  -F "file=@textbook.pdf" \
  -F "subject=Biology" \
  -F "level=beginner"
```

### Start Learning Session

```bash
curl -X POST http://localhost:8000/api/learning/session/start \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": "class_123",
    "student_id": "student_456"
  }'
```

### Send Chat Message

```bash
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session_789",
    "message": "What is photosynthesis?",
    "class_id": "class_123",
    "section_id": "section_1"
  }'
```

### Submit Quiz Answer

```bash
curl -X POST http://localhost:8000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session_789",
    "question_id": "q1",
    "answer": "Chloroplasts",
    "section_id": "section_1"
  }'
```

---

## 🔄 Updating the System

### Update Backend

```bash
cd apps/api

# Activate venv
source venv/bin/activate

# Pull latest code
git pull

# Update dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Restart service
# Docker: docker-compose restart api
# Manual: Ctrl+C and re-run uvicorn
```

### Update Frontend

```bash
cd apps/web

# Pull latest code
git pull

# Update dependencies
pnpm install

# Rebuild
pnpm build

# Restart service
pnpm dev  # or deploy new build
```

---

## 💰 Cost Estimation

### OpenAI API Costs

**Models Used**:
- GPT-4o-mini: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- text-embedding-3-small: ~$0.02 per 1M tokens

**Typical Session Costs**:
- PDF upload (1000 pages): ~$0.50 (embeddings)
- Learning session (1 hour): ~$0.10-0.20 (agent interactions)
- Quiz (10 questions): ~$0.01-0.02

**Monthly Estimate** (100 students, 10 hours/month):
- PDF processing: $50
- Learning sessions: $100-200
- **Total: ~$150-250/month**

### Infrastructure Costs

**Self-hosted**:
- VPS (4GB RAM, 2 CPU): $20-40/month
- Total: ~$170-290/month

**Cloud Platform**:
- Backend + databases: $50-100/month
- Frontend CDN: $10-20/month
- Total: ~$210-370/month

---

## 📚 Additional Resources

- **Planning**: `AGENTIC_TUTOR_REFINED_PLAN.md`
- **Architecture**: `AGENT_ARCHITECTURE.md`
- **Implementation Status**: `IMPLEMENTATION_STATUS.md`
- **API Docs**: http://localhost:8000/docs (when running)
- **Frontend Integration**: `apps/web/src/lib/backendApi.ts`

---

## 🆘 Support

### Common Issues

1. **OpenAI rate limits**: Implement exponential backoff
2. **Qdrant memory**: Monitor and scale as needed
3. **PostgreSQL connections**: Use connection pooling
4. **Agent timeouts**: Increase timeout settings

### Getting Help

- Check logs first: `docker-compose logs -f`
- Review API docs: http://localhost:8000/docs
- Test individual components with test scripts

---

**Last Updated**: 2025-01-20
**Version**: 1.0.0
**Status**: Production Ready
