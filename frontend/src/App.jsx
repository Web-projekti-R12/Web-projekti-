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
import Profile from "../pages/Profile";

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
          <Route path="/favorites" element={<Favorites />} />
          

        <Route element={<ProtectedRoute />}>
          <Route path="/groups" exact element={<Groups />} />
          <Route path="/reviews" exact element={<Reviews />} />
          <Route path="/profile" element={<Profile />} />
          
        </Route>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
