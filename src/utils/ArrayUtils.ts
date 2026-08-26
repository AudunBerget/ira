import {formatDate} from "./DateUtils.ts";

export function groupBy<T, K extends keyof T>(array: T[], key: K, format?: string): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const group = format ? formatDate(String(item[key]), format) : String(item[key]);
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    },
    Object.create(null) as Record<string, T[]>,
  );
}
