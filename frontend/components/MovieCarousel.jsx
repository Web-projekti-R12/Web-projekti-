import { useEffect, useState } from "react";
import "./MovieCarousel.css";

const MovieCarousel = ({ title, endpoint, showReleaseDate = false }) => {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    const apiKey = import.meta.env.VITE_APP_TMDB_API_KEY;
    if (!apiKey) {
      setStatus("error");
      setError("TMDB API key is missing (VITE_APP_TMDB_API_KEY).");
      return;
    }

    const url = `https://api.themoviedb.org/3/movie/${endpoint}?language=fi-FI&region=FI&page=1&api_key=${apiKey}`;

    setStatus("loading");
    setError("");

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setMovies((data.results || []).slice(0, 20));
        setStatus("success");
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setError("Could not load movies right now.");
      });
  }, [endpoint]);

  return (
    <section className="mc">
      <h2 className="mc-heading">{title}</h2>

      <div className="mc-carousel-wrapper">
        <div className="mc-carousel">
          {status === "loading" && <p className="mc-info">Loading…</p>}
          {status === "error" && <p className="mc-error">{error}</p>}
          {status === "success" && movies.length === 0 && (
            <p className="mc-info">No movies found.</p>
          )}

          {status === "success" &&
            movies.map((movie) => (
              <div key={movie.id} className="mc-card">
                {movie.poster_path ? (
                  <img
                    className="mc-image"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="mc-noPoster">No poster</div>
                )}

                <h3 className="mc-title">{movie.title}</h3>

                {showReleaseDate && (
                  <p className="mc-date">
                    <strong>Release date:</strong>{" "}
                    {movie.release_date ? movie.release_date : "N/A"}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
