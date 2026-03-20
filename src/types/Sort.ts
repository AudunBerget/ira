export const SortOrder = {
  NONE: "NONE",
  ASC: "ASC",
  DESC: "DESC"
} as const;

export type SortOrder = typeof SortOrder[keyof typeof SortOrder];
