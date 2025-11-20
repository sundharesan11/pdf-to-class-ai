# Project Structure - EduAgent (Reworked)

## Current State

```
pdf-to-class-ai/
├── apps/
│   ├── web/                        ✅ React frontend (UNCHANGED)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                        ✅ Python backend (NEW - To be implemented)
│       ├── .env
│       ├── .env.example
│       ├── .gitignore
│       ├── README.md
│       ├── Dockerfile
│       ├── requirements.txt
│       ├── pyproject.toml
│       ├── setup.py
│       ├── package.json (reference only)
│       └── src/                    📁 TO CREATE IN PHASE 1
│           ├── main.py
│           ├── config.py
│           ├── middleware.py
│           ├── agents/
│           ├── api/
│           ├── services/
│           ├── models/
│           ├── db/
│           └── utils/
│
├── packages/                       ⏳ Optional (if using shared types)
│   └── (future: shared Python types)
│
├── docker-compose.yml              ✅ All services (PostgreSQL, Qdrant, API)
├── REWORK_PLAN.md                 ✅ Detailed implementation plan
├── CLEANUP_SUMMARY.md             ✅ What was changed
├── PROJECT_STRUCTURE.md           ✅ This file
├── README.md                       (original project README)
├── package.json                    (minimal root config)
├── pnpm-workspace.yaml            (monorepo config)
└── turbo.json                     (minimal turbo config)

```

## File Purposes

### Root Level Files

| File | Purpose | Status |
|------|---------|--------|
| `REWORK_PLAN.md` | Complete implementation roadmap with 8 phases | ✅ Ready |
| `CLEANUP_SUMMARY.md` | What was removed/added during cleanup | ✅ Ready |
| `PROJECT_STRUCTURE.md` | This file - project layout | ✅ Ready |
| `docker-compose.yml` | Full stack services (PostgreSQL, Qdrant, API) | ✅ Ready |
| `package.json` | Root monorepo config (minimal) | ✅ Updated |
| `pnpm-workspace.yaml` | PNPM workspace definition | ⏳ Keep as-is |
| `turbo.json` | Turborepo config (minimal) | ⏳ Keep as-is |

### Frontend (`apps/web/`)

| File | Purpose |
|------|---------|
| `package.json` | Frontend dependencies (React, Vite, etc.) |
| `vite.config.ts` | Vite build configuration |
| `tsconfig.json` | TypeScript configuration |
| `src/` | React source code (ALL UNCHANGED) |

### Backend (`apps/api/`)

#### Configuration Files (Ready)

| File | Purpose |
|------|---------|
| `.env.example` | Environment variables template |
| `.env` | Local environment variables |
| `.gitignore` | Git ignore rules (Python-specific) |
| `requirements.txt` | Python package dependencies |
| `pyproject.toml` | Python project metadata |
| `setup.py` | Python package setup |
| `Dockerfile` | Docker container build |
| `README.md` | Backend documentation |
| `package.json` | Reference only (no Node) |

#### Source Code (To Create in Phase 1)

```
src/
├── main.py                  # FastAPI app entry point
├── config.py               # Configuration management
├── middleware.py           # Custom middleware
│
├── agents/                 # OpenAI Agents (Phase 3)
│   ├── __init__.py
│   ├── base_agent.py
│   ├── pdf_parser_agent.py
│   ├── tutor_agent.py
│   ├── quiz_agent.py
│   ├── content_generator_agent.py
│   └── orchestrator_agent.py
│
├── api/                    # FastAPI routes (Phase 4)
│   ├── __init__.py
│   ├── auth.py
│   ├── classes.py
│   ├── pdf.py
│   ├── chat.py
│   ├── learning.py
│   └── analytics.py
│
├── services/               # Business logic (Phase 5)
│   ├── __init__.py
│   ├── user_service.py
│   ├── class_service.py
│   ├── pdf_service.py
│   ├── chat_service.py
│   ├── progress_service.py
│   └── qdrant_service.py
│
├── models/                 # SQLAlchemy models (Phase 2)
│   ├── __init__.py
│   ├── user.py
│   ├── class_model.py
│   ├── section.py
│   ├── quiz.py
│   ├── progress.py
│   └── chat.py
│
├── db/                     # Database setup (Phase 2)
│   ├── __init__.py
│   ├── database.py
│   └── migrations/
│       ├── alembic.ini
│       └── versions/
│
└── utils/                  # Utilities (Phase 2, 5)
    ├── __init__.py
    ├── auth_utils.py
    ├── validators.py
    ├── embeddings.py
    └── pdf_utils.py

tests/                      # Test files (Phase 7)
├── __init__.py
├── test_agents.py
├── test_api.py
└── test_services.py
```

## Implementation Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| 1: Setup & Infrastructure | 1-2 days | ⏳ Next |
| 2: Core Backend Infrastructure | 2-3 days | ⏳ Pending |
| 3: OpenAI Agents Implementation | 3-4 days | ⏳ Pending |
| 4: API Endpoints | 2-3 days | ⏳ Pending |
| 5: Service Layer | 2-3 days | ⏳ Pending |
| 6: Vector Database Integration | 1-2 days | ⏳ Pending |
| 7: Testing | 2-3 days | ⏳ Pending |
| 8: Frontend Integration | 2-3 days | ⏳ Pending |

**Total: 15-23 days (~3-4 weeks)**

## Key Decisions

✅ **Frontend**: React (unchanged from original)
✅ **Backend**: Python + FastAPI
✅ **AI Framework**: OpenAI Agents SDK (direct API usage)
✅ **Database**: PostgreSQL + SQLAlchemy
✅ **Vector DB**: Qdrant
✅ **Authentication**: JWT + Bcrypt
✅ **Deployment**: Docker + Docker Compose

## Quick Commands

```bash
# Frontend development
cd apps/web
pnpm install
pnpm dev

# Backend setup (Phase 1)
cd apps/api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Full stack with Docker
docker-compose up -d

# View services
docker-compose ps
docker-compose logs -f api
```

## References

- Implementation Plan: `REWORK_PLAN.md`
- What Changed: `CLEANUP_SUMMARY.md`
- Backend Docs: `apps/api/README.md`
- Frontend Docs: `apps/web/README.md`

---

**Last Updated**: Nov 16, 2024
**Status**: ✅ Cleanup complete. Ready for Phase 1.
