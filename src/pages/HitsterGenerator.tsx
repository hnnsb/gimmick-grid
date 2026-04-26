import { FormEvent, useState } from "react";
import { getPlaylistTracks, getSpotifyToken } from "../lib/spotify-service";
import { PDFViewer } from "@react-pdf/renderer";
import PDFDocument, {
  SongCardProps,
} from "../components/hitster-generator/PDFDocument";
import Button from "../components/common/Button";
import { generateQRCodeDataUrl } from "../lib/qrcode-utils";
import Tabs from "../components/common/tabs/Tabs";
import Tab from "../components/common/tabs/Tab";

export default function HitsterGenerator() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");
  const [title, setTitle] = useState("");
  const [songs, setSongs] = useState<SongCardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getSpotifyToken(clientId.trim(), clientSecret.trim());
      const { title, tracks } = await getPlaylistTracks(
        token,
        playlistLink.split("/").pop() ?? "",
      );
      setTitle(title);

      const songs = tracks
        .map(
          (track) =>
            ({
              title: track.name,
              date: track.album.release_date.slice(0, 4),
              artists: track.artists
                .map((artist: any) => artist.name)
                .join(", "),
              url: track.external_urls.spotify,
              qrCodeBase64: generateQRCodeDataUrl(track.external_urls.spotify),
            }) as SongCardProps,
        )
        .sort((a, b) => Number(a.date) - Number(b.date));

      setSongs(songs);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  const data = songs
    .map((s) => s.date)
    .reduce((acc, val) => {
      const currentCount = acc.get(val);
      if (currentCount === undefined) {
        acc.set(val, 1);
      } else {
        acc.set(val, currentCount + 1);
      }
      return acc;
    }, new Map<string, number>());

  return (
    <div className={"container"}>
      <h1>Hitster-Generator</h1>
      <p>Generate your own Hitster cards from a spotify playlist</p>
      <form
        id={"spotifyPlaylistForm"}
        className="flex flex-col p-2 gap-2 items-center shadow-card"
        autoComplete={"on"}
        onSubmit={async (e) => await fetchSongs(e)}
      >
        <label htmlFor="clientId">Spotify Client Id</label>
        <input
          autoComplete={"username"}
          id={"clientId"}
          className={"p-2 w-56"}
          type="text"
          placeholder="Enter Spotify API Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <label htmlFor="clientSecret">Spotify Client Secret</label>
        <input
          autoComplete={"current-password"}
          id={"clientSecret"}
          className={"p-2 w-56"}
          type="password"
          placeholder="Enter Spotify API Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
        />
        <label htmlFor="playlistLink">Link to a spotify public playlist</label>
        <input
          autoComplete={"on"}
          id={"playlistLink"}
          className={"p-2 w-1/2"}
          type="text"
          placeholder="Enter Spotify Playlist Link"
          value={playlistLink}
          onChange={(e) => setPlaylistLink(e.target.value)}
        />
        <Button
          disabled={loading || !playlistLink || !(clientId && clientSecret)}
        >
          <input
            id={"generatePdfButton"}
            type={"submit"}
            className={"bg-transparent border-none text-white"}
            value={loading ? "Loading..." : "Fetch Songs"}
          />
        </Button>
      </form>

      {songs.length > 0 && (
        <Tabs>
          <Tab label="Decade View">
            <HistogramByDecade data={data} />
          </Tab>
          <Tab label="Year View">
            <HistogramByYear data={data} />
          </Tab>
        </Tabs>
      )}

      {songs.length > 0 && (
        <div className="flex flex-col">
          <PDFViewer height="1000" className={"p-0 m-0 shadow-card"}>
            <PDFDocument title={title} songs={songs} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}

function HistogramByDecade({ data }: { data: Map<string, number> }) {
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);

  const grouped = Array.from(data.entries()).reduce(
    (acc, [year, count]) => {
      const decade = Math.floor(Number(year) / 10) * 10;
      const currentCount = acc.get(decade) || 0;
      acc.set(decade, currentCount + count);
      return acc;
    },
    new Map<number, number>(
      Array.from(Array(13).keys())
        .map((v) => 1900 + v * 10)
        .map((v) => [v, 0]),
    ),
  );

  const maxCountForDecades = Math.max(...Array.from(grouped.values()));
  const maxCountForYears = Math.max(...Array.from(grouped.values()));

  return (
    <div className="flex flex-row align-bottom items-end gap-2 justify-center shadow-card overflow-x-auto p-4">
      {Array.from(grouped.entries()).map(([decade, count], index) => {
        return (
          <div key={index} className="flex flex-col items-center">
            <span className="">{count}</span>
            <div
              style={{
                cursor: "pointer",
                backgroundColor: "#000000",
                width: "20px",
                height: (count / maxCountForDecades) * 200,
              }}
              onClick={() => setSelectedDecade(decade)}
            ></div>
            <span>{decade}s</span>
          </div>
        );
      })}

      {selectedDecade !== null && (
        <div className="relative top-0 left-0 p-2 bg-white shadow-card h-50">
          <h3 className="my-1">
            {selectedDecade}s: {grouped.get(selectedDecade)} songs
          </h3>
          <Button
            variant="secondary"
            className="absolute top-2 right-2 p-1"
            onClick={() => setSelectedDecade(null)}
          >
            X
          </Button>
          <div className="flex flex-row align-bottom items-end gap-2 justify-center">
            {Array.from(Array(10).keys())
              .map((v) => selectedDecade + v)
              .map((year) => (
                <div key={year} className="flex flex-col items-center">
                  <div
                    style={{
                      backgroundColor: "#000000",
                      width: "20px",
                      height:
                        (data.get(year.toString()) / maxCountForYears) * 180,
                    }}
                  ></div>
                  <span className="">{year % 100}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HistogramByYear({ data }: { data: Map<string, number> }) {
  const maxCount = Math.max(...Array.from(data.values()));
  const startYear = Math.min(...Array.from(data.keys()).map((k) => Number(k)));
  const endYear = Math.max(...Array.from(data.keys()).map((k) => Number(k)));

  const allYearsData = [];
  for (let year = startYear; year <= endYear; year++) {
    allYearsData.push([year, data.get(year.toString()) || 0]);
  }

  return (
    <div className="flex flex-row align-bottom items-end gap-0.1 justify-center shadow-card overflow-x-auto p-4">
      {allYearsData.map(([year, count], index) => {
        return (
          <div key={index} className="flex flex-col items-center">
            <div
              title={`${year}: ${count} song${count === 1 ? "" : "s"}`}
              style={{
                backgroundColor: "#000000",
                width: "7px",
                height: (count / maxCount) * 200,
              }}
            ></div>
            <span
              style={{
                fontSize: "0.8rem",
                minHeight: "1.1rem",
                width: "7px",
                paddingLeft: "1px",
                textAlign: "center",
                margin: "auto",
                borderLeft: year % 5 === 0 ? "1px solid " : "none",
              }}
            >
              {year % 5 === 0 ? `${year}` : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
