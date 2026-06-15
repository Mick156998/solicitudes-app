import { renderHook, act, waitFor } from "@testing-library/react";
import { useEditRequest } from "@/hooks/requests/useEditRequestPage";
import { requestService } from "@/services/request.service";
import { Request, UserProfile } from "@/interfaces/interface";

const mockBack = jest.fn();
const mockUseParams = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  useParams: () => mockUseParams(),
}));

jest.mock("@/services/request.service", () => ({
  requestService: {
    getById: jest.fn(),
    update: jest.fn(),
  },
}));

describe("useEditRequest", () => {
  const currentUser: UserProfile = {
    id: 1,
    name: "Admin",
    lastName: "Test",
    area: {
      id: 1,
      description: "Sistemas",
    },
    role: "Administrador",
  };

  const requestMock: Request = {
    id: "REQ-102",
    title: "Solicitud",
    description: "Descripción",
    category: "Otros",
    priority: "media",
    status: "pendiente",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    comments: [],
    userRequester: currentUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: "REQ-102" });

    (requestService.getById as jest.Mock).mockResolvedValue(requestMock);
  });

  it("debe inicializar correctamente", async () => {
    const { result } = renderHook(() => useEditRequest());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.id).toBe("REQ-102");
  });

  it("debe cargar la solicitud correctamente", async () => {
    const { result } = renderHook(() => useEditRequest());

    await waitFor(() => {
      expect(result.current.request).toEqual(requestMock);
    });

    expect(requestService.getById).toHaveBeenCalledWith("REQ-102");
  });

  it("debe manejar error al cargar solicitud", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    (requestService.getById as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useEditRequest());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.request).toBeNull();
  });

  it("updateRequest debe retornar true cuando actualiza correctamente", async () => {
    (requestService.update as jest.Mock).mockResolvedValue(requestMock);

    const { result } = renderHook(() => useEditRequest());

    let response;

    await act(async () => {
      response = await result.current.updateRequest({
        title: "Nuevo título",
      });
    });

    expect(response).toBe(true);
    expect(requestService.update).toHaveBeenCalledWith("REQ-102", {
      title: "Nuevo título",
    });
  });

  it("updateRequest debe retornar false cuando update devuelve null", async () => {
    (requestService.update as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useEditRequest());

    let response;

    await act(async () => {
      response = await result.current.updateRequest({
        title: "Nuevo título",
      });
    });

    expect(response).toBe(false);
  });

  it("updateRequest debe retornar false cuando ocurre excepción", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    (requestService.update as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useEditRequest());

    let response;

    await act(async () => {
      response = await result.current.updateRequest({
        title: "Nuevo título",
      });
    });

    expect(response).toBe(false);
  });

  it("handleBack debe ejecutar router.back", () => {
    const { result } = renderHook(() => useEditRequest());

    act(() => {
      result.current.handleBack();
    });

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("no debe cargar solicitud cuando id no existe", async () => {
    mockUseParams.mockReturnValue({ id: undefined });
    (requestService.getById as jest.Mock).mockClear();

    const { result } = renderHook(() => useEditRequest());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(requestService.getById).not.toHaveBeenCalled();
  });

  it("updateRequest debe retornar false cuando no existe id", async () => {
    mockUseParams.mockReturnValue({ id: undefined });

    const { result } = renderHook(() => useEditRequest());

    let response;

    await act(async () => {
      response = await result.current.updateRequest({
        title: "Nuevo título",
      });
    });

    expect(response).toBe(false);
    expect(requestService.update).not.toHaveBeenCalled();
  });
});
