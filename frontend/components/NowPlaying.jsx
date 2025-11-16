import { useEffect, useState } from "react";

const NowInCinemas = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_APP_TMDB_API_KEY;

    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=fi-FI&region=FI&page=1&api_key=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>Now in movies</h1>

      <div style={styles.carouselWrapper}>
        <div style={styles.carousel}>
          {movies.map((movie) => (
            <div key={movie.id} style={styles.card}>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={styles.image}
                />
              )}
              <h3 style={styles.title}>{movie.title}</h3>
            </div>
          ))}

          {movies.length === 0 && (
            <p style={styles.empty}>Not found any movies rigth now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NowInCinemas;

const styles = {
  heading: {
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "22px",
    fontWeight: "bold",
  },
  carouselWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  carousel: {
    display: "flex",
    gap: "16px",
    padding: "20px",
  },
  card: {
    flex: "0 0 auto",
    width: "180px",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    borderRadius: "8px",
  },
  title: {
    marginTop: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    fontSize: "16px",
    color: "#555",
  },
};
