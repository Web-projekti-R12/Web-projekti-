import { useState, useEffect } from "react";

export default function UserReviews() {
    const [reviews, setReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editInputs, setEditInputs] = useState({});
    const [movieData, setMovieData] = useState({});

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to fetch reviews:", text);
                setReviews([]);
                return;
            }

            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);

            data.forEach(async (review) => {
                if (!movieData[review.tmdb_movie_id]) {
                    try {
                        const tmdbRes = await fetch(
                            `https://api.themoviedb.org/3/movie/${review.tmdb_movie_id}?api_key=${import.meta.env.VITE_APP_TMDB_API_KEY}`
                        );
                        const tmdbInfo = await tmdbRes.json();
                        setMovieData((prev) => ({
                            ...prev,
                            [review.tmdb_movie_id]: {
                                title: tmdbInfo.title,
                                poster_path: tmdbInfo.poster_path,
                            },
                        }));
                    } catch (err) {
                        console.error("Error fetching TMDB data:", err);
                    }
                }
            });
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setReviews([]);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleEditClick = (review) => {
        setEditingReviewId(review.rating_id);
        setEditInputs({
            title: review.title,
            content: review.content,
            rating: review.rating,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (reviewId) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("You must be logged in to update a review.");
            return;
        }

        if (!editInputs.title.trim() || !editInputs.content.trim()) {
            alert("Please provide both title and content.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: editInputs.title,
                    content: editInputs.content,
                    rating: Number(editInputs.rating),
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to update review:", text);
                alert("Failed to update review.");
                return;
            }

            await res.json();
            setEditingReviewId(null);
            fetchReviews();
        } catch (err) {
            console.error("Error updating review:", err);
            alert("Error updating review.");
        }
    };

    const handleDelete = async (reviewId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error(await res.text());
        alert("Failed to delete review.");
        return;
      }

      setReviews((prev) => prev.filter((r) => r.rating_id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Error deleting review.");
    }
  };

    return (
        <div>
            <h1>My Reviews</h1>
            {reviews.length === 0 && <p>No reviews yet.</p>}

            {reviews.map((review) => {
                const movie = movieData[review.tmdb_movie_id] || {};
                return (
                    <div key={review.rating_id}>
                        <img
                            src={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                    : "https://via.placeholder.com/200x300?text=No+Image"
                            }
                            alt={movie.title || "Movie Poster"}
                        />
                        <h2>{movie.title || "Loading..."}</h2>

                        <p>Created: {new Date(review.created_at).toLocaleString()}</p>
                        {review.updated_at && (
                            <p>Updated: {new Date(review.updated_at).toLocaleString()}</p>
                        )}

                        {editingReviewId === review.rating_id ? (
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    value={editInputs.title}
                                    onChange={handleEditChange}
                                />
                                <textarea
                                    name="content"
                                    value={editInputs.content}
                                    onChange={handleEditChange}
                                />
                                <input
                                    type="number"
                                    name="rating"
                                    min={1}
                                    max={5}
                                    value={editInputs.rating}
                                    onChange={handleEditChange}
                                />
                                <button onClick={() => handleEditSubmit(review.rating_id)}>
                                    Save
                                </button>
                                <button onClick={() => setEditingReviewId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p><strong>{review.title}</strong></p>
                                <p>{review.content}</p>
                                <p>Rating: {review.rating}</p>
                                <button onClick={() => handleEditClick(review)}>Edit</button>
                                <button onClick={() => handleDelete(review.rating_id)}>Delete</button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
