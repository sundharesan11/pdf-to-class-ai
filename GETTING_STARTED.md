# 🚀 Getting Started with EduAgent

Complete monorepo project with AI-powered learning platform.

## 📦 What's Included

### Frontend (`apps/web`)
- ✅ React 18 + TypeScript + Vite
- ✅ Beautiful UI with shadcn-ui + Tailwind
- ✅ Teacher & Student dashboards
- ✅ PDF upload interface
- ✅ Interactive classroom UI
- ✅ AI chat interface

### Backend (`apps/api`)
- ✅ Fastify API server
- ✅ PostgreSQL + Drizzle ORM
- ✅ Qdrant vector database
- ✅ 6 Mastra AI agents
- ✅ RAG-powered tutoring
- ✅ Adaptive learning orchestration

### Shared Packages
- ✅ `@eduagent/shared-types` - Common TypeScript types
- ✅ `@eduagent/typescript-config` - Shared TS configs
- ✅ `@eduagent/eslint-config` - Shared linting

## 🎯 Quick Start (5 Minutes)

### 1. Prerequisites

Install these first:
- **Node.js 18+** - https://nodejs.org/
- **pnpm** - `npm install -g pnpm`
- **PostgreSQL** - https://www.postgresql.org/download/
- **Docker** (for Qdrant) - https://www.docker.com/

### 2. Clone & Install

```bash
cd pdf-to-class-ai
pnpm install
```

### 3. Setup Backend

```bash
# Create PostgreSQL database
createdb eduagent

# Start Qdrant with Docker
docker run -d -p 6333:6333 qdrant/qdrant

# Configure environment
cd apps/api
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Push database schema
pnpm db:push
```

### 4. Start Everything

```bash
# From project root
pnpm dev
```

This starts:
- 🌐 Frontend: http://localhost:8080
- 🔌 Backend: http://localhost:3000

## 📖 Detailed Guides

- **Backend Setup**: See [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Implementation Details**: See [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)
- **Monorepo Structure**: See [MONOREPO_MIGRATION.md](./MONOREPO_MIGRATION.md)
- **API Documentation**: See [apps/api/README.md](./apps/api/README.md)
- **Project Overview**: See [README.md](./README.md)

## 🧪 Testing the Platform

### Teacher Flow

1. **Open frontend**: http://localhost:8080
2. **Click "I'm a Teacher"**
3. **Register** with email/password
4. **Upload a PDF** (any educational PDF)
5. **Wait for AI processing** (~30 seconds)
6. **Get join code** (share with students)

### Student Flow

1. **Open frontend**: http://localhost:8080
2. **Click "I'm a Student"**
3. **Register** with email/password
4. **Join class** with the join code
5. **Start learning session**
6. **Interact with AI tutor**
7. **Take quizzes**
8. **Chat with AI** for help

## 📁 Project Structure

```
pdf-to-class-ai/
├── apps/
│   ├── web/          # Frontend (React + Vite)
│   └── api/          # Backend (Fastify + Mastra)
│
├── packages/
│   ├── shared-types/
│   ├── typescript-config/
│   └── eslint-config/
│
├── README.md                      # Project overview
├── BACKEND_SETUP.md              # Backend setup guide
├── BACKEND_IMPLEMENTATION.md     # Implementation details
├── MONOREPO_MIGRATION.md         # Monorepo structure
└── GETTING_STARTED.md            # This file
```

## 🔧 Common Commands

```bash
# Install dependencies
pnpm install

# Start dev servers (frontend + backend)
pnpm dev

# Build all apps
pnpm build

# Lint all code
pnpm lint

# Database commands
cd apps/api
pnpm db:push          # Push schema changes
pnpm db:studio        # Open database UI

# Clean everything
pnpm clean
```

## 🌐 Environment Setup

### apps/api/.env

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/eduagent

# Qdrant (local Docker)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# OpenAI (required!)
OPENAI_API_KEY=sk-...your-key-here...

# Auth
JWT_SECRET=change-this-secret-in-production

# Server
PORT=3000
FRONTEND_URL=http://localhost:8080
```

### Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new key
3. Add credits to your account
4. Copy key to `.env`

## 🎓 Usage Example

### Via Frontend UI

1. **Teacher**: Upload → "Introduction to Biology.pdf"
2. **AI processes** → Creates chapters, sections, quizzes
3. **Student**: Join with code → Start session
4. **AI teaches** section → Explains concepts
5. **Student takes** quiz → Gets feedback
6. **AI decides** next step → Continue/Review/Repeat

### Via API (cURL)

See [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md#-usage-example)

## 🐛 Troubleshooting

### "Cannot connect to database"

```bash
# Check PostgreSQL is running
pg_isready

# Create database if missing
createdb eduagent

# Verify connection string in .env
```

### "Qdrant connection failed"

```bash
# Check Docker container
docker ps

# Start Qdrant if not running
docker run -d -p 6333:6333 qdrant/qdrant

# Test connection
curl http://localhost:6333/collections
```

### "OpenAI API error"

```bash
# Verify key is correct
# Check you have credits
# Test directly:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### "Port already in use"

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

## 📚 Learning Resources

### Technologies Used

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [shadcn-ui](https://ui.shadcn.com/)
- **Backend**: [Fastify](https://fastify.dev/), [Drizzle](https://orm.drizzle.team/)
- **AI**: [Mastra](https://mastra.ai/), [OpenAI](https://platform.openai.com/)
- **Vector DB**: [Qdrant](https://qdrant.tech/)

### Architecture Patterns

- **Monorepo**: Turborepo for build orchestration
- **API**: RESTful with JWT authentication
- **Database**: Normalized PostgreSQL schema
- **AI**: Agentic workflows with RAG
- **Vector Search**: Semantic retrieval for tutoring

## 🎯 Next Steps

### For Development

1. ✅ Run the platform locally
2. ✅ Test teacher and student flows
3. ✅ Upload sample PDFs
4. ✅ Interact with AI tutor
5. ✅ Explore the codebase

### For Production

1. [ ] Add comprehensive tests
2. [ ] Setup CI/CD pipeline
3. [ ] Configure production database
4. [ ] Deploy to cloud (Vercel + Render/Railway)
5. [ ] Setup monitoring (Sentry, LogRocket)
6. [ ] Add rate limiting
7. [ ] Implement caching (Redis)
8. [ ] Add background jobs (Bull)

### For Enhancement

1. [ ] Voice input for students
2. [ ] Image/diagram support
3. [ ] Collaborative features
4. [ ] Mobile app (React Native)
5. [ ] Advanced analytics
6. [ ] Gamification system
7. [ ] Parent portal

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Your License Here]

## 💬 Support

- **Documentation**: Check all .md files in root
- **Issues**: File on GitHub
- **Email**: [Your Email]

---

**Ready to revolutionize education with AI?** 🚀

Start with: `pnpm install && pnpm dev`
