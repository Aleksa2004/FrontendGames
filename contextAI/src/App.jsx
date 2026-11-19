import { useEffect,useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import GameGrid from "./components/GameGrid";
import Pagination from "./components/Pagination";
import SearchResults from "./components/SearchResults";
import GameDetailModal from "./components/GameDetailModal";
import LoginForm from "./components/LoginForm";
import ChatWidget from "./components/ChatWidget";

const PAGE_SIZE = 9;
function getUsernameFromToken(token){
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.sub;
}
function getUserFromToken(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));

  return {
    username: payload.sub,
    tenant: payload.tenantName,
  };
}
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [page, setPage] = useState(1);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/games", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Greska pri ucitavanju igara");
        return response.json();
      })
      .then((data) => setGames(data))
      .catch((error) => console.error(error))
      .finally(() => setGamesLoading(false));
  }, [token]);

  const totalPages = Math.ceil(games.length / PAGE_SIZE);

  const pageGames = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return games.slice(start, start + PAGE_SIZE);
  }, [page, games]);

 if (!token) {
  return (
    <LoginForm
      onLogin={(newToken) => {
        console.log("TOKEN PRIMLJEN U APP:", newToken);

        setToken(newToken);
      }}
    />
  );
}
  const handleSearch = async (query) => {
  setSearchLoading(true);


  try {
    console.log("TOKEN ZA SEARCH:",token);
    const response = await fetch(
      `http://localhost:8080/search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Greska pri search-u");
    }

    const data = await response.json();

    console.log("SEARCH RESPONSE:", data);

    setSearchResults(data);
    setSearchQuery(query);

  } catch (error) {
    console.error("SEARCH ERROR:", error);
  } finally {
    setSearchLoading(false);
  }
};

  const clearSearch = () => {
    setSearchQuery(null);
    setSearchResults([]);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setGames([]);
    setPage(1);
  }

  return (
    <div className="app">
   <Navbar
      user={getUserFromToken(token)}
      onSearch={handleSearch}
      searchLoading={searchLoading}
      onHome={() => {
        setPage(1);
        clearSearch();
      }}
      onLogout={handleLogout}
    />
      <main className="app__main">
        {searchQuery ? (
          <SearchResults
            query={searchQuery}
            results={searchResults}
            onSelectGame={setSelectedGame}
            onClear={clearSearch}
          />
        ) : (
          <>
            <GameGrid games={pageGames} onSelectGame={setSelectedGame} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </main>
      <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      <ChatWidget token={token} onSelectGame={setSelectedGame}/>
    </div>
  );
}