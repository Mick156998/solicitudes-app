import { renderHook, act } from "@testing-library/react";
import { useRequestForm } from "@/hooks/requests/useRequestForm";
import { useForm } from "react-hook-form";
import { UserProfile, Request } from "@/interfaces/interface";
import { RequestCategory, RequestPriority } from "@/types/types";

interface FormData {
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
}

jest.mock("uuid", () => ({
  v4: () => "TEST-ID",
}));

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

describe("useRequestForm", () => {
  const mockHandleSubmit = jest.fn();
  const mockRegister = jest.fn();

  const currentUser: UserProfile = {
    id: 1,
    name: "Asistente",
    lastName: "Pruebas",
    area: { id: 1, description: "Sistemas" },
    role: "Administrador",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useForm as jest.Mock).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      formState: {
        errors: {},
        isSubmitting: false,
      },
    });
  });

  it("debe inicializar correctamente sin initialData", () => {
    mockHandleSubmit.mockImplementation((fn) => fn);

    const { result } = renderHook(() =>
      useRequestForm({
        currentUser,
        onSubmit: jest.fn(),
      }),
    );

    expect(result.current.register).toBe(mockRegister);
  });

  it("debe inicializar useForm con initialData", () => {
    mockHandleSubmit.mockImplementation((fn) => fn);

    const request: Request = {
      id: "REQ-102",
      title: "Laptop",
      description: "Nueva laptop",
      category: "Hardware",
      priority: "alta",
      status: "pendiente",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      userRequester: currentUser,
    };

    renderHook(() =>
      useRequestForm({
        initialData: request,
        currentUser,
        onSubmit: jest.fn(),
      }),
    );

    expect(useForm).toHaveBeenCalledWith({
      defaultValues: {
        title: request.title,
        description: request.description,
        category: request.category,
        priority: request.priority,
      },
    });
  });

  it("debe construir correctamente la solicitud en modo creación", async () => {
    const onSubmit = jest.fn().mockResolvedValue(true);

    let submitFn: ((data: FormData) => Promise<void>) | undefined;

    mockHandleSubmit.mockImplementation((fn) => {
      submitFn = fn;
      return jest.fn();
    });

    renderHook(() =>
      useRequestForm({
        currentUser,
        onSubmit,
      }),
    );

    await act(async () => {
      await submitFn!({
        title: "Solicitud TI",
        description: "Descripción",
        category: "Otros",
        priority: "media",
      });
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);

    const requestSent: Request = onSubmit.mock.calls[0][0];

    expect(requestSent.id).toBe("REQ-TEST-ID");
    expect(requestSent.status).toBe("pendiente");
    expect(requestSent.comments).toEqual([]);
    expect(requestSent.userRequester).toEqual(currentUser);
    expect(typeof requestSent.createdAt).toBe("string");
    expect(typeof requestSent.updatedAt).toBe("string");
  });

  it("debe construir correctamente en modo edición", async () => {
    const onSubmit = jest.fn().mockResolvedValue(true);

    let submitFn: ((data: FormData) => Promise<void>) | undefined;

    mockHandleSubmit.mockImplementation((fn) => {
      submitFn = fn;
      return jest.fn();
    });

    const request: Request = {
      id: "REQ-99",
      title: "Anterior",
      description: "Anterior",
      category: "Otros",
      priority: "alta",
      status: "aprobada",
      createdAt: "2026-01-01T20:00:00",
      updatedAt: "2026-01-01T20:00:00",
      comments: [],
      userRequester: currentUser,
    };

    renderHook(() =>
      useRequestForm({
        initialData: request,
        currentUser,
        onSubmit,
      }),
    );

    await act(async () => {
      await submitFn!({
        title: "Actualizado",
        description: "Nueva descripción",
        category: "Otros",
        priority: "media",
      });
    });

    const requestSent = onSubmit.mock.calls[0][0] as Request;

    expect(requestSent.id).toBe("REQ-99");
    expect(requestSent.status).toBe("aprobada");
    expect(requestSent.createdAt).toBe("2026-01-01T20:00:00");
  });

  it("debe marcar submitted cuando el submit es exitoso", async () => {
    const onSubmit = jest.fn().mockResolvedValue(true);

    let submitFn: ((data: FormData) => Promise<void>) | undefined;

    mockHandleSubmit.mockImplementation((fn) => {
      submitFn = fn;
      return jest.fn();
    });

    const { result } = renderHook(() =>
      useRequestForm({
        currentUser,
        onSubmit,
      }),
    );

    await act(async () => {
      await submitFn!({
        title: "Solicitud",
        description: "Desc",
        category: "Otros",
        priority: "media",
      });
    });
  });

  it("debe marcar error cuando onSubmit retorna false", async () => {
    const onSubmit = jest.fn().mockResolvedValue(false);

    let submitFn: ((data: FormData) => Promise<void>) | undefined;

    mockHandleSubmit.mockImplementation((fn) => {
      submitFn = fn;
      return jest.fn();
    });

    const { result } = renderHook(() =>
      useRequestForm({
        currentUser,
        onSubmit,
      }),
    );

    await act(async () => {
      await submitFn!({
        title: "Solicitud",
        description: "Desc",
        category: "Otros",
        priority: "media",
      });
    });
  });
});
