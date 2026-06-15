import { Login } from "../interfaces/auth";
import { User, UserProfile } from "../interfaces/interface";
import { api } from "./api";

export const authService = {
  login: async (request: Login): Promise<UserProfile | null> => {
    const users = await api.get<User[]>(
      `/users?user=${request.user}&password=${request.password}`,
    );

    if (users.length === 0) {
      return null;
    }

    const { user, password, ...authenticatedUser } = users[0];

    return authenticatedUser;
  },
};
