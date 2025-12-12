import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

export default function MovieSearch() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [language, setLanguage] = useState("");
  const [yearRange, setYearRange] = useState({ min: 2000, max: 2025 });
  const [isGenresOpen, setIsGenresOpen] = useState(false);

  const [activeReviewMovieId, setActiveReviewMovieId] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const navigate = useNavigate();
  const genresRef = useRef(null);

  const TMDB_API_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Slider values
  const SLIDER_MIN = 1900;
  const SLIDER_MAX = 2025;

  const languageMap = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ru: "Russian",
    pt: "Portuguese",
    da: "Danish",
    no: "Norwegian",
    cs: "Czech",
    pl: "Polish"
  };

  useEffect(() => {
    fetchGenres();
    fetchLanguages();
    discoverMovies();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.genres)) {
        setGenres(data.genres);
      } else {
        console.error("Failed to load genres", data);
      }
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/configuration/languages?api_key=${TMDB_API_KEY}`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setLanguages(data);
      } else {
        console.error("Failed to load languages", data);
      }
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  const discoverMovies = async (page = 1) => {
    try {
      const params = new URLSearchParams();
      params.append("api_key", TMDB_API_KEY);
      params.append("language", "en-US");
      params.append("sort_by", "popularity.desc");
      params.append("page", String(page));
      params.append("include_adult", "false");

      if (selectedGenres.length > 0) {
        params.append("with_genres", selectedGenres.join(","));
      }

      if (language) {
        params.append("with_original_language", language);
      }

      if (yearRange.min) {
        params.append("primary_release_date.gte", `${yearRange.min}-01-01`);
      }
      if (yearRange.max) {
        params.append("primary_release_date.lte", `${yearRange.max}-12-31`);
      }

      const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        console.error("Discover API error:", data);
        setMovies([]);
        return;
      }

      setMovies(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("Error discovering movies:", err);
      setMovies([]);
    }
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
  };

  const resetGenres = () => {
    setSelectedGenres([]);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (genresRef.current && !genresRef.current.contains(e.target)) {
        setIsGenresOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinYearChange = (value) => {
    let val = Number(value);
    if (val > yearRange.max) val = yearRange.max;
    if (val < SLIDER_MIN) val = SLIDER_MIN;
    setYearRange((prev) => ({ ...prev, min: val }));
  };

  const handleMaxYearChange = (value) => {
    let val = Number(value);
    if (val < yearRange.min) val = yearRange.min;
    if (val > SLIDER_MAX) val = SLIDER_MAX;
    setYearRange((prev) => ({ ...prev, max: val }));
  };

  const applyFilters = (e) => {
    e?.preventDefault?.();
    discoverMovies(1);
  };

  const handleInputChange = (movieId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [movieId]: { ...prev[movieId], [field]: value },
    }));
  };

  const addToFavorites = async (movieId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to add favorites");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: movieId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to add favorite:", res.status, text);
        alert("Failed to add favorite");
        return;
      }

      await res.json();
      alert("Added to favorites!");
    } catch (err) {
      console.error("Error adding favorite:", err);
      alert("Failed to add favorite");
    }
  };

  const handleAddReview = async (movie) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to submit a review");
      return;
    }

    const inputs = reviewInputs[movie.id] || {};
    const { title = "", content = "", rating = "" } = inputs;

    if (!title.trim() || !content.trim()) {
      alert("Please provide both title and content");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tmdb_movie_id: movie.id,
          title,
          content,
          rating: Number(rating),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to submit review:", text);
        alert("Failed to submit review");
        return;
      }

      const data = await res.json();
      console.log("Review submitted:", data);
      alert("Review submitted successfully!");

      setReviewInputs((prev) => ({ ...prev, [movie.id]: {} }));
      setActiveReviewMovieId(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Error submitting review");
    }
  };

  return (
    <div className="search-container">
      <form className="filters" onSubmit={applyFilters}>
        <div className="filter-group">
          <label>Genres</label>
          <div
            className={`genres-dropdown ${isGenresOpen ? "open" : ""}`}
            ref={genresRef}
          >
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setIsGenresOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={isGenresOpen}
            >
              {selectedGenres.length > 0
                ? `${selectedGenres.length} selected`
                : "Select genres"}
            </button>

            {isGenresOpen && (
              <div className="genres-list" role="menu">
                {genres.map((g) => (
                  <label key={g.id} className="genre-item">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(g.id)}
                      onChange={() => toggleGenre(g.id)}
                    />
                    <span>{g.name}</span>
                  </label>
                ))}

                <button
                  type="button"
                  className="reset-genres-btn"
                  onClick={resetGenres}
                >
                  Reset Genres
                </button>
              </div>
            )}

          </div>
        </div>

        <div className="filter-group">
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Any</option>
            {languages.map((lang) => (
              <option key={lang.iso_639_1} value={lang.iso_639_1}>
                {lang.english_name || lang.name || lang.iso_639_1}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Release year</label>

          <div className="year-slider">
            <div className="year-values">
              <span>{yearRange.min}</span>
              <span>{yearRange.max}</span>
            </div>

            <div className="range-container">
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                value={yearRange.min}
                onChange={(e) => handleMinYearChange(e.target.value)}
                className="range range-min"
              />
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                value={yearRange.max}
                onChange={(e) => handleMaxYearChange(e.target.value)}
                className="range range-max"
              />
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit">Apply Filters</button>
          <button
            type="button"
            onClick={() => {
              setSelectedGenres([]);
              setLanguage("");
              setYearRange({ min: 2000, max: SLIDER_MAX });
              discoverMovies(1);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <div className="movie-list">
        <h2>Movies</h2>

        {movies.length === 0 && <p>No movies found. Try changing filters.</p>}

        {movies.map((movie) => {
          const inputs = reviewInputs[movie.id] || {};
          const isActive = activeReviewMovieId === movie.id;

          return (
            <div className="movie-card" key={movie.id}>
              <div className="poster-overview">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "https://via.placeholder.com/150x225?text=No+Image"
                  }
                  alt={movie.title}
                />
                <p className="overview">{movie.overview || "No overview."}</p>
              </div>

              <div className="bottom-section">
                <p><strong>{movie.title}</strong></p>
                <span className="release-date">Release Date: {movie.release_date || "N/A"}</span>
                <span className="language">Language: {languageMap[movie.original_language] || movie.original_language}</span>

                <div className="button-group">
                  <button onClick={() => addToFavorites(movie.id)}>
                    Add to favorites
                  </button>

                  <button
                    onClick={() =>
                      setActiveReviewMovieId(isActive ? null : movie.id)
                    }
                  >
                    {isActive ? "Cancel Review" : "Review this movie"}
                  </button>

                  <button onClick={() => navigate(`/reviews/movie/${movie.id}`)}>
                    Show Reviews
                  </button>
                </div>

                {isActive && (
                  <div className="review-form">
                    <input
                      type="text"
                      placeholder="Review Title"
                      value={inputs.title || ""}
                      onChange={(e) =>
                        handleInputChange(movie.id, "title", e.target.value)
                      }
                    />
                    <textarea
                      placeholder="Review Content"
                      value={inputs.content || ""}
                      onChange={(e) =>
                        handleInputChange(movie.id, "content", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      min={1}
                      max={5}
                      placeholder="Rating (1-5)"
                      value={inputs.rating || ""}
                      onChange={(e) =>
                        handleInputChange(movie.id, "rating", e.target.value)
                      }
                    />
                    <button onClick={() => handleAddReview(movie)}>
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
