"use client";

import { useState, useEffect } from "react";
import { Request } from "@/interfaces/interface";
import { requestService } from "@/services/request.service";

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getAll();
      setRequests(data);
    } catch (error) {
      console.error("Error al obtener solicitudes", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await requestService.delete(id);
      await loadRequests();
    } catch (error) {
      console.error("Error al eliminar la solicitud", error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return {
    requests,
    loading,
    loadRequests,
    deleteRequest,
  };
}