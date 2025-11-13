# 🚀 MarketPulse - AI-Powered Stock Sentiment Dashboard

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-teal) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Python](https://img.shields.io/badge/Python-3.11-yellow) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

> Real-time sentiment analysis for top tech stocks powered by AI

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
│   └── nlp/          # FastAPI sentiment service (Optional)
├── packages/
│   └── shared/       # Shared TypeScript types & Zod schemas
└── .github/workflows/ # CI/CD automation
```

### Tech Stack

**Frontend (apps/web)**
- Framework: Next.js 14 with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: @tanstack/react-query
- Charts: Recharts
- Data Source: Yahoo Finance API (yahoo-finance2)
- Testing: Vitest + Testing Library
- Deployment: Vercel

**Backend (apps/nlp)** *(Optional - for extended NLP features)*
- Framework: FastAPI
- Language: Python 3.11
- ML/NLP: VADER Sentiment Analysis
- Data Sources: Google News RSS, Yahoo Finance RSS
- Caching: In-memory with TTL (1-minute refresh)
- Testing: pytest

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+ (optional - only if running NLP service locally)

### Local Development

**1. Clone and setup**
```bash
git clone https://github.com/Emilioaguirre7/MarketPulse.git
cd marketpulse
npm install
```

**2. Configure environment (optional)**
```bash
cp apps/web/.env.example apps/web/.env
# Edit with your preferred stock tickers (optional - has defaults)
```

**3. Start the development server**
```bash
npm run dev
```

**4. Open your browser**
- Frontend: http://localhost:3000
- Health Check: http://localhost:3000/api/healthz

### Optional: Run NLP Service Locally
```bash
cd apps/nlp
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- NLP API: http://localhost:8000/docs

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

### Deploy on Vercel (Recommended)

MarketPulse frontend deploys seamlessly on Vercel's free tier.

**Steps:**
1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. **Important:** Set root directory to `apps/web`
3. Configure environment variables (optional):
   - `NEXT_PUBLIC_DEFAULT_TICKERS=AAPL,MSFT,AMZN,TSLA,NVDA`
4. Click **Deploy**

### Environment Variables Reference
```bash
NEXT_PUBLIC_DEFAULT_TICKERS=AAPL,MSFT,AMZN,TSLA,NVDA  # Default stocks (optional)
NEXT_PUBLIC_NLP_BASE_URL=                             # Optional: external NLP service
```

### Deploy NLP Service (Optional)

If you want to host the Python NLP service separately:

**Option A: Render**
1. Connect your GitHub repo
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `WEB_ORIGIN=your-vercel-url`

**Option B: Fly.io**
```bash
cd apps/nlp
fly launch
fly deploy
```

## 📊 API Reference

### Web App API Routes

| Endpoint | Description | Response |
|----------|-------------|----------|
| `GET /api/healthz` | Health check | `{ok: true}` |
| `GET /api/prices/daily/{symbol}` | Get historical prices | `PriceResponse` |

### NLP Service Endpoints (Optional)

| Endpoint | Description | Response |
|----------|-------------|----------|
| `GET /health` | Health check | `{status: "ok"}` |
| `GET /headlines/{ticker}` | Get news headlines | `Headline[]` |
| `GET /analyze/{ticker}` | Full sentiment analysis | `AnalyzeResponse` |

## 🛠️ Troubleshooting

**Vercel Build Failures:**
- Ensure root directory is set to `apps/web` in project settings
- Verify Node.js version is 18+ (set in package.json engines)

**API Route Errors:**
- API routes use `runtime = 'nodejs'` for yahoo-finance2 compatibility
- Check health endpoint: `/api/healthz`

**Port Conflicts:**
- App auto-detects available ports (3000, 3001, 3002, etc.)

## 🗺️ Roadmap

- [ ] User Authentication - Login system with personalized watchlists
- [ ] Historical Charts - Extended price history with technical indicators
- [ ] Sentiment Trends - Historical sentiment analysis charts
- [ ] Real-time Updates - WebSocket connections for live data
- [ ] Mobile App - React Native implementation
- [ ] Advanced ML - Integration with Hugging Face transformers
- [ ] Portfolio Tracking - Personal portfolio performance analysis

## ⚖️ License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [VADER Sentiment Analysis](https://github.com/cjhutto/vaderSentiment) for sentiment scoring
- [Yahoo Finance](https://finance.yahoo.com/) for financial data
- [Vercel](https://vercel.com) for hosting

---

⭐ **Star this repo if you find it helpful!**