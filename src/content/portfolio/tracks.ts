export type PortfolioTrack = {
  slug: string;
  title: string;
  role: "Mixing" | "Mastering" | "Production";
  artist: string;
  audioUrl: string;
};

/**
 * Real client work only. The Music page shows this section
 * only when this has entries (see app/music/page.tsx), so no placeholder
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
