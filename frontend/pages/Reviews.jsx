import { useEffect, useState } from 'react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    tmdb_movie_id: '',
    rating: '',
    title: '',
    content: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating)
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      const newReview = await res.json();

      setReviews([newReview, ...reviews]);

      setFormData({
        user_id: '',
        tmdb_movie_id: '',
        rating: '',
        title: '',
        content: ''
      });

    } catch (err) {
      setError('Error submitting review');
      console.error(err);
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Reviews</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          value={formData.user_id}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="tmdb_movie_id"
          placeholder="TMDB Movie ID"
          value={formData.tmdb_movie_id}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Review</button>
      </form>

      <hr />

      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id}>
            <h3>{review.title}</h3>
            <p>Rating: {review.rating}</p>
            <p>{review.content}</p>
            <p>
              User: {review.user_id} | Movie: {review.tmdb_movie_id}
            </p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;
