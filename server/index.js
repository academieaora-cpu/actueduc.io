// Backend minimal (proxy sécurisé vers NewsAPI)
// IMPORTANT : ce backend NE PEUT PAS être hébergé sur GitHub Pages.
// Lance-le localement (node index.js) ou déploie sur une plateforme (Railway, Render, Fly, etc.).
const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

// Rate limiting simple
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'rate_limited', message: 'Trop de requêtes — réessayer plus tard.' } }
}));

// Cache en mémoire (dev)
const cache = new NodeCache({ stdTTL: 120, checkperiod: 150 });

axiosRetry(axios, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

const NEWSAPI_BASE = 'https://newsapi.org/v2/everything';
const API_KEY = process.env.NEWSAPI_KEY;

const ALLOWED_LANGUAGES = ['en','fr','es','de','ru','ar','zh','all'];

function toIntSafe(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

app.get('/api/news', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: { code: 'no_api_key', message: 'NEWSAPI_KEY not set on server.' } });

    const { q = '', language = 'en', page = '1', pageSize = '12', sortBy = 'publishedAt' } = req.query;
    if (!ALLOWED_LANGUAGES.includes(language)) return res.status(400).json({ error: { code: 'invalid_language', message: 'language not allowed.' } });

    const pageNum = toIntSafe(page, 1);
    const pageSizeNum = Math.min(toIntSafe(pageSize, 12), 100);
    if (pageNum < 1 || pageSizeNum < 1) return res.status(400).json({ error: { code: 'invalid_pagination', message: 'page/pageSize must be >= 1' } });

    const eduKeywords = '(education OR éducation OR educación OR Bildung OR 教育 OR образование OR تعليم)';
    const query = q ? `${q} AND ${eduKeywords}` : eduKeywords;

    const params = {
      q: query,
      language: language === 'all' ? undefined : language,
      page: pageNum,
      pageSize: pageSizeNum,
      sortBy
    };

    const cacheKey = JSON.stringify(params);
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const response = await axios.get(NEWSAPI_BASE, {
      params: { ...params, apiKey: API_KEY },
      headers: { 'User-Agent': 'edu-news-server/1.0' },
      timeout: 10000
    });

    const payload = {
      status: response.data.status,
      totalResults: response.data.totalResults,
      articles: (response.data.articles || []).map(a => ({
        source: a.source,
        author: a.author,
        title: a.title,
        description: a.description,
        url: a.url,
        urlToImage: a.urlToImage,
        publishedAt: a.publishedAt,
        content: a.content
      }))
    };

    cache.set(cacheKey, payload);
    res.json(payload);
  } catch (err) {
    const status = err?.response?.status || 500;
    const message = err?.response?.data?.message || err.message || 'unknown error';
    console.error('API error:', message);
    res.status(status).json({ error: { code: 'provider_error', message } });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
