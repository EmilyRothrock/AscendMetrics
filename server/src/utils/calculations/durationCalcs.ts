import { DateTime } from "luxon";

export function calculateDurationInMinutes(startTime: string, endTime: string) {
  // Assuming the same date for both times since only times are provided
  const dateContext = "2024-01-01"; // Use any arbitrary date

  const start = DateTime.fromISO(`${dateContext}T${startTime}`);
  let end = DateTime.fromISO(`${dateContext}T${endTime}`);

  // Handling cases where endTime might be on the next day (cross midnight scenario)
  if (end < start) {
    end = end.plus({ days: 1 });
  }

  return end.diff(start, "minutes").minutes;
}
