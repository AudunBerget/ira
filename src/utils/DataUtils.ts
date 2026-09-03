import type { Track } from '../types.ts';
import { formatDateKey } from './DateUtils.ts';

export function groupSongsByDate(tracks: Track[], dateDivider = '.'): Map<string, Track[]> {
  const groups = new Map<string, Track[]>();

  for (const track of tracks) {
    const key = formatDateKey(track.date, dateDivider);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(track);
  }

  // Sort by date ascending
  return new Map(
    [...groups.entries()].sort(
      ([, a], [, b]) => a[0].date.getTime() - b[0].date.getTime(),
    ),
  );
}
