import { TrainingSession } from "@shared/types";
import { TrainingSession as TrainingSessionModel } from "server/src/db/models";
import mapSessionActivityModelToObject from "./mapSessionActivityModelToObject";
import { DateTime } from "luxon";

function mapTrainingSessionModelToObject(
  TSModel: TrainingSessionModel
): TrainingSession {
  const earliestSAStartTime: DateTime = getEarliestSAStartTime(TSModel);
  const formattedDateTime = DateTime.fromISO(TSModel.completedOn)
    .set({ hour: earliestSAStartTime.hour, minute: earliestSAStartTime.minute })
    .toISO();
  return {
    id: TSModel.id,
    completedOn: formattedDateTime,
    name: TSModel.name ?? undefined, // Optional chaining with nullish coalescing
    note: TSModel.note ?? undefined, // Optional chaining with nullish coalescing
    duration: TSModel.duration, // Virtual field
    sessionActivities: TSModel.sessionActivities.map(
      mapSessionActivityModelToObject
    ),
    loads: TSModel.loads, // Virtual field
  };
}

export default mapTrainingSessionModelToObject;

function getEarliestSAStartTime(TSModel: TrainingSessionModel): DateTime {
  const format = "HH:mm:ss";
  let result = DateTime.fromFormat("23:59:59", format);

  TSModel.sessionActivities.forEach((sa) => {
    const startTime = DateTime.fromFormat(sa.startTime, format);
    console.log(startTime);
    if (startTime < result) {
      result = startTime;
    }
  });
  return result;
}
