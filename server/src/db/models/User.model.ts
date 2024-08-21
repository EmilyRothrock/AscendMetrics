import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import { TrainingSession } from "./TrainingSession.model"; // Adjust the path as needed
import { Optional } from "sequelize";

export interface UserInterface {
  id: number;
  auth0id: string;
  email: string;
  first: string;
  last?: string;
  trainingSessions: TrainingSession[];
}

interface UserAttributes extends UserInterface {}
interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "last" | "trainingSessions"> {}

@Table({
  timestamps: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  auth0id!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  first!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  last?: string;

  @HasMany(() => TrainingSession)
  trainingSessions!: TrainingSession[];
}
