import React from "react";
import bannerVid from "../src/assets/bannervid3.mp4";
import "./Header.css";

function Header() {
  return (
    <header className="header-banner">
      <video
        className="header-video"
        src={bannerVid}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* tumma overlay että tekstit erottuu */}
      <div className="header-overlay" />

      <div className="header-content">
        <h1 className="header-title">MOVIEHUB</h1>
        <p className="header-subtitle">Browse movies & reviews.</p>
      </div>
    </header>
  );
}

export default Header;
