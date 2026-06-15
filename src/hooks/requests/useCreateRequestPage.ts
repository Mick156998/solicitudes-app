"use client";

import { useState, useEffect } from "react";
import { Request, UserProfile } from "@/interfaces/interface";
import { requestService } from "@/services/request.service";
import { useRouter } from "next/navigation";

export function useCreateRequest() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parseando el usuario desde localStorage", error);
      }
    }
  }, []);

  const createRequest = async (data: Request): Promise<boolean> => {
    try {
      const response = await requestService.create(data);
      return !!response;
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
      return false;
    }
  };

  const handleBack = () => router.back();

  return {
    user,
    createRequest,
    handleBack,
  };
}