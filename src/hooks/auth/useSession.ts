"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { Role } from "@/types/types";
import { UserProfile } from "@/interfaces/interface";

interface UseSessionOptions {
  requiredRoles?: Role[];
  unauthorizedRedirect?: string;
}

interface UseSessionResult {
  loading: boolean;
  user: UserProfile | null;
}

export function useSession(options: UseSessionOptions = {}): UseSessionResult {
  const router = useRouter();
  const { requiredRoles, unauthorizedRedirect = ROUTES.REQUESTS } = options;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");

    if (!raw) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    const parsedUser: UserProfile = JSON.parse(raw);

    if (requiredRoles && !requiredRoles.includes(parsedUser.role)) {
      router.replace(unauthorizedRedirect);
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router, requiredRoles, unauthorizedRedirect]);

  return { loading, user };
}
