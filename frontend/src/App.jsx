import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Login from "../pages/Login";
import Groups from "../pages/Groups";
import MovieSearch from "../pages/Search";
import Registration from "../pages/Registration";
import Reviews from "../pages/Reviews";
import ProtectedRoute from "../components/ProtectedRoute";
import Favorites from "../pages/Favorites";
import MovieReviews from "../pages/MovieReviews";
import Profile from "../pages/Profile";
import GroupDetail from "../pages/GroupDetail";
import SharedFavorites from "../pages/SharedFavorites";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="app-layout">
      {/* NAVBAR */}
      <Navbar />

      {/* HEADER vain etusivulla */}
      {isHomePage && <Header />}

      {/* PAGE CONTENT */}
      <main className="app-content">
        <Routes>
          {/* Julkiset reitit */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<MovieSearch />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/reviews/movie/:tmdbId" element={<MovieReviews />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/favorites/:userId" element={<SharedFavorites />} />

          {/* Suojatut reitit */}
          <Route element={<ProtectedRoute />}>
            <Route path="/groups/:id" element={<GroupDetail />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
