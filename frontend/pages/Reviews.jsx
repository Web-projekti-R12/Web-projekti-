import { useEffect, useState } from "react";

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadReviews = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ratings`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const favs = await res.json();


            const withDetails = await Promise.all(
                favs.map(async (fav) => {
                    const tmdbRes = await fetch(
                        `https://api.themoviedb.org/3/movie/${fav.tmdb_movie_id}?api_key=${import.meta.env.VITE_APP_TMDB_API_KEY}&language=en-US`
                    );
                    const data = await tmdbRes.json();
                    return { ...fav, title: data.title, poster: data.poster_path };
                })
            );
            setReviews(withDetails);

        } catch (err) {
            console.error("Error loading reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <h2>My Reviews</h2>

            {reviews.length === 0 && <p>You haven't posted any reviews yet.</p>}

            {reviews.map(r => (
                <div
                    key={r.rating_id}
                    style={{
                        borderBottom: "1px solid #ddd",
                        padding: "16px 0"
                    }}
                >
                    <h3>
                        TMDB Movie ID: {r.tmdb_movie_id} — ⭐ {r.rating}/5
                    </h3>

                    {r.title && <h4>{r.title}</h4>}
                    {r.content && <p>{r.content}</p>}

                    <small>
                        Posted on {new Date(r.created_at).toLocaleDateString()}
                    </small>
                </div>
            ))}
        </div>
    );
}

