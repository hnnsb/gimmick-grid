import React from "react";
import {Document, Image, Page, StyleSheet, Text, View} from "@react-pdf/renderer";

export interface SongCardProps {
  title: string;
  date: string;
  artists: string;
  url: string;
  qrCodeBase64: any;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 0,
  },
  card: {
    width: "50%",
    height: 149,
    margin: 0,
    border: "1px solid #ccc",
    flexDirection: "row",

  },
  qrCode: {
    width: "50%",
    padding: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  songInfo: {
    width: "50%",
    flex: 1,
    padding: 8,
    textAlign: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  artists: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 20,
    fontStyle: "bold",
    fontWeight: "bold",
  },
  verticalLine: {
    width: 1,
    backgroundColor: "#ccc",
  },
});

function SongCard({
                    title,
                    date,
                    artists,
                    qrCodeBase64,
                  }: Readonly<SongCardProps>) {
  const debug = false;
  const debugCard = false
  return (
    <View wrap={false} debug={debug && debugCard} style={styles.card}>
      <View debug={debug && !debugCard} style={styles.songInfo}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.releaseDate}>{date}</Text>
        <Text style={styles.artists}>{artists}</Text>
      </View>
      <View style={styles.verticalLine}></View>
      <View debug={debug && !debugCard} style={styles.qrCode}>
        <Image src={qrCodeBase64} style={{width: 100}}/>
      </View>
    </View>
  );
}

interface PDFDocumentProps {
  title: string;
  songs: SongCardProps[];
}

export default function PDFDocument({title, songs}: Readonly<PDFDocumentProps>) {
  console.log(songs)
  return (
    <Document creationDate={new Date()} title={title} author={"hitster-generator@gimmick-grid"}>
      <Page size="A4" style={styles.page}>
        {songs.map((song) => (
          <SongCard key={song.url} {...song} />
        ))}
      </Page>
    </Document>
  );
};

