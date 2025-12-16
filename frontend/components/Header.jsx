import React from "react";
import moviehubImage from "../src/assets/header6.png";
import "./Header.css";

function Header() {
  return (
    <div
      className="header-banner"
      style={{ backgroundImage: `url(${moviehubImage})` }}
    >
    </div>
  );
}

export default Header;
