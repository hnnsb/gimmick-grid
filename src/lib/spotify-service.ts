type TrackObjectFull = SpotifyApi.TrackObjectFull;

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export const getSpotifyToken = async (clientId: string, clientSecret: string) => {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get Spotify token");
  }

  const data = await response.json();
  return data.access_token;
};

export const getPlaylistTracks = async (token: string, playlistId: string): Promise<{
  title: string,
  tracks: TrackObjectFull[]
}> => {

  const playlistResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!playlistResponse.ok) {
    throw new Error("Failed to fetch playlist data");
  }

  const playlist: SpotifyApi.PlaylistObjectFull = await playlistResponse.json();
  const tracks: TrackObjectFull[] = playlist.tracks.items.map((item: {
    track: any;
  }) => item.track);
  const trackIds = tracks.map((track) => track.id).filter(Boolean).join(",");
  const tracksResponse = await fetch(
    `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const fullTracks: SpotifyApi.MultipleTracksResponse = await tracksResponse.json();
  return {
    title: playlist.name,
    tracks: fullTracks.tracks
  }
};
