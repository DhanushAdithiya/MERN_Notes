import React, { useState } from "react";
import Message from "../../components/Message";
import "./login.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function loginUser(e) {
    e.preventDefault();

    setError(false);

    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      setError(false);
      localStorage.setItem("token", data.token);
      window.location.href = "/notes";
    } else {
      setError(true);
    }
  }

  return (
    <>
      <div className="container">
        <div className="login-section">
          <div className="login-text">
            <h1>Welcome back!</h1>
            <h3>Please log back into the app</h3>
          </div>
          <div className="login-info">
            <form className="login-form" onSubmit={loginUser}>
              <h3>Username</h3>
              <input
                className="form__field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                name="username"
                id="username"
                required
              />
              <h3>Password</h3>

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
              {error && <Message message={"Incorrect Email or Password"} />}
              <input className="btn-submit" type="submit" value="Login" />
            </form>
            <h3 className="create-account">
              Don't have an account?{" "}
              <span>
                <a href="/register">Sign Up </a>
              </span>
            </h3>
          </div>
        </div>
        <img
          src="https://cdn.dribbble.com/userupload/7850433/file/original-06082ad2cc73967f36c47c87b4a3c70e.jpg?compress=1&resize=1024x1024"
          alt="vector"
        />
      </div>
    </>
  );
}

export default App;
