import React from 'react';

export default function Privacy({ onClose }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Politique de confidentialité">
      <div className="modal-content">
        <button className="close" onClick={onClose} aria-label="Fermer la fenêtre">✕</button>
        <h2>Politique de confidentialité (résumé)</h2>
        <p>
          Application qui agrège des actualités publiques. Par défaut, aucune donnée personnelle n'est stockée.
        </p>
        <ul>
          <li>Si tu utilises le backend (NewsAPI), la clé reste côté serveur.</li>
          <li>Le fallback RSS peut utiliser des services publics tiers (ex: rss2json) qui peuvent appliquer des limites.</li>
        </ul>
      </div>
    </div>
  );
}
