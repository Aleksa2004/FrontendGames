export default function GameCard({ game, onClick }) {
  return (
    <button className="game-card" onClick={() => onClick(game)}>
      <img
        src={game.imageUrl || "/default-game.jpg"}
        alt={game.title}
        className="game-card__image"
      />

      <div className="game-card__top">
        <span className="game-card__category">{game.category}</span>
        <span className="game-card__price">
          {game.price === 0 ? "Free" : `$${game.price.toFixed(2)}`}
        </span>
      </div>

      <h3 className="game-card__title">{game.title}</h3>
    </button>
  );
}