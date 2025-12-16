import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [shareUrl, setShareUrl] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  const token = localStorage.getItem("authToken");

  const loadFavorites = async () => {
    setError("");
    setMsg("");
    setLoading(true);

    try {
      if (!token) {
        setError("You must be logged in.");
        setFavorites([]);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setError("Failed to load favorites.");
        setFavorites([]);
        return;
      }

      const favs = await res.json();

      const withDetails = await Promise.all(
        favs.map(async (fav) => {
          const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/movie/${fav.movie_id}?api_key=${TMDB_KEY}&language=en-US`
          );
          const data = await tmdbRes.json();
          return {
            ...fav,
            title: data.title,
            poster: data.poster_path,
            year: data.release_date?.slice(0, 4),
            overview: data.overview,
          };
        })
      );

      setFavorites(withDetails);
    } catch {
      setError("Error loading favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (id) => {
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/api/favorites/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok || res.status === 204) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    }
  };

  const toggleOverview = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const createShareLink = async () => {
    setError("");
    setMsg("");
    setShareLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/favorites/share`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setError("Failed to create share link.");
        return;
      }

      const data = await res.json();
      setShareUrl(data.share_url || "");
      setMsg("Share link created!");
    } finally {
      setShareLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setMsg("Copied to clipboard!");
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Favorites</h2>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={loadFavorites}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      {/* SHARE */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">Share your favorites</h5>
          <p className="text-muted small">
            Create a link and share!
          </p>

          {!shareUrl ? (
            <button
              className="btn btn-primary"
              onClick={createShareLink}
              disabled={shareLoading}
            >
              {shareLoading ? "Creating..." : "Create share link"}
            </button>
          ) : (
            <>
              <div className="input-group mb-2">
                <input className="form-control" value={shareUrl} readOnly />
                <button className="btn btn-outline-primary" onClick={copyToClipboard}>
                  Copy
                </button>
              </div>
              <a
                className="btn btn-outline-success btn-sm"
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open link
              </a>
            </>
          )}
        </div>
      </div>

      {/* LIST */}
      {loading && <div className="text-muted">Loading...</div>}
      {!loading && favorites.length === 0 && (
        <div className="text-muted">No favorites yet.</div>
      )}

      <div className="d-flex flex-column gap-2">
        {favorites.map((fav) => (
          <div key={fav.id} className="card shadow-sm">
            <div className="card-body d-flex align-items-center gap-3">
              <img
                src={
                  fav.poster
                    ? `https://image.tmdb.org/t/p/w92${fav.poster}`
                    : "https://via.placeholder.com/92x138?text=No+Image"
                }
                alt={fav.title}
                style={{
                  width: 60,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />

              <div className="fw-semibold">{fav.title}</div>
              {fav.year && <div className="text-muted small">{fav.year}</div>}

              {fav.overview && (
                <div className="mt-1">
                  <div className="text-muted small" style={{ lineHeight: 1.4 }}>
                    {expanded[fav.id] ? fav.overview : (
                      fav.overview.length > 160 ? fav.overview.slice(0, 160) + "…" : fav.overview
                    )}
                  </div>

                  {fav.overview.length > 160 && (
                    <button
                      type="button"
                      className="btn btn-link btn-sm px-0 py-0 mt-1"
                      onClick={() => toggleOverview(fav.id)}
                    >
                      {expanded[fav.id] ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeFavorite(fav.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}