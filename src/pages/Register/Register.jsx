import React, { useState } from "react";
import Message from "../../components/Message";
import "./register.css";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function registerUser(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log("data", data);
    if (response.status === 400) {
      setError(true);
    } else {
      setError(false);
      window.location.href = "/";
    }
  }

  return (
    <div className="container">
      <div className="signup-section">
        <h1>Register</h1>
        <div className="signup-form">
          <form onSubmit={registerUser}>
            <h3>Name</h3>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="First Name"
            />
            <h3>Email</h3>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
            <h3>Password</h3>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            {error && (
              <Message
                message={
                  "There seems to be an issue please recheck the credentials"
                }
              />
            )}
            <input className="btn-submit" type="submit" value="Register" />
          </form>
          <h3 className="create-account">
            Already an user?
            <span>
              <a href="/">Sign in </a>
            </span>
          </h3>
        </div>
      </div>

      <img
        src="https://cdn.dribbble.com/userupload/3964892/file/original-7a4d60355c4694d5ecb38c0093e8c086.png?compress=1&resize=1024x768"
        alt=""
      />
    </div>
  );
}

export default App;
