import React from "react";
import moviehubImage from "../src/assets/header6.png";
import "./Header.css";

function Header() {
  return (
    <header
      className="header-banner"
      style={{ backgroundImage: `url(${moviehubImage})` }}
    >
    </header>
  );
}

export default Header;
