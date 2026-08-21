import React from 'react';

export default function NewsList({ articles, formatDate }) {
  if (!articles || articles.length === 0) return <p>Aucun article trouvé.</p>;
  return (
    <div className="grid" role="list">
      {articles.map((a, i) => (
        <article key={i} className="card" role="listitem" aria-labelledby={`title-${i}`}>
          {a.urlToImage && <img src={a.urlToImage} alt={a.title || 'image'} loading="lazy" />}
          <h3 id={`title-${i}`}><a href={a.url} target="_blank" rel="noopener noreferrer">{a.title}</a></h3>
          <p className="meta">{a.source?.name} — {formatDate ? formatDate(a.publishedAt) : new Date(a.publishedAt).toLocaleString()}</p>
          <p dangerouslySetInnerHTML={{__html: a.description || ''}} />
        </article>
      ))}
    </div>
  );
}
