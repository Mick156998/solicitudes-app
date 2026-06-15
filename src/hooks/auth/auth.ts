"use client";

import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/route";
import { UserProfile } from "@/interfaces/interface";
import { authService } from "@/services/auth.service";
import { Role } from "@/types/types";

export const useAuth = () => {
  const router = useRouter();

  const login = async (
    user: string,
    password: string,
  ): Promise<UserProfile> => {
    const authenticatedUser = await authService.login({
      user,
      password,
    });

    if (!authenticatedUser) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    localStorage.setItem("user", JSON.stringify(authenticatedUser));

    if (authenticatedUser.role === "Administrador") {
      router.push(ROUTES.DASHBOARD);
    } else {
      router.push(ROUTES.REQUESTS);
    }

    return authenticatedUser;
  };

  const logout = (): void => {
    localStorage.removeItem("user");
    router.replace(ROUTES.LOGIN);
  };

  const getCurrentUser = (): UserProfile | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const user = localStorage.getItem("user");

    return user ? (JSON.parse(user) as UserProfile) : null;
  };

  const isAuthenticated = (): boolean => getCurrentUser() !== null;

  const hasRole = (...roles: Role[]): boolean => {
    const user = getCurrentUser();
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    hasRole
  };
};
