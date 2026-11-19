import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  return (
    <div className="search-bar">
      <Search size={17} className="search-bar__icon" />
      <input
        className="search-bar__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Describe the game you're looking for..."
      />
      <button className="search-bar__button" onClick={submit} disabled={loading}>
        {loading ? <Loader2 size={15} className="search-bar__spinner" /> : "Search"}
      </button>
    </div>
  );
}
