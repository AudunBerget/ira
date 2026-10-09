import * as XLSX from 'xlsx';
import type { Track } from '../types.ts';
import { formatDateKey } from './DateUtils.ts';

// TODO fikse artist string presentasjon ved forskjellige varianter som "feat." "Nesbø, Jo", etc.

function toDisplayArtist(raw: string): string {
  if (!raw.includes('&') || !raw.includes('feat.') || !raw.includes('feat')) {
    const parts = raw.split(',')
    if (parts.length !== 2) return raw.trim()
    const [main, prefix] = parts.map((p) => p.trim())
    return `${prefix} ${main}`
  }
  return raw
}

function parseExcelDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number') {
    const d = XLSX.SSF.parse_date_code(value);
    if (!d) return null;
    return new Date(d.y, d.m - 1, d.d);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    // Match DD/MM/YY, DD/MM/YYYY, etc.
    const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
    if (match) {
      // const [, monthStr, dayStr, yearStr] = match;
      const [, dayStr, monthStr, yearStr] = match;
      const day = Number(dayStr);
      const month = Number(monthStr);
      const year =
        yearStr.length === 2
          ? 2000 + Number(yearStr) // adjust if you want a different cutoff
          : Number(yearStr);

      const parsed = new Date(year, month - 1, day);

      // Validate to avoid rollover like 31/02/2024 -> Mar 2
      if (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      ) {
        return parsed;
      }

      return null;
    }

    // Fallback for ISO-like strings
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function mapRow(row: unknown[]): Track | null {
  const [dateRaw, artist, title, owner, comment] = row.slice(0, 5);

  const date = parseExcelDate(dateRaw);

  if (!date || !artist || !title) {
    return null;
  }
  const artistRaw = String(artist).trim();

  return {
    date,
    artist: toDisplayArtist(artistRaw),
    artistRaw: artistRaw,
    title: String(title).trim(),
    owner: String(owner ?? '').trim(),
    comment: comment ? String(comment).trim() : null
  };
}

// Prints a specified sheet from a workbook
// @ts-expect-error unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printSheet(workbook: XLSX.WorkBook, sheetName: string, tableLog: boolean = true): void {
  const ws = workbook.Sheets[sheetName];
  if (!ws) {
    console.error(`Sheet "${sheetName}" not found. Available:`, workbook.SheetNames);
    return;
  }
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  if (tableLog) { console.table(rows) } else console.log(rows);
}



// Counts how many character positions differ between two equal-length strings
function hammingDistance(a: string, b: string): number {
  if (a.length !== b.length) return Infinity;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff;
}

// Parses the schedule sheet into a map of member → set of known meeting date keys.
// Skips header/number rows by checking if column 0 is a non-empty member name.
export function parseSchedule(ws: XLSX.WorkSheet): Set<string> {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: null,
    blankrows: false,
  });

  const dates = new Set<string>();

  for (const row of rows) {
    const firstCell = row[0];
    if (typeof firstCell !== 'string' || !firstCell.trim()) continue;
    const name = firstCell.trim();
    if (name.toLowerCase().includes('dato') || name.toLowerCase().includes('vertskap')) continue;

    for (let i = 1; i < row.length; i++) {
      const date = parseExcelDate(row[i]);
      if (date) dates.add(formatDateKey(date));
    }
  }

  return dates;
}

const manualCorrections: Record<string, string> = {
  '12/09/2012': '22/09/2012', // Tor Erik — one digit off
  '20/08/2021': '28/08/2021', // John & Tor Erik — one digit off
  '28/01/2019': '25/01/2019', // Einar — one digit off
  '29/01/2022': '28/01/2022', // Espen — one digit off
  '28/08/2025': '23/08/2025', // Einar — manually resolved (ambiguous)
  '29/05/2025': '29/05/2026', // Ragnar — manually resolved (no match)
  '22/09/2026': '22/09/2012', // Einar — manually resolved (no match)
};

// For each track, checks if its date exists in the member's known schedule dates.
// If not, looks for a known date that's one digit off — corrects if unambiguous.
function correctDateErrors(tracks: Track[], knownDates: Set<string>): Track[] {
  // Group tracks by date to work at meeting level
  const groups = new Map<string, Track[]>();
  for (const track of tracks) {
    const key = formatDateKey(track.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(track);
  }


  const corrections = new Map<string, string>(); // wrong date key → correct date key

  for (const [dateKey, meetingTracks] of groups) {
    if (knownDates.has(dateKey)) continue; // already a known meeting date

    // Manual override takes priority
    if (manualCorrections[dateKey]) {
      corrections.set(dateKey, manualCorrections[dateKey]);
      continue;
    }

    const year = dateKey.slice(-4);
    const candidates = [...knownDates].filter(
      (known) => known.endsWith(year) && hammingDistance(dateKey, known) === 1,
    );

    if (candidates.length === 1) {
      corrections.set(dateKey, candidates[0]);
    } else if (candidates.length === 0) {
      console.warn(
        `[date-correction] "${dateKey}" (${meetingTracks.length} tracks) is not a known meeting — no one-digit match found`,
      );
    } else {
      console.warn(
        `[date-correction] "${dateKey}" (${meetingTracks.length} tracks) is not a known meeting — ambiguous: ${candidates.join(', ')}`,
      );
    }
  }

  if (corrections.size === 0) return tracks;

  return tracks.map((track) => {
    const targetKey = corrections.get(formatDateKey(track.date));
    if (!targetKey) return track;
    const [d, m, y] = targetKey.split('/').map(Number);
    return { ...track, date: new Date(y, m - 1, d) };
  });
}

export async function parseSongs(
  fileName: string,
  sheetName: string,
  scheduleSheetName: string,
): Promise<Track[]> {
  const uri = import.meta.env.BASE_URL + fileName;
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellDates: true,
    dense: true,
  });

  const scheduleWs = workbook.Sheets[scheduleSheetName];
  if (!scheduleWs) throw new Error(`Schedule sheet "${scheduleSheetName}" not found`);
  const schedule = parseSchedule(scheduleWs);

  const allSongs: Track[] = [];

  const ws = workbook.Sheets[sheetName];
  if (!ws) {
    throw new Error(`Sheet ${sheetName} not found`);
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: null,
    raw: false,
    blankrows: false,
  });

  for (const row of rows) {
    const mapped = mapRow(row);
    if (mapped) {
      allSongs.push(mapped);
    }
  }

  return correctDateErrors(allSongs, schedule);
}
