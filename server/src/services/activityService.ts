import { Transaction } from "sequelize";
import { Activity } from "../db/models";

export async function fetchActivityByName(
  name: string,
  transaction: Transaction
): Promise<Activity> {
  try {
    const dbActivity = await Activity.findOne({
      where: { name },
      transaction,
    });

    if (!dbActivity) {
      console.error(`Activity with name '${name}' not found`);
      throw new Error(`Activity with name '${name}' not found`);
    }
    return dbActivity;
  } catch (error) {
    console.error("Error fetching activity by name:", error);
    throw error;
  }
}

export async function fetchActivityIdByName(name: string): Promise<number> {
  const [activity] = await Activity.findOrCreate({
    where: { name },
    defaults: { name },
  });
  return activity.id;
}
