export type PortfolioTrack = {
  slug: string;
  title: string;
  role: "Mixing" | "Mastering" | "Production";
  artist: string;
  audioUrl: string;
};

export const portfolioTracks: PortfolioTrack[] = [
  {
    slug: "sample-mix-01",
    title: "Placeholder Track One",
    role: "Mixing",
    artist: "Placeholder Artist",
    audioUrl: "/audio/sample-mix-01.wav",
  },
  {
    slug: "sample-master-02",
    title: "Placeholder Track Two",
    role: "Mastering",
    artist: "Placeholder Artist",
    audioUrl: "/audio/sample-master-02.wav",
  },
  {
    slug: "sample-master-03",
    title: "Placeholder Track Three",
    role: "Production",
    artist: "Placeholder Artist",
    audioUrl: "/audio/sample-master-03.wav",
  },
];
