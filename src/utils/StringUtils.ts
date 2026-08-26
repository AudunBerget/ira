declare global {
  interface String {
    reverse(): string;
  }
}


// Only works for bands, make it work for artists such as "Young, Neil" to "Neil Young", but
// not for "Young, Neil & The Band"

// Cases found:
// surname, firstName feat.firstName surname (eg. Chieftains, The feat.Mick Jagger)
// identical as over but with space between feat. and artist (eg. Charles, Ray feat. James Taylor)
// surname, firstName & other artist (eg. Stephenson, Martin & the Daintees)
// surname, firstName - other artist (eg. Page, Jimmy - David Coverdale)
// surname, firstName and other artist (eg. Young, Neil and Stephen Stills)

// Duplicates found:
// Arctic Monkeys AND The Arctic Monkeys (Correct to: Arctic Monkeys)

export function normalizeTheArtist(name: string): string {
  if (!name) return name;

  // do featuring check
  const featMatch = name.match(/\b(?:feat\.?|featuring)\b/i);
  let mainName = name.trim()
  let featSuffix = "";

  if (featMatch?.index !== undefined) {
    mainName = name.slice(0, featMatch.index).trim();
    featSuffix = name.slice(featMatch.index).trim()
  }

  const parts = mainName.split(",").map(p => p.trim());

  // Only transform if exactly two parts and if the second part is "THE" (case-insensitive)
  let normalizedMain = mainName;
  if (parts.length === 2 && parts[1].trim().toUpperCase() === 'THE') {
    normalizedMain = `${parts[1]} ${parts[0]}`;
  // } else if (parts.length === 2) {
    // normalizedMain = `${parts[1]} ${parts[0]}`;
  // }
  // } else if (parts.length === 2) {
  //   return `${parts[1]} ${parts[0]}`;
  }

  return featSuffix ? `${normalizedMain} ${featSuffix}`.trim() : normalizedMain;
}

String.prototype.reverse = function (): string {
  return this.split('').reverse().join('');
}
