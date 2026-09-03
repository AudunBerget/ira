import { Header } from "./pages/Header.tsx";
import Stats from "./pages/Stats.tsx";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Songs from "./pages/Songs.tsx";
import { parseSongs } from "./utils/XslxParser.ts";
import Meets from "./pages/Meets.tsx";
import type { Track } from "./types.ts";

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTracks(): Promise<Track[]> {
      return await parseSongs("IRAcomplete.xls", "Komplett spilleliste");
    }

    fetchTracks().then((tracks: Track[]) => {
      setIsLoading(false);
      setTracks(tracks);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route path={""} element={<Stats data={tracks} topN={20} />} />
        <Route path="omoss" />
        <Route path="moter" element={<Meets tracks={tracks} />} />
        <Route path="spor" element={<Songs data={tracks} />} />
        {/*<Route path='stats' element={} />*/}
      </Route>
    </Routes>
  );
}

export default App;
