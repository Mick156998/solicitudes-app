"use client";

import { ArrowLeft, AlertCircle } from "lucide-react";
import { RequestCategory, RequestPriority } from "@/types/types";
import { Request, UserProfile } from "@/interfaces/interface";
import { useRequestForm } from "@/hooks/requests/useRequestForm";

interface RequestFormProps {
  mode: "create" | "edit";
  initialData?: Request;
  currentUser: UserProfile;
  onBack: () => void;
  onSubmit: (data: Request) => Promise<boolean>;
}

const CATEGORIES: RequestCategory[] = [
  "Hardware",
  "Software",
  "Acceso",
  "Infraestructura",
  "Compras",
  "Otros",
];

const PRIORITIES: RequestPriority[] = ["alta", "media", "baja"];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
      <AlertCircle size={12} /> {message}
    </p>
  );
}

export default function RequestFormPage({
  mode,
  initialData,
  currentUser,
  onBack,
  onSubmit,
}: RequestFormProps) {
  const { register, errors, isSubmitting, executeSubmit } = useRequestForm({
    initialData,
    currentUser,
    onSubmit,
  });

  const isDisabled = isSubmitting;

  const inputCls = (hasError?: boolean) =>
    `w-full px-3 py-2 rounded-md border text-sm transition-all focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-400 focus:ring-red-400/20 bg-red-50/10"
        : "border-border bg-card text-foreground"
    }`;

  return (
    <div className="max-w-2xl space-y-4 bg-white p-10 rounded-xl shadow-sm border border-border/50">
      <button
        onClick={onBack}
        disabled={isDisabled}
        className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer"
      >
        <ArrowLeft size={15} /> Volver
      </button>

      <h1 className="text-xl font-bold">
        {mode === "create" ? "Nueva Solicitud" : `Editar ${initialData?.id}`}
      </h1>

      <form
        onSubmit={executeSubmit}
        className="space-y-4 border p-6 rounded-lg bg-slate-50/30"
      >
        <div>
          <label>Título</label>
          <input 
            {...register("title", { required: "Obligatorio" })}
            className={inputCls(!!errors.title)}
            disabled={isDisabled}
          />
          <FieldError message={errors.title?.message} />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            {...register("description", { required: "Obligatorio" })}
            className={inputCls(!!errors.description)}
            disabled={isDisabled}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Categoría
          </label>

          <div className="relative">
            <select
              {...register("category")}
              disabled={isDisabled}
              className="w-full px-3 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>

              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Prioridad
          </label>

          <div className="relative">
            <select
              {...register("priority")}
              disabled={isDisabled}
              className="w-full px-3 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
            >
              <option value="" disabled>
                Selecciona prioridad
              </option>

              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p === "alta" && "Alta"}
                  {p === "media" && "Media"}
                  {p === "baja" && "Baja"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting
            ? "Enviando..."
            : mode === "create"
              ? "Crear Solicitud"
              : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
