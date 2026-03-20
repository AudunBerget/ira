

// Only works for bands, make it work for artists such as "Young, Neil" to "Neil Young", but
// not for "Young, Neil & The Band"
export function normalizeTheArtist(name: string): string {
  if (!name) return name;

  const parts = name.split(",").map(p => p.trim());

  // Only transform if exactly two parts and if the second part is "THE" (case-insensitive)
  if (parts.length === 2 && parts[1].trim().toUpperCase() === 'THE') {
    return `${parts[1]} ${parts[0]}`;
  }

  return name;
}
