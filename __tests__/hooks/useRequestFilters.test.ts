import { renderHook, act, waitFor } from "@testing-library/react";
import { useRequestFilters } from "@/hooks/requests/useRequestFilters";
import { Request, UserProfile } from "@/interfaces/interface";

describe("useRequestFilters", () => {
  const user: UserProfile = {
    id: 1,
    name: "Juan",
    lastName: "Perez",
    area: {
      id: 1,
      description: "Sistemas",
    },
    role: "Administrador",
  };

  const currentDate = new Date().toISOString();

  const requests: Request[] = [
    {
      id: "REQ-001",
      title: "Laptop",
      description: "",
      category: "Hardware",
      priority: "alta",
      status: "pendiente",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      comments: [],
      userRequester: user,
    },
    {
      id: "REQ-002",
      title: "Software SAP",
      description: "",
      category: "Software",
      priority: "media",
      status: "aprobada",
      createdAt: "2026-02-01T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z",
      comments: [],
      userRequester: {
        ...user,
        name: "Maria",
      },
    },
    {
      id: "REQ-003",
      title: "Acceso VPN",
      description: "",
      category: "Acceso",
      priority: "baja",
      status: "rechazada",
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
      comments: [],
      userRequester: {
        ...user,
        area: {
          id: 2,
          description: "Finanzas",
        },
      },
    },
  ];

  it("debe inicializar correctamente", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    expect(result.current.search).toBe("");
    expect(result.current.statusFilter).toBe("");
    expect(result.current.categoryFilter).toBe("");
    expect(result.current.priorityFilter).toBe("");
    expect(result.current.activeFilters).toBe(0);
  });

  it("debe filtrar por título", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setSearch("Laptop");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("REQ-001");
  });

  it("debe filtrar por nombre de usuario", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setSearch("Maria");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("REQ-002");
  });

  it("debe filtrar por área", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setSearch("Finanzas");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("REQ-003");
  });

  it("debe filtrar por estado", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setStatusFilter("aprobada");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].status).toBe("aprobada");
  });

  it("debe filtrar por categoría", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setCategoryFilter("Hardware");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].category).toBe("Hardware");
  });

  it("debe filtrar por prioridad", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setPriorityFilter("alta");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].priority).toBe("alta");
  });

  it("debe combinar filtros", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setStatusFilter("pendiente");
      result.current.setPriorityFilter("alta");
      result.current.setCategoryFilter("Hardware");
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.activeFilters).toBe(3);
  });

  it("debe limpiar filtros", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setSearch("Laptop");
      result.current.setStatusFilter("pendiente");
      result.current.clearFilters();
    });

    expect(result.current.search).toBe("");
    expect(result.current.statusFilter).toBe("");
    expect(result.current.categoryFilter).toBe("");
    expect(result.current.priorityFilter).toBe("");
  });

  it("debe ordenar por prioridad", async () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.handleSort("priority");
    });

    await waitFor(() => {
      const priorities = result.current.filtered.map((r) => r.priority);
      expect(priorities).toEqual(["alta", "media", "baja"]);
    });
  });

  it("debe cambiar columna de ordenamiento", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.handleSort("title");
    });

    expect(result.current.sortKey).toBe("title");
    expect(result.current.sortDir).toBe("desc");
  });

  it("debe alternar asc y desc", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.handleSort("title");
    });

    act(() => {
      result.current.handleSort("title");
    });

    expect(result.current.sortDir).toBe("asc");
  });

  it("debe ordenar por title", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.handleSort("title");
      result.current.handleSort("title");
    });

    const titles = result.current.filtered.map((r) => r.title);

    expect(titles).toEqual(["Acceso VPN", "Laptop", "Software SAP"]);
  });

  it("debe ordenar por status", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.handleSort("status");
      result.current.handleSort("status");
    });

    const statuses = result.current.filtered.map((r) => r.status);

    expect(statuses).toEqual(["aprobada", "pendiente", "rechazada"]);
  });

  it("debe ordenar por createdAt", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.handleSort("createdAt");
      result.current.handleSort("createdAt");
    });

    const ordered = result.current.filtered.map((r) => r.createdAt);

    expect(ordered).toEqual([
      "2026-03-01T00:00:00.000Z",
      "2026-02-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
    ]);
  });

  it("debe retornar vacío cuando no existen coincidencias", () => {
    const { result } = renderHook(() => useRequestFilters(requests));

    act(() => {
      result.current.setSearch("INEXISTENTE");
    });

    expect(result.current.filtered).toHaveLength(0);
  });
});
