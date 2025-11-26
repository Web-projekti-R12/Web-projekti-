import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Login from "../pages/Login";
import Groups from "../pages/Groups";
import MovieTestPage from "../pages/Movie_test_page";
import MovieSearch from "../pages/Search";
import Registration from "../pages/Registration";
import ProtectedRoute from "../components/ProtectedRoute";
import Favorites from "./Favorites"; // <-- tuodaan suosikit

function App() {
  return (
    <>
      <Navbar />
      <Header />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<MovieSearch />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/movietestpage" element={<MovieTestPage />} />
          <Route path="/favorites" element={<Favorites />} /> {/* uusi reitti */}

          <Route element={<ProtectedRoute />}>
            <Route path="/groups" element={<Groups />} />
          </Route>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
