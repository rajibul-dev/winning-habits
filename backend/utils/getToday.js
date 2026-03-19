import { toZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";
import { getNow } from "./getNow.js";

export function getTodayForUser(timezone) {
  const now = getNow();

  const zoned = toZonedTime(now, timezone);
  const startTimeOfDayZoned = startOfDay(zoned);

  return startTimeOfDayZoned;
}
