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
import Reviews from '../pages/Reviews';
import ProtectedRoute from "../components/ProtectedRoute";
import Favorites from "../pages/Favorites";
import MovieReviews from "../pages/MovieReviews";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Navbar />

      {isHomePage && <Header />}
    
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<MovieSearch />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/reviews/movie/:tmdbId" element={<MovieReviews />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/groups" exact element={<Groups />} />
          <Route path="/reviews" exact element={<Reviews />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
