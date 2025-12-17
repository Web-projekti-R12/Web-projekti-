import MovieCarousel from "./MovieCarousel";

const InComingMovies = () => {
  return (
    <MovieCarousel
      title="Upcoming movies"
      endpoint="upcoming"
      showReleaseDate={true}
    />
  );
};

export default InComingMovies;
