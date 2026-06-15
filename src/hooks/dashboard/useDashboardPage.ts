"use client";

import { useState, useEffect, useMemo } from "react";
import { Request } from "@/interfaces/interface";
import { RequestStatus } from "@/types/types";
import { requestService } from "@/services/request.service";

export interface StatusMetaItem {
  label: string;
  color: string;
  bg: string;
}

export function useDashboard(
  statusMeta: Record<
    RequestStatus,
    { label: string; color: string; bg: string }
  >,
) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Carga inicial de datos de la API
  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const data = await requestService.getAll();
        setRequests(data ?? []);
      } catch (error) {
        console.error("Error al obtener solicitudes para el Dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  // 2. Métrica: Conteo consolidado por estado
  const counts = useMemo(() => {
    return {
      pendiente: requests.filter((r) => r.status === "pendiente").length,
      en_revision: requests.filter((r) => r.status === "en_revision").length,
      aprobada: requests.filter((r) => r.status === "aprobada").length,
      rechazada: requests.filter((r) => r.status === "rechazada").length,
      cerrada: requests.filter((r) => r.status === "cerrada").length,
    };
  }, [requests]);

  // 3. Métrica: Formateo estructurado para el Gráfico de Donas (PieChart)
  const pieData = useMemo(() => {
    return (Object.entries(counts) as [RequestStatus, number][])
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        name: statusMeta[key].label,
        value,
        color: statusMeta[key].color,
      }));
  }, [counts, statusMeta]);

  // 4. Métrica: Formateo consolidado por Categorías (BarChart)
  const categoryData = useMemo(() => {
    const targetCategories = [
      "Hardware",
      "Software",
      "Acceso",
      "Infraestructura",
      "Compras",
      "Otros",
    ];
    return targetCategories
      .map((cat) => ({
        name: cat,
        total: requests.filter((r) => r.category === cat).length,
        aprobadas: requests.filter(
          (r) => r.category === cat && r.status === "aprobada",
        ).length,
      }))
      .filter((d) => d.total > 0);
  }, [requests]);

  // 5. Métrica: Solicitudes de Alta Prioridad Desatendidas
  const urgentRequests = useMemo(() => {
    return requests.filter(
      (r) =>
        r.priority === "alta" &&
        (r.status === "pendiente" || r.status === "en_revision"),
    );
  }, [requests]);

  // 6. Métrica: Historial de Actividad Reciente (Top 5 ordenado por fecha de auditoría)
  const recentRequests = useMemo(() => {
    return [...requests]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5);
  }, [requests]);

  return {
    loading,
    counts,
    pieData,
    categoryData,
    urgentRequests,
    recentRequests,
  };
}
