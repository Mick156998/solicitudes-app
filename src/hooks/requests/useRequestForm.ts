"use client";

import { useForm } from "react-hook-form";
import { v4 as uid } from "uuid";
import { Request, UserProfile } from "@/interfaces/interface";
import { RequestCategory, RequestPriority } from "@/types/types";
import { toast } from "sonner";

interface FormData {
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
}

interface UseRequestFormProps {
  initialData?: Request;
  currentUser: UserProfile;
  onSubmit: (data: Request) => Promise<boolean>;
}

export function useRequestForm({
  initialData,
  currentUser,
  onSubmit,
}: UseRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          category: initialData.category,
          priority: initialData.priority,
        }
      : {
          priority: "media",
          category: "Otros",
        },
  });

  const handleFormSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 400)); // opcional UX

    const request: Request = {
      id: initialData?.id ?? "REQ-" + uid().toUpperCase(),
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: initialData?.status ?? "pendiente",
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userRequester: currentUser,
      comments: initialData?.comments ?? [],
    };

    const success = await onSubmit(request);

    if (success) {
      toast.success("Solicitud registrada correctamente");
    } else {
      toast.error("Error interno en el flujo de autorizaciones. Contacte al administrador de sistemas.");
    }
  };

  return {
    register,
    errors,
    isSubmitting,
    executeSubmit: handleSubmit(handleFormSubmit),
  };
}
