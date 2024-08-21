import { User as UserModel } from "server/src/db/models";

// Utility function to fetch the user by their auth0id
export async function getUserByAuth0Id(
  auth0id: string
): Promise<UserModel | null> {
  return await UserModel.findOne({ where: { auth0id } });
}
