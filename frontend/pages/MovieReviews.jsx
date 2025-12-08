import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MovieReviews() {
  const { tmdbId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovieInfo();
    fetchMovieReviews();
  }, []);

  const fetchMovieInfo = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${import.meta.env.VITE_APP_TMDB_API_KEY}`
    );
    const data = await res.json();
    setMovie(data);
    console.log("Movie TMDB ID from URL:", tmdbId);

  };

  const fetchMovieReviews = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/movie/${tmdbId}`);
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
  };

  return (
    <div>
      {movie && (
        <>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Image"
            }
          />
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
        </>
      )}

      <h3>User Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((review) => (
        <div key={review.rating_id}>
          <p><strong>{review.title}</strong></p>
          <p>{review.content}</p>
          <p>Rating: {review.rating}/5</p>
          <p><strong>By user:</strong> {review.email}</p>
          <p>Created: {new Date(review.created_at).toLocaleString()}</p>
          {review.updated_at && (
            <p>Updated: {new Date(review.updated_at).toLocaleString()}</p>
          )}
        </div>
      ))}
    </div>
  );
}
