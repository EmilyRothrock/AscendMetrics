import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  BelongsTo,
  HasMany,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./User.model";
import { SessionActivity } from "./SessionActivity.model";
import { DataTypes, NonAttribute, Optional } from "sequelize";
import {
  BodyPartMetrics,
  TrainingSession as TrainingSessionInterface,
} from "@shared/types";

export interface TrainingSessionAttributes
  extends Omit<
    TrainingSessionInterface,
    "sessionActivities" | "loads" | "duration"
  > {
  userId: number;
}

export interface TrainingSessionCreationAttributes
  extends Optional<TrainingSessionAttributes, "id" | "note" | "name"> {}

@Table({
  timestamps: true,
})
export class TrainingSession extends Model<
  TrainingSessionAttributes,
  TrainingSessionCreationAttributes
> {
  @AllowNull(false)
  @Column(DataType.DATEONLY)
  completedOn!: string; // DATEONLY is stored in 'YYYY-MM-DD' format

  @AllowNull(true)
  @Column(DataType.TEXT("tiny"))
  name?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  note?: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => SessionActivity)
  sessionActivities!: SessionActivity[];

  @Column(DataType.VIRTUAL)
  get duration(): number {
    const sessionActivities = this.sessionActivities || [];
    const startTimes = sessionActivities.map(
      (sessionActivity: SessionActivity) =>
        new Date(`1970-01-01T${sessionActivity.startTime}`)
    );
    const endTimes = sessionActivities.map(
      (sessionActivity: SessionActivity) =>
        new Date(`1970-01-01T${sessionActivity.endTime}`)
    );

    if (startTimes.length === 0 || endTimes.length === 0) {
      return 0;
    }

    const earliestStartTime = Math.min(
      ...startTimes.map((time: Date) => time.getTime())
    );
    const latestEndTime = Math.max(
      ...endTimes.map((time: Date) => time.getTime())
    );

    return (latestEndTime - earliestStartTime) / (1000 * 60 * 60); // convert milliseconds to hours
  }

  @Column(DataType.VIRTUAL)
  get loads(): NonAttribute<
    Record<"fingers" | "upperBody" | "lowerBody", number>
  > {
    const sessionActivities = this.sessionActivities || [];
    return sessionActivities.reduce(
      (acc: BodyPartMetrics, sessionActivity: SessionActivity) => {
        const loads = sessionActivity.loads || {
          fingers: 0,
          upperBody: 0,
          lowerBody: 0,
        };
        acc.fingers += loads.fingers;
        acc.upperBody += loads.upperBody;
        acc.lowerBody += loads.lowerBody;
        return acc;
      },
      { fingers: 0, upperBody: 0, lowerBody: 0 }
    );
  }
}
