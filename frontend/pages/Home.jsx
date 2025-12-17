import NowPlaying from "../components/NowPlaying";
import InComingMovies from "../components/InComingMovies";
import "./Home.css";

export default function Home() {
  return (
    <main className="home">
      
      {/* Hero / intro */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <h1 className="home-title">Welcome to MovieHub</h1>
          <p className="home-subtitle">
            Search, comment and add movies to your favorites list and share it!
          </p>
        </div>
      </section>

      {/* Now playing */}
      <section className="home-section">
        <NowPlaying />
      </section>

      {/* Upcoming */}
      <section className="home-section">
        <InComingMovies />
      </section>

    </main>
  );
}
