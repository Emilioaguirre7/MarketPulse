# 🚀 MarketPulse - AI-Powered Stock Sentiment Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-yellow?logo=python)](https://python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://postgresql.org/)

> **Real-time sentiment analysis for top tech stocks powered by AI**

MarketPulse provides instant insights into market sentiment by analyzing financial news headlines using advanced sentiment analysis. Track market mood for any stock symbol with beautiful visualizations, real-time price data, and detailed analytics.

## ✨ Features

- 📊 **Advanced Sentiment Analysis** - VADER sentiment analysis on real-time financial news
- 📈 **Interactive Price Charts** - Historical price trends with dynamic visualizations
- 📰 **Live News Integration** - Real-time headlines from Google News and Yahoo Finance
- 🎯 **Any Stock Symbol** - Support for any valid ticker symbol (1-5 letters)
- ⚡ **High Performance** - ISR caching, React Query, and optimized API calls
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS and smooth animations
- 🚀 **Deploy Anywhere** - Vercel-ready with no external dependencies required
- 📱 **Mobile First** - Fully responsive design that works on all devices

## 🏗️ Architecture

```
marketpulse/
├── apps/
│   ├── web/          # Next.js 14 frontend (Vercel)
│   └── nlp/          # FastAPI sentiment service (Render/Fly)
├── packages/
│   └── shared/       # Shared TypeScript types & Zod schemas
└── .github/workflows/ # CI/CD automation
```

### Tech Stack

**Frontend (apps/web)**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: @tanstack/react-query
- **Charts**: Recharts
- **Data Source**: Yahoo Finance API (yahoo-finance2)
- **Testing**: Vitest + Testing Library
- **Deployment**: Vercel-ready with ISR

**Backend (apps/nlp)** *(Optional - for extended NLP features)*
- **Framework**: FastAPI
- **Language**: Python 3.11
- **ML/NLP**: VADER Sentiment Analysis
- **Data Sources**: Google News RSS, Yahoo Finance RSS
- **Caching**: In-memory with TTL (1-minute refresh)
- **Testing**: pytest

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for Vercel compatibility)
- **Python** 3.11+ (optional - for NLP service)
- **No database required** for basic functionality

### Local Development

1. **Clone and setup**
```bash
git clone <your-repo>
cd marketpulse
npm install
```

2. **Configure environment (optional)**
```bash
cp apps/web/.env.example apps/web/.env
# Edit with your preferred stock tickers (optional - has defaults)
```

3. **Start both services**
```bash
# Terminal 1: Start both services concurrently
npm run dev

# OR start individually:
# Terminal 1: NLP service
cd apps/nlp
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2: Web app
cd apps/web
npm run dev
```

4. **Open your browser**
- Frontend: http://localhost:3000 (or 3002/3003/3004 if ports are in use)
- NLP API: http://localhost:8000/docs (FastAPI docs - optional)
- Health Check: http://localhost:3000/api/healthz

## 🧪 Testing

```bash
# Run all tests
npm test

# Individual app testing
cd apps/web && npm test
cd apps/nlp && pytest -v

# Linting and formatting
npm run lint
npm run format
```

## 🚀 Deployment

### 1. Deploy NLP Service (Optional)

#### Option A: Render
1. Connect your GitHub repo to [Render](https://render.com)
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `WEB_ORIGIN=your-vercel-url`

#### Option B: Fly.io
```bash
cd apps/nlp
fly launch
fly deploy
```

### 3. Deploy on Vercel (Frontend Only - No Database Required)

MarketPulse frontend can be deployed on Vercel's free tier without any external dependencies.

#### Quick Deploy Steps:

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com) and import your GitHub repo
   - **Important**: Set root directory to `apps/web`

2. **Environment Variables**
   - Set `NEXT_PUBLIC_DEFAULT_TICKERS=AAPL,MSFT,AMZN,TSLA,NVDA` (optional - has defaults)
   - Set `NEXT_PUBLIC_NLP_BASE_URL=` (leave empty for local-only mode)

3. **Deploy**
   - Click Deploy - Vercel will automatically detect Next.js configuration
   - Build should complete successfully with Node.js 18+

#### Troubleshooting Common Issues:

**Build Failures:**
- Ensure root directory is set to `apps/web` in Vercel project settings
- Verify Node.js version is 18+ (set in package.json engines)
- Check that all dependencies install correctly

**API Route 500 Errors:**
- API routes marked with `runtime = 'nodejs'` for yahoo-finance2 compatibility
- Health check available at `/api/healthz` returns `{ok: true}`

**Missing Dependencies:**
- All required packages are in `apps/web/package.json`
- No external databases required for basic functionality
- Uses ISR (Incremental Static Regeneration) with 15-minute cache

#### Environment Variables Reference:
```
NEXT_PUBLIC_DEFAULT_TICKERS=AAPL,MSFT,AMZN,TSLA,NVDA  # Default stocks
INTRADAY_PROVIDER=                                     # Future: intraday data
INTRADAY_API_KEY=                                      # Future: API key
WEB_ORIGIN=                                           # Optional: CORS origin
NEXT_PUBLIC_NLP_BASE_URL=                             # Optional: external NLP
```

### 4. Full Stack Deployment (Optional)

For the complete experience with external NLP service:

1. Deploy NLP service first (Render/Fly.io)
2. Get the NLP service URL
3. Add `NEXT_PUBLIC_NLP_BASE_URL=your-nlp-url` to Vercel environment variables
4. Update NLP service `WEB_ORIGIN` with your Vercel URL

## 📊 API Reference

### Web App API Routes

| Endpoint | Description | Response |
|----------|-------------|----------|
| `GET /api/healthz` | Health check | `{ok: true}` |
| `GET /api/prices/daily/{symbol}` | Get historical prices | `PriceResponse` |

### NLP Service Endpoints (Optional External Service)

| Endpoint | Description | Response |
|----------|-------------|----------|
| `GET /health` | Health check | `{status: "ok"}` |
| `GET /headlines/{ticker}` | Get news headlines | `Headline[]` |
| `GET /analyze/{ticker}` | Full sentiment analysis | `AnalyzeResponse` |

**Supported Tickers**: Any valid stock symbol (1-5 letters)

### Type Definitions

See [`packages/shared/src/types.ts`](packages/shared/src/types.ts) for complete TypeScript definitions and Zod schemas.

## 🏃‍♂️ Development Commands

```bash
# Root level - run both apps
npm run dev              # Start both services
npm run build            # Build both apps
npm run test             # Test both apps
npm run lint             # Lint both apps

# Individual apps
npm run dev:web          # Web app only
npm run dev:nlp          # NLP service only
npm run test:web         # Web app tests
npm run test:nlp         # NLP service tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit: `git commit -m "Add amazing feature"`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 🔧 Configuration

### Environment Variables

**Web App (`apps/web/.env`)**
```bash
# Required for Vercel deployment
NEXT_PUBLIC_DEFAULT_TICKERS=AAPL,MSFT,AMZN,TSLA,NVDA

# Optional - for external NLP service
NEXT_PUBLIC_NLP_BASE_URL=https://your-nlp-service.com
WEB_ORIGIN=https://your-domain.com

# Optional - future features
INTRADAY_PROVIDER=
INTRADAY_API_KEY=
```

**NLP Service (`apps/nlp/.env`)** *(Optional)*
```bash
WEB_ORIGIN=https://your-web-app.vercel.app
```

### Caching Strategy

- **API Routes**: 15 minutes ISR (Incremental Static Regeneration)
- **React Query**: 1 minute stale time for sentiment, 15 minutes for prices
- **NLP Service**: 1 minute TTL for fresh data
- **No Database**: Stateless architecture for Vercel deployment

## 🛠️ Troubleshooting

**Common Issues:**

1. **Vercel Build Failures**: Ensure root directory is set to `apps/web`
2. **API Route Errors**: Check Node.js runtime is set correctly for yahoo-finance2
3. **Port Conflicts**: App auto-detects available ports (3000, 3001, 3002, etc.)
4. **Missing Dependencies**: Run `npm install` in root and `pip install -r requirements.txt` in apps/nlp
5. **Node Version**: Requires Node.js 18+ (specified in package.json engines)

**Debug Mode:**
```bash
# Enable verbose logging
DEBUG=1 npm run dev
```

## 🗺️ Roadmap

- [ ] **User Authentication** - Login system with personalized watchlists
- [ ] **Historical Charts** - Extended price history with technical indicators
- [ ] **Custom Tickers** - Support for user-added stock symbols
- [ ] **Sentiment Trends** - Historical sentiment analysis charts
- [ ] **Real-time Updates** - WebSocket connections for live data
- [ ] **Mobile App** - React Native implementation
- [ ] **Advanced ML** - Integration with Hugging Face transformers
- [ ] **News Sources** - Multiple RSS feeds and news APIs
- [ ] **Social Sentiment** - Twitter/Reddit sentiment integration
- [ ] **Portfolio Tracking** - Personal portfolio performance analysis

## 📸 Screenshots

*Add screenshots of your deployed app here*

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [VADER Sentiment Analysis](https://github.com/cjhutto/vaderSentiment) for sentiment scoring
- [Yahoo Finance](https://finance.yahoo.com) for financial data
- [Vercel](https://vercel.com) for web app hosting
- [Render](https://render.com) for API hosting
- [Supabase](https://supabase.com) for database services

---

**⭐ Star this repo if you found it helpful!**

Built with ❤️ by the MarketPulse team