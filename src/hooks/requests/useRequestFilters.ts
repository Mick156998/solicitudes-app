"use client";

import { useMemo, useState } from "react";
import { RequestStatus, RequestPriority, RequestCategory } from "@/types/types";
import { Request } from "@/interfaces/interface";

type SortKey =
  | "id"
  | "title"
  | "createdAt"
  | "updatedAt"
  | "priority"
  | "status";

export function useRequestFilters(requests: Request[]) {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState<RequestCategory | "">(
    "",
  );
  const [priorityFilter, setPriorityFilter] = useState<RequestPriority | "">(
    "",
  );

  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let result = [...requests];

    // SEARCH
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.userRequester.name.toLowerCase().includes(q) ||
          r.userRequester.area.description.toLowerCase().includes(q),
      );
    }

    // FILTERS
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (categoryFilter) {
      result = result.filter((r) => r.category === categoryFilter);
    }

    if (priorityFilter) {
      result = result.filter((r) => r.priority === priorityFilter);
    }

    // SORT
    result.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";

      if (sortKey === "priority") {
        const order: Record<RequestPriority, number> = {
          alta: 0,
          media: 1,
          baja: 2,
        };
        av = order[a.priority];
        bv = order[b.priority];

        return sortDir === "asc" ? av - bv : bv - av;
      }

      if (sortKey === "status") {
        const order: Record<RequestStatus, number> = {
          pendiente: 0,
          en_revision: 1,
          aprobada: 2,
          rechazada: 3,
          cerrada: 4,
        };
        av = order[a.status];
        bv = order[b.status];

        return sortDir === "asc" ? av - bv : bv - av;
      }

      const aValue = a[sortKey];
      const bValue = b[sortKey];

      av =
        typeof aValue === "string" || typeof aValue === "number" ? aValue : "";
      bv =
        typeof bValue === "string" || typeof bValue === "number" ? bValue : "";

      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }

      const avNum = Number(av);
      const bvNum = Number(bv);

      return sortDir === "asc" ? avNum - bvNum : bvNum - avNum;
    });

    return result;
  }, [
    requests,
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
    sortKey,
    sortDir,
  ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setPriorityFilter("");
  };

  const activeFilters = [statusFilter, categoryFilter, priorityFilter].filter(
    Boolean,
  ).length;

  return {
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
  };
}
