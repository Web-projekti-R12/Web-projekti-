
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;

export default function AddMovieToGroup({ groupId, onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  const search = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);

    if (!query.trim()) return;

    try {
      setLoading(true);
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
        query
      )}&language=en-US&page=1`;

      const res = await fetch(url);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const addToGroup = async (tmdbMovieId) => {
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      setAddingId(tmdbMovieId);

      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tmdb_movie_id: tmdbMovieId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Add movie failed:", res.status, text);
        setError("Failed to add movie.");
        setAddingId(null);
        return;
      }

      onAdded?.(); // reload list in parent
      setQuery("");
      setResults([]);
    } catch (err) {
      console.error(err);
      setError("Failed to add movie.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Add a movie to this group</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={search} className="d-flex gap-2">
          <input
            className="form-control"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movie by title."
          />
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {results.length > 0 && (
          <div className="list-group mt-3">
            {results.slice(0, 10).map((m) => (
              <div
                key={m.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-semibold">{m.title}</div>
                  <div className="text-muted small">
                    {m.release_date ? m.release_date.slice(0, 4) : "—"}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => addToGroup(m.id)}
                  disabled={addingId === m.id}
                >
                  {addingId === m.id ? "Adding..." : "Add"}
                </button>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="text-muted small mt-3">
            Search & Chat
          </div>
        )}
      </div>
    </div>
  );
}
