import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from datetime import datetime

from main import app, get_sentiment_label, sanitize_text, validate_ticker


client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_validate_ticker_valid():
    assert validate_ticker("AAPL") == "AAPL"
    assert validate_ticker("aapl") == "AAPL"


def test_validate_ticker_invalid():
    with pytest.raises(Exception):  # HTTPException
        validate_ticker("INVALID")


def test_sanitize_text():
    assert sanitize_text("  Hello\nWorld\r  ") == "Hello World"
    long_text = "a" * 600
    assert len(sanitize_text(long_text)) == 500


def test_get_sentiment_label():
    assert get_sentiment_label(0.1) == "positive"
    assert get_sentiment_label(-0.1) == "negative"
    assert get_sentiment_label(0.01) == "neutral"


@patch('main.fetch_headlines')
async def test_get_headlines(mock_fetch):
    mock_headlines = [
        {
            "title": "Apple stock rises",
            "url": "https://example.com",
            "publishedAt": "2024-01-01T00:00:00Z"
        }
    ]
    mock_fetch.return_value = mock_headlines

    response = client.get("/headlines/AAPL")
    assert response.status_code == 200


@patch('main.fetch_stock_prices')
async def test_get_prices(mock_fetch):
    mock_prices = [
        {"date": "2024-01-01T00:00:00Z", "close": 150.0}
    ]
    mock_fetch.return_value = mock_prices

    response = client.get("/prices/AAPL")
    assert response.status_code == 200


@patch('main.fetch_headlines')
@patch('main.analyzer')
async def test_analyze_sentiment(mock_analyzer, mock_fetch):
    mock_headlines = [
        type('MockHeadline', (), {
            'title': 'Apple stock rises',
            'url': 'https://example.com',
            'publishedAt': '2024-01-01T00:00:00Z'
        })()
    ]
    mock_fetch.return_value = mock_headlines

    mock_analyzer.polarity_scores.return_value = {
        'compound': 0.5,
        'pos': 0.7,
        'neu': 0.2,
        'neg': 0.1
    }

    response = client.get("/analyze/AAPL")
    assert response.status_code == 200
    data = response.json()
    assert data["ticker"] == "AAPL"
    assert "aggregate" in data
    assert "headlines" in data


@patch('main.fetch_headlines')
@patch('main.analyzer')
async def test_sentiment_alias_endpoint(mock_analyzer, mock_fetch):
    """Test that /sentiment/{ticker} works identically to /analyze/{ticker}"""
    mock_headlines = [
        type('MockHeadline', (), {
            'title': 'Apple stock rises',
            'url': 'https://example.com',
            'publishedAt': '2024-01-01T00:00:00Z'
        })()
    ]
    mock_fetch.return_value = mock_headlines

    mock_analyzer.polarity_scores.return_value = {
        'compound': 0.5,
        'pos': 0.7,
        'neu': 0.2,
        'neg': 0.1
    }

    response = client.get("/sentiment/AAPL")
    assert response.status_code == 200
    data = response.json()
    assert data["ticker"] == "AAPL"
    assert "aggregate" in data
    assert "headlines" in data


def test_invalid_ticker_endpoints():
    response = client.get("/headlines/INVALID")
    assert response.status_code == 400

    response = client.get("/prices/INVALID")
    assert response.status_code == 400

    response = client.get("/analyze/INVALID")
    assert response.status_code == 400

    response = client.get("/sentiment/INVALID")
    assert response.status_code == 400