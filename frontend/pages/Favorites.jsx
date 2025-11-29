import { useEffect, useState } from "react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Lataa suosikit
  const loadFavorites = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favorites`);
      const favs = await res.json();

      const withDetails = await Promise.all(
        favs.map(async (fav) => {
          const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/movie/${fav.movie_id}?api_key=${
              import.meta.env.VITE_APP_TMDB_API_KEY
            }&language=en-US`
          );
          const data = await tmdbRes.json();
          return {
            ...fav,
            title: data.title,
            poster: data.poster_path,
          };
        })
      );

      setFavorites(withDetails);
    } catch (err) {
      console.error("Error loading favorites:", err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Poista suosikki
  const removeFavorite = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/favorites/${id}`, {
        method: "DELETE",
      });
      // Päivitä lista poistamisen jälkeen
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (err) {
      console.error("Error deleting favorite:", err);
    }
  };

  return (
    <div>
      <h2>Favorites</h2>
      {favorites.length === 0 && <p>No favorites yet.</p>}
      {favorites.map((fav) => (
        <div key={fav.id} style={{ marginBottom: "20px" }}>
          <img
            src={
              fav.poster
                ? `https://image.tmdb.org/t/p/w500${fav.poster}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={fav.title}
            style={{ width: "150px" }}
          />
          <p>{fav.title}</p>
          <button onClick={() => removeFavorite(fav.id)}>Remove from favorites</button>
        </div>
      ))}
    </div>
  );
}
