import BodyPartMetrics from "@shared/types/bodyPartMetrics";

export function calculateLoads(
  durationInHours: number,
  intensities: BodyPartMetrics
) {
  return {
    fingers: durationInHours * intensities.fingers,
    upperBody: durationInHours * intensities.upperBody,
    lowerBody: durationInHours * intensities.lowerBody,
  };
}

export function incrementLoads(
  sessionLoads: BodyPartMetrics,
  loads: BodyPartMetrics
) {
  sessionLoads.fingers += loads.fingers;
  sessionLoads.upperBody += loads.upperBody;
  sessionLoads.lowerBody += loads.lowerBody;
}
