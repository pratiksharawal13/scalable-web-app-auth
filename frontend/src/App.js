import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("process.env.REACT_APP_API_URL/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  // DASHBOARD
  if (loggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Dashboard</h2>
        <p>You are logged in 🎉</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  // LOGIN FORM
  return (
    <form
      onSubmit={handleLogin}
      style={{ width: "300px", margin: "100px auto", textAlign: "center" }}
    >
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", margin: "5px", padding: "8px" }}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", margin: "5px", padding: "8px" }}
        required
      />

      <button style={{ marginTop: "10px", padding: "8px 20px" }}>
        Login
      </button>
    </form>
  );
}

export default App;
