import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Router } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Notes from "./pages/Notes/Notes";
import Verification from "./pages/Verification/verification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/notes" Component={Notes} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
