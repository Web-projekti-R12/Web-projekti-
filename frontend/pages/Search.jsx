import { useState } from "react";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [people, setPeople] = useState([]);

  const apiKey = import.meta.env.VITE_APP_TMDB_API_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&language=en-US&page=1`;

    const res = await fetch(url);
    const data = await res.json();
    const results = data.results || [];

    setMovies(results.filter((item) => item.media_type === "movie"));
    setTvShows(results.filter((item) => item.media_type === "tv"));
    setPeople(results.filter((item) => item.media_type === "person"));
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
        <button>Search</button>
      </form>

      {movies.length > 0 && (
        <div>
          <h2>Movies</h2>
          {movies.map((movie) => (
            <div key={movie.id}>
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </div>
          ))}
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
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={show.name}
              />
              <p>{show.name}</p>
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
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                />
              )}
              <p>{person.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

