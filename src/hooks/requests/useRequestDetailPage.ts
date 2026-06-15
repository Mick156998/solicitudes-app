"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { requestService } from "@/services/request.service";
import { Comment, Request, UserProfile } from "@/interfaces/interface";
import { RequestStatus } from "@/types/types";
import { ROUTES } from "@/constants/route";

export function useRequestDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params?.id === "string" ? params.id : undefined;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Error parsing user from localStorage");
      }
    }
  }, []);

  const loadRequest = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await requestService.getById(id);
      setRequest(data);
    } catch (err) {
      console.error(`Error al recuperar el ticket ${id}:`, err);
      setError("Error al cargar el ticket");
    } finally {
      setLoading(false);
    }
  }, [id, requestService]);

  useEffect(() => {
    loadUser();
    loadRequest();
  }, [loadUser, loadRequest]);

  const updateRequest = useCallback(
    async (ticketId: string, payload: Partial<Request>): Promise<boolean> => {
      try {
        const response = await requestService.patch(ticketId, payload);

        if (!response) return false;

        setRequest((prev) =>
          prev ? { ...prev, ...payload } : prev
        );

        return true;
      } catch (err) {
        console.error("Error actualizando request:", err);
        return false;
      }
    },
    [requestService]
  );

  const handleStatusChange = useCallback(
    (ticketId: string, status: RequestStatus) => {
      return updateRequest(ticketId, { status });
    },
    [updateRequest]
  );

  const handleCommentsChange = useCallback(
    (ticketId: string, comments: Comment[]) => {
      return updateRequest(ticketId, { comments });
    },
    [updateRequest]
  );

  const handleBack = useCallback(() => {
    router.push(ROUTES.REQUESTS);
  }, [router]);

  const handleEdit = useCallback(
    (ticketId: string) => {
      router.push(ROUTES.REQUEST_EDIT.replace("[id]", ticketId));
    },
    [router]
  );

  return {
    user,
    request,
    loading,
    error,

    refreshRequest: loadRequest,

    handleBack,
    handleEdit,
    handleStatusChange,
    handleCommentsChange,
  };
}