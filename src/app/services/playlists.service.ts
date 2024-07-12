import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  id = environment.spotifyClientId
  secret = environment.spotifyClientSecret
  SPOTIFY_URL = "https://api.spotify.com/v1/playlists/"

  sdk: SpotifyApi;
  constructor(private http: HttpClient) {
    this.sdk = SpotifyApi.withClientCredentials(this.id, this.secret)
  }

  getPlaylist(playlistId:string) {
    return this.sdk.playlists.getPlaylist(playlistId)
  }
}
