/** Minutes since midnight now in the store's time zone (Istanbul), whatever the visitor's own zone is. */
export function minutesNow(timeZone = "Europe/Istanbul"): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

/** "10:00–21:00" → open now? The first time range wins; overnight ranges (18:00–02:00) work. null = no range. */
export function isOpenNow(hours?: string, now = minutesNow()): boolean | null {
  const m = hours?.match(/(\d{1,2})[:.](\d{2})\s*[–—-]\s*(\d{1,2})[:.](\d{2})/);
  if (!m) return null;
  const open = +m[1] * 60 + +m[2];
  const close = +m[3] * 60 + +m[4];
  return close > open ? now >= open && now < close : now >= open || now < close;
}
