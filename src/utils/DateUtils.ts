import type { Track } from "./XslxParser.ts";

export function formatDate(
  date: Date | string | number | undefined,
  format: string = "DD-MM-YY"
) {
  if (!date) return "";

  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return "";

  const map: Record<string, string> = {
    DD: String(d.getDate()).padStart(2, "0"),
    MM: String(d.getMonth() + 1).padStart(2, "0"),
    YYYY: String(d.getFullYear()),
    YY: String(d.getFullYear()).slice(-2),
  };

  return format.replace(/YYYY|YY|DD|MM/g, (token) => map[token]);
}

export type MinMaxDate = {
  min: string;
  max: string;
}

export function getMinMaxDate(tracks: Track[]): MinMaxDate {
  if (tracks.length === 0) {
    return { min: '', max: '' }
  }

  const dates = tracks.map((track: Track) => track.date)
  const minDate = Math.min(...dates.map(date => date.getTime()));
  const maxDate = Math.max(...dates.map(date => date.getTime()));

  const dateFormat = "YYYY-MM-DD";
  return { min: formatDate(minDate, dateFormat), max: formatDate(maxDate, dateFormat) }
}

function toLocalDate(dateLike: Date | string | number | undefined): Date | undefined {
  if (dateLike === undefined || dateLike === null) return undefined;
  if (dateLike instanceof Date) return new Date(dateLike.getTime());
  if (typeof dateLike === "number") return new Date(dateLike);

  const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;
  const m = String(dateLike).trim().match(isoDateOnly);
  if (m) {
    const y = Number(m[1]), mo = Number(m[2]) - 1, day = Number(m[3]);
    return new Date(y, mo, day);
  }

  return new Date(String(dateLike));
}

export function startOfDayMs(dateLike: Date | string | number | undefined): number | undefined {
  const d = toLocalDate(dateLike);
  if (!d) return undefined;
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function endOfDayMs(dateLike: Date | string | number | undefined): number | undefined {
  const d = toLocalDate(dateLike);
  if (!d) return undefined;
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function parseDate(
  value: string,
  format: string
): Date | null {
  if (!value || !format) return null;

  const tokenPatterns: Record<string, string> = {
    DD: "(?<day>\\d{2})",
    MM: "(?<month>\\d{2})",
    YYYY: "(?<year>\\d{4})",
    YY: "(?<yearShort>\\d{2})",
  };

  // Escape special regex chars in format except tokens
  let regexString = format;

  Object.keys(tokenPatterns).forEach((token) => {
    regexString = regexString.replace(
      token,
      tokenPatterns[token]
    );
  });

  const regex = new RegExp(`^${regexString}$`);
  const match = value.match(regex);

  if (!match || !match.groups) return null;

  const day = match.groups.day
    ? parseInt(match.groups.day, 10)
    : 1;

  const month = match.groups.month
    ? parseInt(match.groups.month, 10) - 1
    : 0;

  let year = 0;

  if (match.groups.year) {
    year = parseInt(match.groups.year, 10);
  } else if (match.groups.yearShort) {
    const short = parseInt(match.groups.yearShort, 10);
    year = 2000 + short; // adjust logic if needed
  }

  const date = new Date(year, month, day);

  // Validate (prevents 31/02/2026 turning into March 3rd)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}
