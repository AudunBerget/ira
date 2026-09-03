export type Track = {
  date: Date;
  artist: string;
  artistRaw: string;
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
