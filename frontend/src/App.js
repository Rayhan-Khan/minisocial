import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import Home from "./page/home";
import Login from "./page/login";
import Notfound from "./page/notfound";
import Profile from "./page/profile";
import Signup from "./page/signup";
import Header from "./page/hedaer";
import NotLoggedin from "./utils/notLoggedin";
import SearchUser from "./page/searchUser";

function App() {
  const [token, setToken] = useState(Cookies.get("user"));
  return (
    <>
      <BrowserRouter>
        <Routes>
          {token && (
            <Route path="/" element={<Header setToken={setToken} />}>
              <Route index element={<Home />} />
              <Route path="profile/:id" element={<Profile/>} />
              <Route path="search/:username" element={<SearchUser />} />
            </Route>
          )}
          <Route path="/" element={<NotLoggedin token={token} />}>
            <Route index element={<Login setToken={setToken} />} />
            <Route path="login" element={<Login setToken={setToken} />} />
            <Route path="signup" element={<Signup setToken={setToken} />} />
          </Route>
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
