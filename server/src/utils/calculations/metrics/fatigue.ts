import BodyPartMetrics from "@shared/types/bodyPartMetrics";
import { DateTime } from "luxon";

export function incrementFatigues(
  fatigues: {
    [date: string]: BodyPartMetrics;
  },
  date: string,
  intensities: BodyPartMetrics,
  durationInHours: number
) {
  for (let daysLater = 1; daysLater <= 14; daysLater++) {
    const fatigueDate = DateTime.fromISO(date);

    if (fatigueDate.isValid) {
      const fatigueDateString = fatigueDate
        .plus({ days: daysLater })
        .toISODate();

      if (!fatigues[fatigueDateString]) {
        fatigues[fatigueDateString] = {
          fingers: 0,
          upperBody: 0,
          lowerBody: 0,
        };
      }
      fatigues[fatigueDateString].fingers += fatigue(
        intensities.fingers,
        durationInHours,
        daysLater
      );
      fatigues[fatigueDateString].upperBody += fatigue(
        intensities.upperBody,
        durationInHours,
        daysLater
      );
      fatigues[fatigueDateString].lowerBody += fatigue(
        intensities.lowerBody,
        durationInHours,
        daysLater
      );
    }
  }
}

function fatigue(
  intensity: number,
  durationInHours: number,
  daysLater: number
) {
  const decayFactor = 0.1;
  const daysToRecovery = Math.pow(5, intensity / 9) - 1;
  return (
    intensity *
    durationInHours *
    Math.pow(decayFactor, daysLater / daysToRecovery)
  );
}
