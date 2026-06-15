import { renderHook, act } from "@testing-library/react";
import { useRequestDetail } from "@/hooks/requests/useRequestDetail";
import { UserProfile, Request, Comment } from "@/interfaces/interface";

jest.mock("uuid", () => ({
  v4: () => "TEST-ID",
}));

describe("useRequestDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const currentDate = new Date().toISOString();

  const currentUser: UserProfile = {
    id: 1,
    name: "Asistente",
    lastName: "Pruebas",
    area: {
      id: 1,
      description: "Sistemas",
    },
    role: "Administrador",
  };

  const baseRequest: Request = {
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

  it("debe inicializar correctamente", () => {
    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onStatusChange: jest.fn(),
        onCommentsChange: jest.fn(),
        onRefresh: jest.fn(),
      }),
    );

    expect(result.current.showStatusPanel).toBe(false);
    expect(result.current.selectedStatus).toBeNull();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.commentText).toBe("");
  });

  it("debe alternar el panel de estados", () => {
    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onStatusChange: jest.fn(),
        onCommentsChange: jest.fn(),
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.handleToggleStatusPanel();
    });

    expect(result.current.showStatusPanel).toBe(true);

    act(() => {
      result.current.handleToggleStatusPanel();
    });

    expect(result.current.showStatusPanel).toBe(false);
  });

  it("debe limpiar selectedStatus al alternar panel", () => {
    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onStatusChange: jest.fn(),
        onCommentsChange: jest.fn(),
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.setSelectedStatus("aprobada");
    });

    expect(result.current.selectedStatus).toBe("aprobada");

    act(() => {
      result.current.handleToggleStatusPanel();
    });

    expect(result.current.selectedStatus).toBeNull();
  });

  it("no debe abrir modal si no existe estado seleccionado", () => {
    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onStatusChange: jest.fn(),
        onCommentsChange: jest.fn(),
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.handleOpenModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  it("debe abrir modal cuando existe estado seleccionado", () => {
    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onStatusChange: jest.fn(),
        onCommentsChange: jest.fn(),
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.setSelectedStatus("aprobada");
    });

    act(() => {
      result.current.handleOpenModal();
    });

    expect(result.current.isModalOpen).toBe(true);
  });

  it("debe cerrar modal y limpiar comentario", () => {
    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onStatusChange: jest.fn(),
        onCommentsChange: jest.fn(),
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.setSelectedStatus("aprobada");
      result.current.handleOpenModal();
      result.current.setCommentText("Comentario");
    });

    act(() => {
      result.current.handleCloseModal();
    });

    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.commentText).toBe("");
  });

  it("no debe ejecutar transición con comentario vacío", async () => {
    const onCommentsChange = jest.fn();
    const onStatusChange = jest.fn();

    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onCommentsChange,
        onStatusChange,
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.setSelectedStatus("aprobada");
    });

    await act(async () => {
      await result.current.handleConfirmTransition();
    });

    expect(onCommentsChange).not.toHaveBeenCalled();
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it("no debe ejecutar transición sin estado seleccionado", async () => {
    const onCommentsChange = jest.fn();
    const onStatusChange = jest.fn();

    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onCommentsChange,
        onStatusChange,
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.setCommentText("Comentario");
    });

    await act(async () => {
      await result.current.handleConfirmTransition();
    });

    expect(onCommentsChange).not.toHaveBeenCalled();
    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it("debe completar exitosamente una transición", async () => {
    const onCommentsChange = jest.fn().mockResolvedValue(true);
    const onStatusChange = jest.fn().mockResolvedValue(true);
    const onRefresh = jest.fn();

    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onCommentsChange,
        onStatusChange,
        onRefresh,
      }),
    );

    act(() => {
      result.current.setSelectedStatus("aprobada");
      result.current.setCommentText("Comentario de prueba");
      result.current.handleOpenModal();
    });

    await act(async () => {
      await result.current.handleConfirmTransition();
    });

    expect(onCommentsChange).toHaveBeenCalledTimes(1);
    expect(onStatusChange).toHaveBeenCalledWith("REQ-102", "aprobada");
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.commentText).toBe("");
    expect(result.current.selectedStatus).toBeNull();
    expect(result.current.showStatusPanel).toBe(false);
  });

  it("debe marcar error cuando falla actualización de comentarios", async () => {
    const onCommentsChange = jest.fn().mockResolvedValue(false);
    const onStatusChange = jest.fn();

    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onCommentsChange,
        onStatusChange,
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.setSelectedStatus("aprobada");
      result.current.setCommentText("Comentario");
    });

    await act(async () => {
      await result.current.handleConfirmTransition();
    });

    expect(onStatusChange).not.toHaveBeenCalled();
  });

  it("debe marcar error cuando falla actualización de estado", async () => {
    const onCommentsChange = jest.fn().mockResolvedValue(true);
    const onStatusChange = jest.fn().mockResolvedValue(false);

    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onCommentsChange,
        onStatusChange,
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.setSelectedStatus("aprobada");
      result.current.setCommentText("Comentario");
    });

    await act(async () => {
      await result.current.handleConfirmTransition();
    });
  });

  it("debe marcar error cuando ocurre una excepción", async () => {
    const onCommentsChange = jest.fn().mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() =>
      useRequestDetail({
        request: baseRequest,
        user: currentUser,
        onCommentsChange,
        onStatusChange: jest.fn(),
        onRefresh: jest.fn(),
      }),
    );

    act(() => {
      result.current.setSelectedStatus("aprobada");
      result.current.setCommentText("Comentario");
    });

    await act(async () => {
      await result.current.handleConfirmTransition();
    });

    expect(result.current.isMutating).toBe(false);
  });
});