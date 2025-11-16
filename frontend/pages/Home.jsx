import NowPlaying from "../components/NowPlaying";
import InComingMovies from "../components/InComingMovies";

export default function Home() {
  return (
    <>
    <div>
      <h1>Tekstiä</h1>
    </div>
      <div>
        <NowPlaying />
      </div>
      <div>
        <InComingMovies />
      </div>
      <div>
        <h3>H3 Tekstiä</h3>
      </div>
    </>
  );
}
