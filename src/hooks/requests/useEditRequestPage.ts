"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Request } from "@/interfaces/interface";
import { requestService } from "@/services/request.service";

export function useEditRequest() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRequest = useCallback(async () => {
    try {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await requestService.getById(id);
      setRequest(data);
    } catch (error) {
      console.error(`Error al recuperar la solicitud ${id}:`, error);
      setRequest(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateRequest = async (data: Partial<Request>): Promise<boolean> => {
    if (!id) return false;

    try {
      const response = await requestService.update(id, data);
      return !!response;
    } catch (error) {
      console.error(`Error al actualizar la solicitud ${id}:`, error);
      return false;
    }
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  return {
    id,
    request,
    loading,

    updateRequest,
    handleBack,
  };
}
