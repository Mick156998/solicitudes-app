import { renderHook, waitFor, act } from "@testing-library/react";
import { useRequests } from "@/hooks/requests/useRequestsPage";
import { requestService } from "@/services/request.service";
import { Request, UserProfile } from "@/interfaces/interface";

jest.mock("@/services/request.service", () => ({
  requestService: {
    getAll: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("useRequests", () => {
  const user: UserProfile = {
    id: 1,
    name: "Admin",
    lastName: "Test",
    area: {
      id: 1,
      description: "Sistemas",
    },
    role: "Administrador",
  };

  const currentDate = new Date().toISOString();

  const requestsMock: Request[] = [
    {
      id: "REQ-001",
      title: "Laptop",
      description: "Nueva laptop",
      category: "Hardware",
      priority: "alta",
      status: "pendiente",
      createdAt: currentDate,
      updatedAt: currentDate,
      comments: [],
      userRequester: user,
    },
    {
      id: "REQ-002",
      title: "VPN",
      description: "Acceso VPN",
      category: "Acceso",
      priority: "media",
      status: "aprobada",
      createdAt: currentDate,
      updatedAt: currentDate,
      comments: [],
      userRequester: user,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (requestService.getAll as jest.Mock).mockResolvedValue(requestsMock);
  });

  it("debe inicializar correctamente", async () => {
    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.requests).toEqual(requestsMock);
    expect(result.current.loading).toBe(false);
  });

  it("debe cargar solicitudes al montar el hook", async () => {
    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.requests).toEqual(requestsMock);
    });

    expect(requestService.getAll).toHaveBeenCalledTimes(1);
  });

  it("debe actualizar requests al ejecutar loadRequests", async () => {
    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.requests).toEqual(requestsMock);
    });

    const newRequests: Request[] = [
      {
        ...requestsMock[0],
        id: "REQ-999",
      },
    ];

    (requestService.getAll as jest.Mock).mockResolvedValue(newRequests);

    await act(async () => {
      await result.current.loadRequests();
    });

    await waitFor(() => {
      expect(result.current.requests).toEqual(newRequests);
    });
  });

  it("debe activar y desactivar loading durante loadRequests", async () => {
    let resolveGetAll: ((value: Request[]) => void) | undefined;

    (requestService.getAll as jest.Mock).mockImplementation(
      () =>
        new Promise<Request[]>((resolve) => {
          resolveGetAll = resolve;
        }),
    );

    renderHook(() => useRequests());

    await act(async () => {
      resolveGetAll?.(requestsMock);
    });

    await waitFor(() => {
      expect(requestService.getAll).toHaveBeenCalled();
    });
  });

  it("debe manejar error durante loadRequests", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (requestService.getAll as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.requests).toEqual([]);

    expect(errorSpy).toHaveBeenCalledWith(
      "Error al obtener solicitudes",
      expect.any(Error),
    );

    errorSpy.mockRestore();
  });

  it("debe eliminar solicitud y recargar listado", async () => {
    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.requests).toEqual(requestsMock);
    });

    (requestService.delete as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      await result.current.deleteRequest("REQ-001");
    });

    expect(requestService.delete).toHaveBeenCalledWith("REQ-001");
    expect(requestService.getAll).toHaveBeenCalledTimes(2);
  });

  it("debe manejar error durante deleteRequest", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (requestService.delete as jest.Mock).mockRejectedValue(
      new Error("Error delete"),
    );

    const { result } = renderHook(() => useRequests());

    await act(async () => {
      await result.current.deleteRequest("REQ-001");
    });

    expect(errorSpy).toHaveBeenCalledWith(
      "Error al eliminar la solicitud",
      expect.any(Error),
    );

    errorSpy.mockRestore();
  });

  it("debe permitir ejecutar loadRequests manualmente", async () => {
    const { result } = renderHook(() => useRequests());

    await waitFor(() => {
      expect(result.current.requests).toEqual(requestsMock);
    });

    (requestService.getAll as jest.Mock).mockClear();

    await act(async () => {
      await result.current.loadRequests();
    });

    expect(requestService.getAll).toHaveBeenCalledTimes(1);
  });
});
