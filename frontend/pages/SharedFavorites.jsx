// pages/SharedFavorites.jsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;

export default function SharedFavorites() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const sig = searchParams.get("sig") || "";

  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/favorites/${userId}?sig=${encodeURIComponent(sig)}`
      );

      if (!res.ok) {
        setError("Shared favorites not available.");
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
    } catch (e) {
      console.error(e);
      setError("Error loading shared favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, sig]);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Shared favorites</h2>
        </div>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Home
        </Link>
      </div>

      {loading && <div className="text-muted">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && favorites.length === 0 && (
        <div className="text-muted">No favorites.</div>
      )}

      {/* Favorites list */}
      <div className="row g-3">
        {favorites.map((fav) => (
          <div className="col-12 col-md-6 col-lg-4" key={fav.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex gap-3">
                {/* Small poster */}
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

                {/* Movie info */}
                <div className="flex-grow-1">
                  <div className="fw-semibold">{fav.title}</div>
                  {fav.year && (
                    <div className="text-muted small">{fav.year}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
