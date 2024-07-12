import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PlaylistsService} from "../../services/playlists.service";
import {Playlist} from "@spotify/web-api-ts-sdk";
import {PdfGeneratorService} from "../../services/pdf-generator.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-song-cards',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './song-cards.component.html',
  styleUrl: './song-cards.component.scss'
})
export class SongCardsComponent {
  playlistId: string = "";

  constructor(private playlistsService: PlaylistsService, private pdfGenerator: PdfGeneratorService) {
  }

  getPlaylist() {
    this.playlistsService.getPlaylist(this.playlistId).then((playlist:Playlist) => {
      this.pdfGenerator.generatePdf(playlist.tracks.items).then()

      }
    )
  }
}
