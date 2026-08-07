export type PortfolioTrack = {
  slug: string;
  title: string;
  role: "Mixing" | "Mastering" | "Production";
  artist: string;
  audioUrl: string;
};

/**
 * Real portfolio tracks only. The portfolio page shows an honest "coming soon"
 * state while this is empty (see app/portfolio/page.tsx), so no placeholder
 * audio ever ships. Add real mixes/masters here (with permission to publish).
 */
export const portfolioTracks: PortfolioTrack[] = [];

/* Template for a new entry — copy into the array above:
  {
    slug: "artist-song-title",
    title: "Song Title",
    role: "Mixing",
    artist: "Artist Name",
    audioUrl: "/audio/artist-song-title.wav",
  },
*/
