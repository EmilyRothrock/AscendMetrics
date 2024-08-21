import { BodyPart } from "@shared/types";

export type SeriesByBodyParts = {
  [key in BodyPart]: DateValueDataPoint[];
};

export interface DateValueDataPoint {
  x: Date;
  y: number;
}
