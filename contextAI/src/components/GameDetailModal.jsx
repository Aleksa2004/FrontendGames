import { X } from "lucide-react";

export default function GameDetailModal({ game, onClose }) {
  if (!game) return null;

   let meta = {};

  try {
    meta = typeof game.metadata === "string"
      ? JSON.parse(game.metadata)
      : game.metadata || {};
  } catch {
    meta = {};
  }

  const platforms = [
    meta.windows && "Windows",
    meta.mac && "Mac",
    meta.linux && "Linux",
  ].filter(Boolean);
  return (
    <div className="game-detail-modal">
      <div className="game-detail-modal__backdrop" onClick={onClose} />
      <div className="game-detail-modal__panel">
        <button className="game-detail-modal__close" onClick={onClose}>
          <X size={16} />
        </button>

        <img
          src={game.imageUrl || "/default-game.jpg"}
          alt={game.title}
          className="game-detail-modal__image"
        />

        <span className="game-detail-modal__category">{game.category}</span>

       
        <h2 className="game-detail-modal__title">{game.title}</h2>
        <span className="game-detail-modal__price">
          {game.price === 0 ? "Free" : `$${game.price.toFixed(2)}`}
        </span>

        <p className="game-detail-modal__description">{game.description}</p>

        <div className="game-detail-modal__meta">
          <div className="game-detail-modal__meta-row">
            <span className="game-detail-modal__meta-label">Platforms</span>
            <span className="game-detail-modal__meta-value">{platforms.join(", ") || "—"}</span>
          </div>
          <div className="game-detail-modal__meta-row">
          <span className="game-detail-modal__meta-label">Genres</span>
          <span className="game-detail-modal__meta-value">
            {(meta.genres || []).join(", ") || "—"}
          </span>
        </div>

        <div className="game-detail-modal__meta-row">
          <span className="game-detail-modal__meta-label">Game modes</span>
          <span className="game-detail-modal__meta-value">
            {[
              meta.categories?.includes("Single-player") && "Single-player",
              meta.categories?.includes("Multi-player") && "Multi-player",
              meta.categories?.includes("Co-op") && "Co-op",
            ]
              .filter(Boolean)
              .join(", ") || "—"}
          </span>
        </div>
          <div className="game-detail-modal__meta-row">
            <span className="game-detail-modal__meta-label">Developers</span>
            <span className="game-detail-modal__meta-value">{(meta.developers || []).join(", ") || "—"}</span>
          </div>
          <div className="game-detail-modal__meta-row">
            <span className="game-detail-modal__meta-label">Publisher</span>
            <span className="game-detail-modal__meta-value">{(meta.publishers || []).join(", ") || "—"}</span>
          </div>
          <div className="game-detail-modal__meta-row">
            <span className="game-detail-modal__meta-label">Release date</span>
            <span className="game-detail-modal__meta-value">{meta.release_date || "—"}</span>
          </div>
          <div className="game-detail-modal__meta-row">
            <span className="game-detail-modal__meta-label">Required age</span>
            <span className="game-detail-modal__meta-value">
              {meta.required_age > 0 ? `${meta.required_age}+` : "None"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}