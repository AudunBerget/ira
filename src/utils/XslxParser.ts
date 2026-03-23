import * as XLSX from "xlsx";

export type Track = {
  date: Date;
  artist: string;
  title: string;
  owner: string;
  comment?: string | null;
};

export type TrackKey = keyof Track;

function parseExcelDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    if (!d) return null;
    return new Date(d.y, d.m - 1, d.d);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    // Match D/M/YY, DD/MM/YYYY, etc.
    const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
    if (match) {
      const [, monthStr, dayStr, yearStr] = match;
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

  return {
    date,
    artist: String(artist).trim(),
    title: String(title).trim(),
    owner: String(owner ?? "").trim(),
    comment: comment ? String(comment).trim() : null,
  };
}

export async function parseSongs(
  fileName: string,
  sheetName: string,
): Promise<Track[]> {

  const uri = import.meta.env.BASE_URL + fileName;
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, {
    type: "array",
    cellDates: true,
    dense: true,
  });

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

  return allSongs;
}
