# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GreenMindShift Blog is a modern, AI-powered sustainability blog built with Next.js 14, featuring automated content creation via Google Trends and Gemini AI. The application includes a sophisticated content deduplication system and is designed for Kubernetes deployment.

## Development Commands

### Essential Commands
```bash
# Development
npm run dev                    # Start development server (localhost:3000)
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint
npm run type-check             # TypeScript type checking

# Database (Prisma)
npm run db:generate            # Generate Prisma client
npm run db:migrate             # Run database migrations
npm run db:deploy              # Deploy migrations (production)
npm run db:seed                # Seed database with initial data
npm run db:studio              # Open Prisma Studio GUI

# Testing
npm run test                   # Run Jest tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Generate test coverage report
```

### Docker Commands
```bash
# Local PostgreSQL (Port 5434)
docker run --name postgres-greenmindshift \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=greenmindshift \
  -p 5434:5432 \
  -d postgres:15-alpine

# N8N Automation Platform
docker run -it --rm --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom green/earth/ocean color palette
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI primitives with shadcn/ui
- **Automation**: N8N workflows for content generation
- **AI**: Google Gemini for content creation
- **Deployment**: Kubernetes with Traefik ingress

### Key Features
- **AI Content Generation**: Automated blog posts from Google Trends
- **Advanced Deduplication**: Multi-layer duplicate content prevention
- **SEO Optimization**: Dynamic meta tags, structured data, sitemap
- **Content Management**: Full CMS with role-based access
- **Performance**: Optimized for Core Web Vitals

## Database Schema

### Core Models
- **User**: Authentication and author management (ADMIN/EDITOR/AUTHOR roles)
- **Article**: Blog posts with SEO fields and AI generation tracking
- **Category/Tag**: Content organization with many-to-many relationships
- **Comment**: User comments with moderation
- **Newsletter**: Email subscription management

### Deduplication System
- **ProcessedTrend**: Tracks processed Google Trends with SHA256 hashes
- **ContentHash**: Stores content hashes for duplicate detection
- **TrendBlacklist**: Keywords to filter out from trend processing
- **TrendsKeyword**: Active keywords for Google Trends monitoring

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── content/       # Content management APIs
│   │   ├── health/        # Health check endpoint
│   │   └── trends/        # Trend processing APIs
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── blog/             # Blog-specific components
│   ├── layout/           # Layout components (Header, Footer)
│   └── ui/               # Reusable UI components (shadcn/ui)
├── lib/                  # Shared utilities
├── utils/                # Utility functions
│   ├── cn.ts            # Class name utility
│   └── deduplication.ts # Deduplication system
└── types/               # TypeScript type definitions
```

## Deduplication System

This project includes a sophisticated multi-layer deduplication system to prevent duplicate content creation:

### API Endpoints
- `POST /api/trends/check-processed` - Check if trend was already processed
- `POST /api/trends/mark-processing` - Mark trend as being processed
- `POST /api/content/check-hash` - Check for content duplicates

### Key Functions (src/utils/deduplication.ts)
- `createTrendHash()` - Generate unique hash for Google Trends
- `createContentHash()` - Generate hash for AI-generated content
- `checkContentSimilarity()` - Analyze content similarity using Jaccard similarity
- `isKeywordBlacklisted()` - Check against blacklisted keywords
- `cleanupOldTrends()` - Maintenance function for old trend data

## Environment Setup

### Required Environment Variables
```env
DATABASE_URL="postgresql://postgres:password@localhost:5434/greenmindshift"
NEXTAUTH_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
GOOGLE_SEARCH_API_KEY="your-google-api-key"
BLOG_API_TOKEN="your-secure-token"    # For N8N API authentication

# Deduplication settings
SIMILARITY_THRESHOLD=0.7
CLEANUP_DAYS=30
MAX_SIMILARITY_CHECKS=50
```

## N8N Workflow Integration

The project includes N8N workflows for automated content creation:
- `n8n-workflows/google-trends-to-blog.json` - Main content generation workflow
- `n8n-workflows/google-trends-deduplication.json` - Enhanced with deduplication
- `n8n-workflows/google-trends-to-blog-with-deduplication.json` - Complete workflow

### Workflow Process
1. Fetch Google Trends data
2. Create trend hash and check for duplicates
3. Check keyword blacklist
4. Mark trend as processing
5. Perform Google search for additional context
6. Generate content hash
7. Check content similarity
8. Generate AI content (if unique)
9. Create article in review status
10. Store content hash for future duplicate detection

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint with Next.js configuration
- Prettier with Tailwind CSS plugin
- Path aliases: `@/*` maps to `./src/*`

### Database Operations
- Use Prisma Client for all database operations
- Run migrations before code changes: `npm run db:migrate`
- Use transactions for complex operations
- Always disconnect Prisma client in API routes

### API Authentication
All automation APIs require Bearer token authentication:
```javascript
headers: {
  'Authorization': `Bearer ${process.env.BLOG_API_TOKEN}`
}
```

## Testing & Quality

### Running Tests
```bash
npm run test              # Run all tests
npm run test:watch        # Development mode
npm run test:coverage     # Coverage report
npm run lint              # Linting
npm run type-check        # TypeScript validation
```

### Performance Monitoring
- Health check: `GET /api/health`
- Database connection monitoring via Prisma
- Kubernetes readiness/liveness probes configured

## Deployment

### Kubernetes
- Namespace: `greenmindshift`
- Ingress: Traefik with Let's Encrypt SSL
- Database: PostgreSQL StatefulSet
- Application: Deployment with configurable replicas

### Docker
- Multi-stage build for production optimization
- Standalone output for minimal image size
- Health checks included
- Non-root user for security

## Troubleshooting

### Common Issues
- **Port conflicts**: PostgreSQL runs on 5434 (not default 5432)
- **Database connection**: Ensure PostgreSQL is running and accessible
- **Environment variables**: Copy `env.example` to `.env.local`
- **N8N workflows**: Import JSON files after N8N container startup
- **Prisma issues**: Run `npx prisma generate` after schema changes

### Debug Commands
```bash
npx prisma studio                    # Database GUI
kubectl logs -f deployment/greenmindshift-blog -n greenmindshift
curl http://localhost:3000/api/health  # Health check
```

## Additional Documentation

- Detailed deduplication system: `docs/deduplication-system.md`
- Deployment guide: `../greenmindshift-blog-deployment/docs/README.md`
- Project roadmap: `ROADMAP.md`