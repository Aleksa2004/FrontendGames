import GameCard from "./GameCard";

export default function GameGrid({ games, onSelectGame }) {
  if (games.length === 0) {
    return <p className="game-grid__empty">No games to show.</p>;
  }

  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={onSelectGame} />
      ))}
    </div>
  );
}
