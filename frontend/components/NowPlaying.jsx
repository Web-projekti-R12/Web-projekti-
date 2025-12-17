import MovieCarousel from "./MovieCarousel";

const NowPlaying = () => {
  return (
    <MovieCarousel
      title="Now in cinemas"
      endpoint="now_playing"
      showReleaseDate={false}
    />
  );
};

export default NowPlaying;
