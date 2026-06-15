import { renderHook, waitFor } from "@testing-library/react";
import { useDashboard } from "@/hooks/dashboard/useDashboardPage";
import { requestService } from "@/services/request.service";
import { RequestStatus } from "@/types/types";

jest.mock("@/services/request.service", () => ({
  requestService: {
    getAll: jest.fn(),
  },
}));

type StatusMeta = {
  label: string;
  color: string;
  bg: string;
};

const STATUS_META: Record<RequestStatus, StatusMeta> = {
  pendiente: {
    label: "Pendiente",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  en_revision: {
    label: "En Revisión",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  aprobada: {
    label: "Aprobada",
    color: "#10b981",
    bg: "#ecfdf5",
  },
  rechazada: {
    label: "Rechazada",
    color: "#ef4444",
    bg: "#fef2f2",
  },
  cerrada: {
    label: "Cerrada",
    color: "#64748b",
    bg: "#f1f5f9",
  },
};

describe("useDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe cargar solicitudes correctamente", async () => {
    (requestService.getAll as jest.Mock).mockResolvedValue([
      {
        id: "REQ-1",
        status: "pendiente",
        category: "Hardware",
        priority: "alta",
        updatedAt: "2026-01-10",
      },
    ]);

    const { result } = renderHook(() => useDashboard(STATUS_META));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.counts.pendiente).toBe(1);
  });

  it("debe calcular correctamente los contadores por estado", async () => {
    (requestService.getAll as jest.Mock).mockResolvedValue([
      {
        id: "1",
        status: "pendiente",
        category: "Hardware",
        priority: "alta",
        updatedAt: "2026-01-10",
      },
      {
        id: "2",
        status: "aprobada",
        category: "Software",
        priority: "media",
        updatedAt: "2026-01-11",
      },
      {
        id: "3",
        status: "aprobada",
        category: "Software",
        priority: "baja",
        updatedAt: "2026-01-12",
      },
    ]);

    const { result } = renderHook(() => useDashboard(STATUS_META));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.counts).toEqual({
      pendiente: 1,
      en_revision: 0,
      aprobada: 2,
      rechazada: 0,
      cerrada: 0,
    });
  });

  it("debe construir pieData correctamente", async () => {
    (requestService.getAll as jest.Mock).mockResolvedValue([
      {
        id: "1",
        status: "pendiente",
        category: "Hardware",
        priority: "alta",
        updatedAt: "2026-01-10",
      },
    ]);

    const { result } = renderHook(() => useDashboard(STATUS_META));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pieData).toEqual([
      {
        name: "Pendiente",
        value: 1,
        color: "#f59e0b",
      },
    ]);
  });

  it("debe calcular categoryData correctamente", async () => {
    (requestService.getAll as jest.Mock).mockResolvedValue([
      {
        id: "1",
        status: "aprobada",
        category: "Hardware",
        priority: "alta",
        updatedAt: "2026-01-10",
      },
      {
        id: "2",
        status: "pendiente",
        category: "Hardware",
        priority: "media",
        updatedAt: "2026-01-11",
      },
    ]);

    const { result } = renderHook(() => useDashboard(STATUS_META));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categoryData).toEqual([
      {
        name: "Hardware",
        total: 2,
        aprobadas: 1,
      },
    ]);
  });

  it("debe identificar solicitudes urgentes", async () => {
    (requestService.getAll as jest.Mock).mockResolvedValue([
      {
        id: "1",
        status: "pendiente",
        category: "Hardware",
        priority: "alta",
        updatedAt: "2026-01-10",
      },
      {
        id: "2",
        status: "cerrada",
        category: "Software",
        priority: "alta",
        updatedAt: "2026-01-11",
      },
    ]);

    const { result } = renderHook(() => useDashboard(STATUS_META));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.urgentRequests).toHaveLength(1);
  });

  it("debe ordenar recentRequests por updatedAt descendente", async () => {
    (requestService.getAll as jest.Mock).mockResolvedValue([
      {
        id: "REQ-1",
        status: "pendiente",
        category: "Hardware",
        priority: "alta",
        updatedAt: "2026-01-01",
      },
      {
        id: "REQ-2",
        status: "pendiente",
        category: "Hardware",
        priority: "alta",
        updatedAt: "2026-02-01",
      },
    ]);

    const { result } = renderHook(() => useDashboard(STATUS_META));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.recentRequests[0].id).toBe("REQ-2");
  });

  it("debe manejar errores del servicio", async () => {
    (requestService.getAll as jest.Mock).mockRejectedValue(new Error("error"));

    const { result } = renderHook(() => useDashboard(STATUS_META));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.counts.pendiente).toBe(0);
  });
});
