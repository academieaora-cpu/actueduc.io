import React, { useState, useEffect } from 'react';
import NewsList from './NewsList';
import Privacy from './Privacy';

export default function App() {
  const [q, setQ] = useState('');
  const [language, setLanguage] = useState('en');
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const pageSize = 12;

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, [page]);

  async function fetchNews(e) {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      // Appelle le backend si disponible (proxy). Si pas de backend (Pages seulement) utilise un fallback RSS
      const params = new URLSearchParams({
        ...(q ? { q } : {}),
        language,
        page,
        pageSize
      });

      // Tentative backend sur /api/news
      const res = await fetch(`/api/news?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles) {
          setArticles(data.articles);
          setTotalResults(data.totalResults || 0);
          setLoading(false);
          return;
        }
      }

      // Fallback : utiliser Google News RSS via rss2json (public fallback)
      const rssQuery = encodeURIComponent((q || 'education') + ' site:news');
      const rssUrl = `https://news.google.com/rss/search?q=${rssQuery}&hl=en-US&gl=US&ceid=US:en`;
      const rss2json = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const r2 = await fetch(rss2json);
      const rdata = await r2.json();
      const items = (rdata.items || []).map(it => ({
        source: { name: it.source || '' },
        author: it.author || '',
        title: it.title,
        description: it.description,
        url: it.link,
        urlToImage: it.enclosure?.link || '',
        publishedAt: it.pubDate,
        content: ''
      }));
      setArticles(items);
      setTotalResults(items.length);
    } catch (err) {
      console.error(err);
      setArticles([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr) {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="container" role="main">
      <header>
        <h1>Edu News — actualités mondiales sur l'éducation</h1>
        <p>Filtre par langue, mot-clé et page. Le site utilise un backend si disponible ; sinon un fallback RSS est tenté.</p>
      </header>

      <form className="controls" onSubmit={fetchNews} aria-label="Formulaire de recherche">
        <input aria-label="mot-clé" placeholder="Mot-clé (ex: policy, school, éducation...)" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select aria-label="Langue" value={language} onChange={(e)=>setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="ru">Русский</option>
          <option value="ar">العربية</option>
          <option value="zh">中文</option>
          <option value="all">Toutes les langues</option>
        </select>
        <button type="submit" aria-label="Rechercher">Rechercher</button>
      </form>

      <main>
        {loading ? <p role="status">Chargement…</p> : <NewsList articles={articles} formatDate={formatDate} />}
        <div className="pagination" role="navigation" aria-label="Pagination">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page<=1} aria-label="Page précédente">← Préc</button>
          <span>Page {page} — {totalResults} résultats</span>
          <button onClick={() => setPage(p => p+1)} disabled={articles.length < pageSize} aria-label="Page suivante">Suiv →</button>
        </div>
      </main>

      <footer>
        <small>
          <button className="linklike" onClick={()=>setShowPrivacy(true)} aria-haspopup="dialog">Politique de confidentialité</button>
          {' — '}Besoin d'intégrations supplémentaires ? Contacte-nous.
        </small>
        {showPrivacy && <Privacy onClose={()=>setShowPrivacy(false)} />}
      </footer>
    </div>
  );
}
