import { useState } from "react";
import { UserRound, ChevronDown } from "lucide-react";

export default function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-menu">
      <button className="profile-menu__trigger" onClick={() => setOpen((o) => !o)}>
        <span className="profile-menu__avatar">
          <UserRound size={15} />
        </span>
        <span className="profile-menu__name">{user.username}</span>
        <ChevronDown size={13} />
      </button>

      {open && (
        <>
          <div className="profile-menu__backdrop" onClick={() => setOpen(false)} />
          <div className="profile-menu__dropdown">
            <div className="profile-menu__row">
              <span className="profile-menu__label">username</span>
              <span className="profile-menu__value">{user.username}</span>
            </div>
            <div className="profile-menu__row">
              <span className="profile-menu__label">tenant</span>
              <span className="profile-menu__value">{user.tenant}</span>
            </div>
            <button
              className="profile-menu_logout"
              onClick={onLogout}
              >Logout
              </button>
          </div>
        </>
      )}
    </div>
  );
}
