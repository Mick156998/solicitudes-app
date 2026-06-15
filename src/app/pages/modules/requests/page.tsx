"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  X,
  Eye,
  Trash2,
} from "lucide-react";
import { Area } from "@/interfaces/interface";
import { RequestStatus, RequestPriority, RequestCategory } from "@/types/types";

import { Loader } from "@/app/components/Loader";
import { StatusBadge, PriorityBadge } from "@/app/components/statusBadge";

import { useRequests } from "@/hooks/requests/useRequestsPage";
import { useRequestFilters } from "@/hooks/requests/useRequestFilters";
import { areaService } from "@/services/master.service";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

type SortKey =
  | "id"
  | "title"
  | "createdAt"
  | "updatedAt"
  | "priority"
  | "status";

const STATUSES: RequestStatus[] = [
  "pendiente",
  "en_revision",
  "aprobada",
  "rechazada",
  "cerrada",
];
const CATEGORIES: RequestCategory[] = [
  "Hardware",
  "Software",
  "Acceso",
  "Infraestructura",
  "Compras",
  "Otros",
];
const PRIORITIES: RequestPriority[] = ["alta", "media", "baja"];

const statusLabels: Record<RequestStatus, string> = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  cerrada: "Cerrada",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RequestPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);

  const [areaFilter, setAreaFilter] = useState<number | 0>(0);

  const { requests, loading, deleteRequest } = useRequests();

  const {
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
    sortKey,
    sortDir,
    filtered,
    activeFilters,
    setSearch,
    setStatusFilter,
    setCategoryFilter,
    setPriorityFilter,
    handleSort,
    clearFilters,
  } = useRequestFilters(requests);

  const finalFiltered = useMemo(() => {
    return filtered;
  }, [filtered, areaFilter]);

  const totalActiveFilters = activeFilters + (areaFilter > 0 ? 1 : 0);

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const data = await areaService.getAll();
        setAreas(data);
      } catch (error) {
        console.error("Error al obtener los datos maestros", error);
      }
    };
    loadMasterData();
  }, []);

  const handleClearAll = () => {
    clearFilters();
    setAreaFilter(0);
  };

  const columnOptions = [
    { key: "title" as SortKey, label: "Título" },
    { key: "status" as SortKey, label: "Estado" },
    { key: "priority" as SortKey, label: "Prioridad" },
    { key: "updatedAt" as SortKey, label: "Actualización" },
  ];

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="text-red-600" />
    ) : (
      <ChevronDown size={12} className="text-red-600" />
    );
  };

  return (
    <div className="space-y-4 bg-white p-10 min-h-screen relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Bandeja de Solicitudes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {finalFiltered.length} de {requests.length} solicitudes
          </p>
        </div>
        <button
          onClick={() => router.push(ROUTES.REQUEST_CREATE)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          + Nuevo
        </button>
      </div>

      {/* Barra de Controles */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar por título, solicitante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-600/20"
          />
        </div>

        <button
          onClick={() => setShowFilters((f) => !f)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors cursor-pointer ${
            showFilters
              ? "border-red-600 bg-red-50/50 text-red-600"
              : "border-border bg-card text-foreground hover:bg-muted/40"
          }`}
        >
          <SlidersHorizontal size={14} />
          Filtros
          {totalActiveFilters > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
              {totalActiveFilters}
            </span>
          )}
        </button>

        {(totalActiveFilters > 0 || search) && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground border border-border bg-card cursor-pointer"
          >
            <X size={13} /> Limpiar
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-muted/20 rounded-lg border border-border transition-all">
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-muted-foreground font-medium">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as RequestStatus | "")
              }
              className="px-2 py-1.5 rounded-md border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-600/20"
            >
              <option value="">Todos</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-muted-foreground font-medium">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as RequestCategory | "")
              }
              className="px-2 py-1.5 rounded-md border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-600/20"
            >
              <option value="">Todas</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="text-xs text-muted-foreground font-medium">
              Prioridad
            </label>
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as RequestPriority | "")
              }
              className="px-2 py-1.5 rounded-md border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-600/20"
            >
              <option value="">Todas</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 border rounded-lg border-dashed">
          <Loader
            size={40}
            text="Sincronizando solicitudes corporativas..."
            color="border-red-600"
          />
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {columnOptions.map(({ key, label }) => (
                    <th key={key} className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort(key)}
                        className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        {label}
                        <SortIcon col={key} />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Solicitante / Área
                  </th>
                  <th className="px-4 py-3 w-28" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {finalFiltered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-16 text-center text-sm text-muted-foreground"
                    >
                      No se encontraron solicitudes que coincidan con la
                      búsqueda.
                    </td>
                  </tr>
                ) : (
                  finalFiltered.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground truncate max-w-xs">
                          {req.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {req.category}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={req.priority} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(req.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">
                        <p className="font-medium">
                          {req.userRequester.name} {req.userRequester.lastName}
                        </p>
                        <p className="text-muted-foreground text-[11px] mt-0.5">
                          {req.userRequester.area.description}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              router.push(
                                ROUTES.REQUEST_DETAIL.replace("[id]", req.id),
                              )
                            }
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          {req.status === "pendiente" && (
                            <button
                              onClick={() => deleteRequest(req.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-2">
            {finalFiltered.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">
                No se encontraron solicitudes.
              </div>
            ) : (
              finalFiltered.map((req) => (
                <div
                  key={req.id}
                  onClick={() =>
                    router.push(ROUTES.REQUEST_DETAIL.replace("[id]", req.id))
                  }
                  className="w-full bg-card rounded-lg border border-border p-4 text-left hover:shadow-sm transition-shadow cursor-pointer relative group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-foreground text-sm leading-snug truncate pr-4">
                      {req.title}
                    </p>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <span className="font-medium text-foreground/80">
                      {req.category}
                    </span>
                    <span>•</span>
                    <PriorityBadge priority={req.priority} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-2 flex justify-between items-center border-t border-muted/30 pt-2">
                    <span>
                      {req.userRequester.name} (
                      {req.userRequester.area.description.split(" ")[0]})
                    </span>
                    <span>{formatDate(req.updatedAt)}</span>
                  </div>

                  {req.status === "pendiente" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRequest(req.id);
                      }}
                      className="absolute right-3 bottom-10 p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
