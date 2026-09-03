export type Track = {
  date: Date;
  artist: string;
  artist_raw: string;
  title: string;
  owner: string;
  comment?: string | null;
};

export type TrackKey = keyof Track;

export interface Meeting {
  date: string | Date;
  songs: Track[];
  note: string;
}
