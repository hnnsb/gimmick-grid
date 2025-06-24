import {FormEvent, useState} from "react";
import {getPlaylistTracks, getSpotifyToken} from "../lib/spotify-service";
import {PDFViewer} from "@react-pdf/renderer";
import PDFDocument, {SongCardProps} from "../components/hitster-generator/PDFDocument";
import Button from "../components/common/Button";
import {generateQRCodeDataUrl} from "../lib/qrcode-utils";

export default function HitsterGenerator() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");
  const [title, setTitle] = useState("");
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await getSpotifyToken(clientId.trim(), clientSecret.trim());
      const {title, tracks} = await getPlaylistTracks(token, playlistLink.split("/").pop() ?? "");
      setTitle(title);

      const songs = tracks.map((track) => ({
        title: track.name,
        date: track.album.release_date.slice(0, 4),
        artists: track.artists.map((artist: any) => artist.name).join(", "),
        url: track.external_urls.spotify,
        qrCodeBase64: generateQRCodeDataUrl(track.external_urls.spotify),
      } as SongCardProps));

      setSongs(songs);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"container"}>
      <h1>Hitster-Generator</h1>
      <p>Generate your own Hitster cards from a spotify playlist</p>
      <form id={"spotifyPlaylistForm"} className="flex flex-col p-2 gap-2 items-center shadow-card"
            autoComplete={"on"}
            onSubmit={async (e) => await fetchSongs(e)}>
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
        <Button disabled={loading || !playlistLink || !(clientId && clientSecret)}>
          <input id={"generatePdfButton"} type={"submit"}
                 className={"bg-transparent border-none text-white"}
                 value={loading ? "Loading..." : "Fetch Songs"}
          />
        </Button>
      </form>

      {songs.length > 0 && (
        <div className="flex flex-col">
          <PDFViewer height="1000" className={"p-0 m-0 shadow-card"}>
            <PDFDocument title={title} songs={songs}/>
          </PDFViewer>
        </div>
      )}
    </div>
  );
}
