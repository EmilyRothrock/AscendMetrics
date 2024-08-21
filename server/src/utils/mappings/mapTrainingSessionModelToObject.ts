import { TrainingSession } from "@shared/types";
import { TrainingSession as TrainingSessionModel } from "server/src/db/models";
import mapSessionActivityModelToObject from "./mapSessionActivityModelToObject";

function mapTrainingSessionModelToObject(
  TSModel: TrainingSessionModel
): TrainingSession {
  return {
    id: TSModel.id,
    completedOn: TSModel.completedOn,
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
