import {Injectable} from '@angular/core';
import {PlaylistedTrack, TrackItem} from '@spotify/web-api-ts-sdk';
import jsPDF from "jspdf";
import QRCode from "qrcode";

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  async generatePdf(songs: PlaylistedTrack[]) {
    const pdf = new jsPDF();
    const margin = 10;
    const cardWidth = 90;
    const cardHeight = 60;
    const qrSize = 50;
    let xOffset = margin;
    let yOffset = margin;

    for (const song of songs) {
      const track = song.track;
      if (yOffset + cardHeight > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        xOffset = margin;
        yOffset = margin;
      }
      // Generate QR Code
      let qrCodeDataURL = await QRCode.toDataURL(track.external_urls.spotify, {width: qrSize});
      // Draw QR Code
      pdf.setDrawColor(0);
      pdf.setFillColor("255");
      pdf.rect(xOffset, yOffset, cardWidth, cardHeight, 'FD');
      pdf.addImage(qrCodeDataURL, 'PNG', xOffset + 5, yOffset + (cardHeight - qrSize) / 2, qrSize, qrSize);

      // Song Info
      const infoX = xOffset + qrSize + 10;
      let infoY = yOffset + 10;

      pdf.setFontSize(10);
      pdf.text(track.name, infoX, infoY);

      pdf.setFontSize(20);
      infoY += 10;
      if ("album" in track) {
        pdf.text(track.album.release_date, infoX, infoY);
      }

      pdf.setFontSize(10);
      infoY += 20;
      if ("artists" in track) {
        pdf.text(track.artists[0].name, infoX, infoY);
      }

      xOffset += cardWidth + 10;
      if (xOffset + cardWidth > pdf.internal.pageSize.getWidth() - margin) {
        xOffset = margin;
        yOffset += cardHeight + 10;
      }
    }

    pdf.save('songs.pdf');
  }
}
