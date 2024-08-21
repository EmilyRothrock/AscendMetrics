import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  AllowNull,
  Unique,
} from "sequelize-typescript";
import { SessionActivity } from "./SessionActivity.model"; // Adjust the import path as necessary
import { Optional } from "sequelize";

interface ActivityInterface {
  id: number;
  name: string;
  description?: string;
}
interface ActivityAttributes extends ActivityInterface {}
interface ActivityCreationAttributes
  extends Optional<ActivityAttributes, "id" | "description"> {}

@Table({
  timestamps: true,
})
export class Activity extends Model<
  ActivityAttributes,
  ActivityCreationAttributes
> {
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  name!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @HasMany(() => SessionActivity)
  sessionActivities!: SessionActivity[];
}
