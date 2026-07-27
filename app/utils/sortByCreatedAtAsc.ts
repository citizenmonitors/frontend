type DateValue = string | number | Date | undefined | null;

function toTimestamp(value: DateValue): number {
  if (!value) return Number.NaN;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? Number.NaN : t;
}

/**
 * Sorts by created time ascending (oldest first).
 *
 * Usage:
 *   sortByCreatedAtAsc(items) // uses item.createdAt || item.timeCreated
 *   sortByCreatedAtAsc(items, (x) => x.timeCreated)
 */
export default function sortByCreatedAtAsc<T>(
  items: T[],
  getCreatedAt?: (item: T) => DateValue
): T[] {
  const getFallbackDate = (item: T): DateValue => {
    const anyItem = item as any;
    return anyItem?.createdAt ?? anyItem?.timeCreated ?? anyItem?.created;
  };

  const getter = getCreatedAt ?? getFallbackDate;

  return [...items].sort((a, b) => {
    const at = toTimestamp(getter(a));
    const bt = toTimestamp(getter(b));

    // Put invalid dates last.
    if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
    if (Number.isNaN(at)) return 1;
    if (Number.isNaN(bt)) return -1;

    return at - bt;
  });
}

