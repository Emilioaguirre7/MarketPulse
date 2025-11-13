# 🚀 MarketPulse - AI-Powered Stock Sentiment Dashboard

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-teal) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Python](https://img.shields.io/badge/Python-3.11-yellow) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)

> Real-time sentiment analysis and stock tracking powered by AI

MarketPulse provides instant insights into market sentiment by analyzing financial news headlines using VADER sentiment analysis. Track any stock symbol with beautiful visualizations, real-time price data from Yahoo Finance, and AI-powered news sentiment.

## 🌐 Live Demo

**[View Live App →](https://your-vercel-url.vercel.app)**

## ✨ Features

- 📊 **AI Sentiment Analysis** - VADER sentiment analysis on real-time financial news
- 📈 **Live Stock Prices** - Real-time price data from Yahoo Finance API
- 📰 **News Integration** - Real-time headlines with sentiment scoring
- 🎯 **Any Stock Symbol** - Support for any valid ticker symbol
- ⚡ **High Performance** - ISR caching and React Query for optimal speed
- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS
- 📱 **Mobile First** - Fully responsive on all devices

## 🏗️ Architecture

```
marketpulse/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── nlp/          # FastAPI sentiment service
└── packages/
    └── shared/       # Shared TypeScript types & Zod schemas
```

## 🛠️ Tech Stack

### Frontend (`apps/web`)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS 3.3
- **State:** @tanstack/react-query 5.14
- **Charts:** Recharts 2.8
- **Data:** yahoo-finance2 2.13
- **Validation:** Zod 3.22
- **Testing:** Vitest 1.1

### Backend (`apps/nlp`)
- **Framework:** FastAPI 0.104
- **Language:** Python 3.11
- **Sentiment:** vaderSentiment 3.3.2
- **Data:** yfinance 0.2.28, httpx 0.25.2
- **Testing:** pytest 7.4.3

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Python 3.11+**

### Installation

```bash
# Clone the repository
git clone https://github.com/Emilioaguirre7/MarketPulse.git
cd MarketPulse/marketpulse

# Install Node.js dependencies
npm install

# Install Python dependencies
cd apps/nlp
pip install -r requirements.txt
cd ../..

# Start development servers
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:3000
- **NLP API:** http://localhost:8000/docs
- **Health Check:** http://localhost:3000/api/healthz

## 📊 API Reference

### Frontend API Routes

| Endpoint | Description |
|----------|-------------|
| `/api/healthz` | Health check endpoint |
| `/api/prices/daily/{symbol}` | Get historical stock prices |

### NLP Service Endpoints

| Endpoint | Description |
|----------|-------------|
| `/health` | Service health status |
| `/headlines/{ticker}` | Fetch news headlines |
| `/analyze/{ticker}` | Full sentiment analysis with scores |

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
cd apps/web && npm test

# Backend tests  
cd apps/nlp && pytest -v
```

## 📁 Project Structure

```
marketpulse/
├── apps/
│   ├── web/                      # Next.js frontend
│   │   ├── app/                  # App router pages
│   │   ├── components/           # React components
│   │   └── package.json          # Frontend dependencies
│   └── nlp/                      # FastAPI backend
│       ├── main.py               # FastAPI application
│       ├── requirements.txt      # Python dependencies
│       └── test_main.py          # Backend tests
└── packages/
    └── shared/                   # Shared TypeScript types
```

## 🗺️ Roadmap

- [ ] User authentication and personalized watchlists
- [ ] Extended historical price charts with technical indicators
- [ ] Historical sentiment trend visualization
- [ ] Real-time WebSocket updates for live data
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (Hugging Face transformers)
- [ ] Social media sentiment (Twitter/Reddit integration)
- [ ] Portfolio tracking and performance analytics

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [VADER Sentiment Analysis](https://github.com/cjhutto/vaderSentiment) - Sentiment scoring engine
- [Yahoo Finance](https://finance.yahoo.com/) - Stock market data
- [Vercel](https://vercel.com) - Deployment platform

---

**Built by [Emilio Aguirre](https://github.com/Emilioaguirre7)**

⭐ Star this repo if you find it helpful!