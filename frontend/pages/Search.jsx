import { useState } from "react";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [people, setPeople] = useState([]);
  const [activeReviewMovieId, setActiveReviewMovieId] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});

  const apiKey = import.meta.env.VITE_APP_TMDB_API_KEY;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&language=en-US&page=1`;

    const res = await fetch(url);
    const data = await res.json();
    const results = data.results || [];

    // Suodata tulokset eri kategorioihin
    setMovies(results.filter((item) => item.media_type === "movie"));
    setTvShows(results.filter((item) => item.media_type === "tv"));
    setPeople(results.filter((item) => item.media_type === "person"));
  };

  const handleInputChange = (movieId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [movieId]: { ...prev[movieId], [field]: value },
    }));
  };

  // Lisää suosikki backendin kautta
  const addToFavorites = async (movieId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: 1, movie_id: movieId }), // testikäyttäjä user_id=1
      });
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
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows or people..."
        />
        <button type="submit">Search</button>
      </form>

      {movies.length > 0 && (
        <div>
          <h2>Movies</h2>
          {movies.map((movie) => {
            const inputs = reviewInputs[movie.id] || {};
            const isActive = activeReviewMovieId === movie.id;

            return (
              <div
                key={movie.id}
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                }}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={movie.title}
                  style={{ display: "block", marginBottom: "5px" }}
                />
                <p>{movie.title}</p>
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

                {isActive && (
                  <div style={{ marginTop: "10px" }}>
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
            );
          })}
        </div>
      )}

      {tvShows.length > 0 && (
        <div>
          <h2>TV Shows</h2>
          {tvShows.map((show) => (
            <div key={show.id}>
              <img
                src={
                  show.poster_path
                    ? `https://image.tmdb.org/t/p/w200${show.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={show.name}
              />
              <p>{show.name}</p>
              <button onClick={() => addToFavorites(show.id)}>
                Add to favorites
              </button>
            </div>
          ))}
        </div>
      )}

      {people.length > 0 && (
        <div>
          <h2>People</h2>
          {people.map((person) => (
            <div key={person.id}>
              {person.profile_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                  alt={person.name}
                />
              )}
              <p>{person.name}</p>
              <button onClick={() => addToFavorites(person.id)}>
                Add to favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}