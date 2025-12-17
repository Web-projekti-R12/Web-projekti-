import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Brand */}
        <div className="footer-left">
          <p className="footer-brand">MovieHub</p>
          <p className="footer-copy">Group 11 | {year} MovieHub</p>
        </div>

        {/* Navigation links */}
        <nav className="footer-nav">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/search" className="footer-link">Search</Link>
          <Link to="/groups" className="footer-link">Groups</Link>
          <Link to="/login" className="footer-link">Login</Link>
          <Link to="/registration" className="footer-link">Register</Link>
          <Link to="/favorites/1" className="footer-link">Favorites</Link>
        </nav>

      </div>
    </footer>
  );
}
