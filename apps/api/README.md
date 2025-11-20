# @eduagent/api

Python backend for EduAgent platform built with FastAPI, OpenAI Agents SDK, PostgreSQL, and Qdrant.

## Tech Stack

- **Framework**: FastAPI + Python 3.11+
- **AI Framework**: OpenAI Agents SDK
- **Database**: PostgreSQL + SQLAlchemy ORM
- **Vector DB**: Qdrant
- **Auth**: JWT + Bcrypt
- **File Upload**: Python multipart

## Prerequisites

1. **Python 3.11+** and **pip/uv**
2. **PostgreSQL** database running
3. **Qdrant** vector database (local or cloud)
4. **OpenAI API Key**

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup PostgreSQL

```bash
# Create database
createdb eduagent

# Or using psql
psql -U postgres
CREATE DATABASE eduagent;
```

### 4. Setup Qdrant

**Option A: Docker (Recommended)**
```bash
docker run -p 6333:6333 qdrant/qdrant
```

**Option B: Cloud**
Sign up at https://qdrant.tech and get your cluster URL and API key.

### 5. Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string (e.g., postgresql://user:password@localhost/eduagent)
- `QDRANT_URL` - Qdrant server URL (e.g., http://localhost:6333)
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET` - Secret for JWT signing

### 6. Run Database Migrations

```bash
alembic upgrade head
```

## Development

```bash
# Run dev server with hot reload
python -m uvicorn src.main:app --reload --port 8000

# Run tests
pytest

# Run with specific log level
python -m uvicorn src.main:app --reload --log-level debug
```

The API will be available at http://localhost:8000

API documentation will be available at http://localhost:8000/docs

## Project Structure

```
src/
├── agents/              # OpenAI agents
│   ├── base_agent.py
│   ├── pdf_parser_agent.py
│   ├── tutor_agent.py
│   ├── quiz_agent.py
│   ├── content_generator_agent.py
│   └── orchestrator_agent.py
├── api/                 # FastAPI routes
│   ├── auth.py
│   ├── classes.py
│   ├── pdf.py
│   ├── chat.py
│   ├── learning.py
│   └── analytics.py
├── services/            # Business logic
│   ├── user_service.py
│   ├── class_service.py
│   ├── pdf_service.py
│   ├── chat_service.py
│   ├── progress_service.py
│   └── qdrant_service.py
├── models/              # Database models
│   ├── user.py
│   ├── class_model.py
│   ├── section.py
│   ├── quiz.py
│   ├── progress.py
│   └── chat.py
├── db/                  # Database setup
│   ├── database.py
│   └── migrations/
├── utils/               # Utilities
│   ├── auth_utils.py
│   ├── validators.py
│   ├── embeddings.py
│   └── pdf_utils.py
├── config.py            # Configuration
├── main.py              # App entry point
└── middleware.py        # Custom middleware
```

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/refresh
POST /api/auth/logout
```

### Classes

```
GET  /api/classes
POST /api/classes
GET  /api/classes/{id}
PUT  /api/classes/{id}
DELETE /api/classes/{id}
POST /api/classes/{id}/join
GET  /api/classes/{id}/students
GET  /api/classes/{id}/analytics
```

### PDF Upload & Processing

```
POST /api/pdf/upload
GET  /api/pdf/{id}/structure
PUT  /api/pdf/{id}/structure
POST /api/pdf/{id}/generate-quiz
```

### Chat & Learning

```
POST /api/chat/message
GET  /api/chat/history/{classId}
GET  /api/learning/class/{id}/content
GET  /api/learning/section/{id}
POST /api/learning/quiz/submit
GET  /api/learning/progress
```

### Analytics

```
GET /api/analytics/teacher/overview
GET /api/analytics/student/{id}
GET /api/analytics/class/{id}
```

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_agents.py

# Run with verbose output
pytest -v
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| QDRANT_URL | Qdrant server URL | http://localhost:6333 |
| QDRANT_API_KEY | Qdrant API key (optional) | - |
| OPENAI_API_KEY | OpenAI API key | - |
| JWT_SECRET | Secret for JWT signing | - |
| PORT | Server port | 8000 |
| HOST | Server host | 0.0.0.0 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |
| LOG_LEVEL | Logging level | INFO |

## Docker Deployment

```bash
# Build image
docker build -t eduagent-api .

# Run container
docker run -p 8000:8000 --env-file .env eduagent-api

# Or use docker-compose
docker-compose up -d api
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready -h localhost

# Test connection
psql postgresql://user:password@localhost/eduagent
```

### Qdrant Connection Issues

```bash
# Check if Qdrant is running
curl http://localhost:6333/health
```

### OpenAI API Issues

Ensure your API key has sufficient credits and proper permissions.

## Scripts

```bash
python -m uvicorn src.main:app --reload              # Dev server
pytest                                                # Run tests
pytest --cov=src                                     # Coverage
alembic upgrade head                                 # Migrations
alembic revision --autogenerate -m "description"   # Generate migration
```

## Production Deployment

1. Set all environment variables
2. Build Docker image: `docker build -t eduagent-api .`
3. Run migrations: `alembic upgrade head`
4. Start server: `python -m uvicorn src.main:app --host 0.0.0.0 --port 8000`

Consider using:
- Docker for containerization
- Gunicorn for production ASGI server
- Nginx for reverse proxy
- Kubernetes for orchestration

---

**Built with** ❤️ **by the EduAgent team**
