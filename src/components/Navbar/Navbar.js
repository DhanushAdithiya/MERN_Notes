import React, { useRef, useState } from "react";
import settings from "../../icons/settings.svg";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

function logOutUser(navigate) {
  localStorage.removeItem("token");
  navigate("/");
}

function DisplaySetting({ setBackground, id }) {
  async function setNewBackgound(background) {
    console.log(background);
    const response = await fetch(`http://localhost:5000/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        background,
      }),
    });

    const data = await response.json();
    console.log(data);
    console.log(response);

    if (response.status === 200) {
      setBackground(background);
    }
  }

  const naviagte = useNavigate();
  const bg = useRef(null);
  return (
    <>
      <input
        className="btn-submit"
        type="submit"
        value="Logout"
        onClick={() => logOutUser(naviagte)}
      />
      <h3>Add a background image</h3>
      <div className="add-bg">
        <input
          type="text"
          placeholder={"background image"}
          className="nav-bg"
          ref={bg}
        ></input>
        <input
          className="bg-submit"
          type="submit"
          value="Add"
          onClick={() => setNewBackgound(bg.current.value, id)}
        />
      </div>
    </>
  );
}

function Navbar({ user, setBackground, id }) {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <nav>
      <div className="nav-logo">
        <h2>Notpad - X</h2>
      </div>

      <div className="nav-user">
        <h2>{user}</h2>
        <div className="nav-logout">
          <img
            className="nav-settings"
            src={settings}
            alt="settings"
            onClick={() => setShowLogout((prevState) => !prevState)}
          />
          {showLogout && (
            <DisplaySetting setBackground={setBackground} id={id} />
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
