import api from "./api";

export const checkAuthentication = async (): Promise<boolean> => {
  try {
    const response = await api.get("/auth/check");
    return response.data; // Assume response.data directly gives a boolean for authentication status
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false; // Assume not authenticated if there's an error
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/signin", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error during signin:", error);
    throw (
      error.response?.data?.message ||
      "An unexpected error occurred. Please try again later."
    );
  }
};

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.post("/auth/signup", {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw (
      error.response?.data?.message ||
      "An unexpected error occurred. Please try again later."
    );
  }
};

export const signout = async () => {
  try {
    await api.post("/auth/signout");
  } catch (error) {
    console.error("Error during signout:", error);
    throw error;
  }
};
