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
  fingersIntensity: number;
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
    const startTime = new Date(this.startTime).getTime();
    const endTime = new Date(this.endTime).getTime();
    return (endTime - startTime) / 60000; // convert milliseconds to minutes
  }

  @Column(DataType.VIRTUAL)
  get intensities(): BodyPartMetrics {
    return {
      fingers: this.fingerIntensity,
      upperBody: this.upperIntensity,
      lowerBody: this.lowerIntensity,
    };
  }
  set intensities(value: BodyPartMetrics) {
    this.fingerIntensity = value.fingers;
    this.upperIntensity = value.upperBody;
    this.lowerIntensity = value.lowerBody;
  }

  @Column(DataType.VIRTUAL)
  get loads(): BodyPartMetrics {
    return {
      fingers: this.fingerIntensity * this.duration,
      upperBody: this.upperIntensity * this.duration,
      lowerBody: this.lowerIntensity * this.duration,
    };
  }
}
