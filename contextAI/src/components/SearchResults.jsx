import { Sparkles, X } from "lucide-react";

export default function SearchResults({ results, onSelectGame, onClear }) {
  return (
    <div className="search-results">
      <div className="search-results__header">
        <div>
          <span className="search-results__eyebrow">
            <Sparkles size={12} /> search matches
          </span>
        </div>

        <button className="search-results__clear" onClick={onClear}>
          <X size={14} /> Back to browse
        </button>
      </div>

      <div className="search-results__list">
        {results.map(({ game, score, reason }) => (
          <button
            key={game.id}
            className="search-results__item"
            onClick={() => onSelectGame(game)}
          >
            <div className="search-results__image">
              <img src={game.imageUrl} alt={game.title} />
            </div>

            <div className="search-results__body">
              <div className="search-results__title-row">
                <h3 className="search-results__title">
                  {game.title}
                </h3>

                <span className="search-results__category">
                  {game.category}
                </span>
              </div>

               <p className="search-results__reason">
                <span className="search-results__reason-label">Why it matches</span>
                {reason}
              </p>
            </div>

            <div
              className={`search-results__score ${
                score >= 0.75
                  ? "search-results__score--high"
                  : score >= 0.60
                    ? "search-results__score--medium"
                    : "search-results__score--low"
              }`}
             >  
              {Math.round(score * 100)}%
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}