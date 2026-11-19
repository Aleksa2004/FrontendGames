import { Gamepad2 } from "lucide-react";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({ user, onSearch, searchLoading ,onHome, onLogout}) {
  return (
    <header className="navbar">
      <div className="navbar__logo" onClick={onHome}>
        <Gamepad2 size={18} />
        <span>GameMatch</span>
      </div>

      <div className="navbar__search">
        <SearchBar onSearch={onSearch} loading={searchLoading} />
      </div>

      <div className="navbar__profile">
        <ProfileMenu user={user} onLogout={onLogout}/>
      </div>
    </header>
  );
}
