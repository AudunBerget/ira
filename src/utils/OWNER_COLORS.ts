export const OWNER_COLORS: Record<string, string> = {
  'Tor Erik': '#d54040',
  'Øyvind': '#74c658',
  'John': '#4c60c1',
  'Ragnar': '#56c5a9',
  'Espen': '#9c52bf',
  'Einar': '#cf9e38',
}

export const GUEST_COLOR = '#6b7494'

export function ownerColor(name: string): string {
  return OWNER_COLORS[name] ?? GUEST_COLOR
}
