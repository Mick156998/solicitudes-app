import { renderHook, waitFor, act } from "@testing-library/react";
import { useRequestDetailPage } from "@/hooks/requests/useRequestDetailPage";
import { requestService } from "@/services/request.service";
import { ROUTES } from "@/constants/route";
import { Request, UserProfile, Comment } from "@/interfaces/interface";

const mockPush = jest.fn();
const mockUseParams = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => mockUseParams(),
}));

jest.mock("@/services/request.service", () => ({
  requestService: {
    getById: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("useRequestDetailPage", () => {
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

  const currentDate = new Date().toISOString();

  const requestMock: Request = {
    id: "REQ-102",
    title: "Solicitud",
    description: "Descripción",
    category: "Otros",
    priority: "media",
    status: "pendiente",
    createdAt: currentDate,
    updatedAt: currentDate,
    comments: [],
    userRequester: currentUser,
  };

  let getItemSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ id: "REQ-102" });

    getItemSpy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue(JSON.stringify(currentUser));

    (requestService.getById as jest.Mock).mockResolvedValue(requestMock);
  });

  afterEach(() => {
    getItemSpy.mockRestore();
  });

  it("debe cargar usuario y ticket correctamente", async () => {
    const { result } = renderHook(() => useRequestDetailPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(currentUser);
    expect(result.current.request).toEqual(requestMock);

    expect(requestService.getById).toHaveBeenCalledWith("REQ-102");
  });

  it("debe cargar ticket aunque no exista usuario en localStorage", async () => {
    getItemSpy.mockReturnValue(null);

    const { result } = renderHook(() => useRequestDetailPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.request).toEqual(requestMock);
  });

  it("debe finalizar loading cuando getById falla", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (requestService.getById as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useRequestDetailPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.request).toBeNull();

    errorSpy.mockRestore();
  });

  it("handleStatusChange debe retornar true", async () => {
    (requestService.patch as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useRequestDetailPage());

    const response = await result.current.handleStatusChange(
      "REQ-102",
      "aprobada",
    );

    expect(response).toBe(true);

    expect(requestService.patch).toHaveBeenCalledWith("REQ-102", {
      status: "aprobada",
    });
  });

  it("handleStatusChange debe retornar false cuando patch falla", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (requestService.patch as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useRequestDetailPage());

    const response = await result.current.handleStatusChange(
      "REQ-102",
      "rechazada",
    );

    expect(response).toBe(false);

    errorSpy.mockRestore();
  });

  it("handleCommentsChange debe retornar true", async () => {
    const comments: Comment[] = [
      {
        id: "COM-100",
        text: "Comentario",
        userAuthor: currentUser,
        createdAt: currentDate,
      },
    ];

    (requestService.patch as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useRequestDetailPage());

    const response = await result.current.handleCommentsChange(
      "REQ-102",
      comments,
    );

    expect(response).toBe(true);

    expect(requestService.patch).toHaveBeenCalledWith("REQ-102", {
      comments,
    });
  });

  it("handleCommentsChange debe retornar false cuando patch falla", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (requestService.patch as jest.Mock).mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useRequestDetailPage());

    const response = await result.current.handleCommentsChange("REQ-102", []);

    expect(response).toBe(false);

    errorSpy.mockRestore();
  });

  it("handleBack debe navegar al listado", () => {
    const { result } = renderHook(() => useRequestDetailPage());

    act(() => {
      result.current.handleBack();
    });

    expect(mockPush).toHaveBeenCalledWith(ROUTES.REQUESTS);
  });

  it("handleEdit debe navegar a edición", () => {
    const { result } = renderHook(() => useRequestDetailPage());

    act(() => {
      result.current.handleEdit("REQ-999");
    });

    expect(mockPush).toHaveBeenCalledWith(
      ROUTES.REQUEST_EDIT.replace("[id]", "REQ-999"),
    );
  });

  it("refreshRequest debe volver a consultar el ticket", async () => {
    const { result } = renderHook(() => useRequestDetailPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    (requestService.getById as jest.Mock).mockClear();

    await act(async () => {
      await result.current.refreshRequest();
    });

    expect(requestService.getById).toHaveBeenCalledWith("REQ-102");
  });
});
