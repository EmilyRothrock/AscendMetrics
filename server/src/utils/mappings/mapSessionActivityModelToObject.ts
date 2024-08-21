import { SessionActivity } from "@shared/types";
import { SessionActivity as SessionActivityModel } from "server/src/db/models";

function mapSessionActivityModelToObject(
  SAModel: SessionActivityModel
): SessionActivity {
  return {
    id: SAModel.id,
    name: SAModel.activity.name, // Access the associated Activity name
    startTime: SAModel.startTime,
    endTime: SAModel.endTime,
    note: SAModel.note || undefined,
    duration: SAModel.duration, // Virtual field
    intensities: SAModel.intensities, // Virtual field
    loads: SAModel.loads, // Virtual field
  };
}

export default mapSessionActivityModelToObject;
