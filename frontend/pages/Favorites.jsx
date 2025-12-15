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
        const text = await res.text();
        console.error("Favorites request failed:", res.status, text);
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
          };
        })
      );

      setFavorites(withDetails);
    } catch (err) {
      console.error("Error loading favorites:", err);
      setError("Error loading favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFavorite = async (id) => {
    try {
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/favorites/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Delete favorite failed:", res.status, text);
        setError("Failed to remove favorite.");
        return;
      }

      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (err) {
      console.error("Error deleting favorite:", err);
      setError("Error deleting favorite.");
    }
  };

  // --- SHARE ---
  const createShareLink = async () => {
    setError("");
    setMsg("");
    setShareLoading(true);

    try {
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/favorites/share`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Create share link failed:", res.status, text);
        setError("Failed to create share link.");
        return;
      }

      const data = await res.json();
      setShareUrl(data.share_url || "");
      setMsg("Share link created!");
    } catch (e) {
      console.error(e);
      setError("Error creating share link.");
    } finally {
      setShareLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMsg("Copied to clipboard!");
    } catch {
      setError("Copy failed. You can copy the URL manually.");
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Favorites</h2>
          <div className="text-muted small">Your personal favorites list</div>
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

      {/* SHARE CARD */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-2">Share your favorites</h5>
          <p className="text-muted mb-3">
            Create a link that others can open to view your favorites list.
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
              <div className="d-flex gap-2">
                <a
                  className="btn btn-outline-success"
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open link
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FAVORITES LIST */}
      {loading && <div className="text-muted">Loading...</div>}

      {!loading && favorites.length === 0 && (
        <div className="text-muted">No favorites yet.</div>
      )}

      <div className="row g-3">
        {favorites.map((fav) => (
          <div className="col-12 col-md-6 col-lg-4" key={fav.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex gap-3">
                {/* Small poster like SharedFavorites */}
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

                <div className="flex-grow-1 d-flex flex-column">
                  <div className="fw-semibold">{fav.title}</div>
                  {fav.year && <div className="text-muted small">{fav.year}</div>}

                  <div className="mt-2">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFavorite(fav.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
