import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";
import { TrainingSession } from "./TrainingSession.model";
import { Activity } from "./Activity.model";
import { Optional } from "sequelize";
import {
  BodyPartMetrics,
  SessionActivity as SessionActivityInterface,
} from "@shared/types";

export interface SessionActivityAttributes
  extends Omit<
    SessionActivityInterface,
    "name" | "intensities" | "loads" | "duration"
  > {
  activityId: number;
  trainingSessionId: number;
  fingerIntensity: number;
  upperIntensity: number;
  lowerIntensity: number;
}
export interface SessionActivityCreationAttributes
  extends Optional<SessionActivityAttributes, "id" | "note"> {}

@Table({
  timestamps: true,
})
export class SessionActivity extends Model<
  SessionActivityAttributes,
  SessionActivityCreationAttributes
> {
  @AllowNull(true)
  @Column(DataType.TEXT)
  note?: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  startTime!: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  endTime!: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  fingerIntensity!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  upperIntensity!: number;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  lowerIntensity!: number;

  @ForeignKey(() => TrainingSession)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  trainingSessionId!: number;

  @BelongsTo(() => TrainingSession)
  trainingSession!: TrainingSession;

  @ForeignKey(() => Activity)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  activityId!: number;

  @BelongsTo(() => Activity)
  activity!: Activity;

  @Column(DataType.VIRTUAL)
  get duration(): number {
    // Helper function to convert time string "HH:MM:SS" to minutes
    const timeToMinutes = (time: string) => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 60 + minutes + seconds / 60;
    };

    const startTimeMinutes = timeToMinutes(this.startTime);
    const endTimeMinutes = timeToMinutes(this.endTime);

    // Calculate duration in minutes
    let duration = endTimeMinutes - startTimeMinutes;

    // Handle cases where endTime is past midnight and startTime is before midnight
    if (duration < 0) {
      duration += 24 * 60; // add 24 hours in minutes
    }

    return duration;
  }

  @Column(DataType.VIRTUAL)
  get intensities(): BodyPartMetrics {
    return {
      fingers: this.getDataValue("fingerIntensity"),
      upperBody: this.getDataValue("upperIntensity"),
      lowerBody: this.getDataValue("lowerIntensity"),
    };
  }
  set intensities(value: BodyPartMetrics) {
    this.setDataValue("fingerIntensity", value.fingers);
    this.setDataValue("upperIntensity", value.upperBody);
    this.setDataValue("lowerIntensity", value.lowerBody);
  }

  @Column(DataType.VIRTUAL)
  get loads(): BodyPartMetrics {
    return {
      fingers: (this.fingerIntensity * this.duration) / 60,
      upperBody: (this.upperIntensity * this.duration) / 60,
      lowerBody: (this.lowerIntensity * this.duration) / 60,
    };
  }
}
