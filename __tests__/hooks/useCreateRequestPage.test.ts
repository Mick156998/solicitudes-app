import { renderHook, waitFor, act } from "@testing-library/react";
import { useCreateRequest } from "@/hooks/requests/useCreateRequestPage";
import { requestService } from "@/services/request.service";
import { Request, UserProfile } from "@/interfaces/interface";

const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock("@/services/request.service", () => ({
  requestService: {
    create: jest.fn(),
  },
}));

describe("useCreateRequest", () => {
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    userRequester: currentUser,
  };

  let getItemSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    getItemSpy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue(JSON.stringify(currentUser));
  });

  afterEach(() => {
    getItemSpy.mockRestore();
  });

  it("debe inicializar usuario correctamente desde localStorage", async () => {
    const { result } = renderHook(() => useCreateRequest());

    await waitFor(() => {
      expect(result.current.user).toEqual(currentUser);
    });
  });

  it("debe retornar null si no hay usuario en localStorage", async () => {
    getItemSpy.mockReturnValue(null);

    const { result } = renderHook(() => useCreateRequest());

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  it("debe manejar error si JSON.parse falla", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    getItemSpy.mockReturnValue("{invalid-json");

    const { result } = renderHook(() => useCreateRequest());

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("createRequest debe retornar true cuando la API responde correctamente", async () => {
    (requestService.create as jest.Mock).mockResolvedValue(requestMock);

    const { result } = renderHook(() => useCreateRequest());

    const response = await result.current.createRequest(requestMock);

    expect(response).toBe(true);
    expect(requestService.create).toHaveBeenCalledWith(requestMock);
  });

  it("createRequest debe retornar false cuando API responde null", async () => {
    (requestService.create as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useCreateRequest());

    const response = await result.current.createRequest(requestMock);

    expect(response).toBe(false);
  });

  it("createRequest debe retornar false cuando ocurre error", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (requestService.create as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useCreateRequest());

    const response = await result.current.createRequest(requestMock);

    expect(response).toBe(false);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("handleBack debe ejecutar router.back", () => {
    const { result } = renderHook(() => useCreateRequest());

    act(() => {
      result.current.handleBack();
    });

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});