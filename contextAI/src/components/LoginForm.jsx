import { useState } from "react";
import { Gamepad2 } from "lucide-react";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Pogrešno korisničko ime ili lozinka");
      }

      const token = await response.text();

      console.log("NOVI TOKEN:",token);

      localStorage.setItem("token", token);

      onLogin(token);
   
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="login-form__panel">
        <div className="login-form__logo">
          <Gamepad2 size={22} />
          <span>GameMatch</span>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="login-form__input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="login-form__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-form__error">{error}</p>}

          <button className="login-form__button" type="submit" disabled={loading}>
            {loading ? "Prijavljivanje..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}