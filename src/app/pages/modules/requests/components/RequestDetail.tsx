"use client";

import {
  ArrowLeft,
  Edit2,
  MessageSquare,
  Clock,
  User,
  Tag,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react";

import Modal from "@/app/components/Modal";
import { RequestStatus } from "@/types/types";
import { Comment, Request, UserProfile } from "@/interfaces/interface";
import { StatusBadge, PriorityBadge } from "@/app/components/statusBadge";
import { useRequestDetail } from "@/hooks/requests/useRequestDetail";

interface RequestDetailProps {
  onRefresh: () => void;
  user: UserProfile;
  request: Request;
  onBack: () => void;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: RequestStatus) => Promise<boolean>;
  onCommentsChange: (id: string, comments: Comment[]) => Promise<boolean>;
}

const ALL_STATUSES: RequestStatus[] = [
  "pendiente",
  "en_revision",
  "aprobada",
  "rechazada",
  "cerrada",
];

const STATUS_LABELS: Record<RequestStatus, string> = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  cerrada: "Cerrada",
};

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-1">
      <Icon size={15} className="text-muted-foreground mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm text-foreground font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function RequestDetail({
  onRefresh,
  user,
  request,
  onBack,
  onEdit,
  onStatusChange,
  onCommentsChange,
}: RequestDetailProps) {
  const {
    showStatusPanel,
    selectedStatus,
    isMutating,
    isModalOpen,
    commentText,
    setCommentText,
    setSelectedStatus,
    handleToggleStatusPanel,
    handleOpenModal,
    handleCloseModal,
    handleConfirmTransition,
  } = useRequestDetail({
    request,
    user,
    onStatusChange,
    onCommentsChange,
    onRefresh,
  });

  if (!request) return null;

  const requesterName = `${request.userRequester.name} ${request.userRequester.lastName}`;
  const isAdmin = user.role === "Administrador";
  const isClosed = request.status === "cerrada";

  return (
    <div className="space-y-6 bg-white p-10 rounded-xl border border-border shadow-sm max-w-10xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
      >
        <ArrowLeft size={15} />
        Volver a la bandeja
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-4">
        <div>
          <div className="flex gap-2 items-center">
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-2 tracking-tight">
            {request.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {isAdmin && !isClosed && (
            <button
              onClick={handleToggleStatusPanel}
              className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-colors cursor-pointer ${
                showStatusPanel
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-border text-foreground hover:bg-muted/40"
              }`}
            >
              Cambiar estado
            </button>
          )}

          {(isAdmin || request.status === "pendiente") && !isClosed && (
            <button
              onClick={() => onEdit(request.id)}
              className="px-4 py-1.5 text-white rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              style={{
                backgroundColor: "var(--secondary)",
              }}
            >
              <Edit2 size={14} /> Editar
            </button>
          )}
        </div>
      </div>

      {showStatusPanel && (
        <div className="border border-border rounded-lg p-5 bg-slate-50/50 space-y-3 shadow-inner">
          <p className="text-sm font-semibold text-foreground">
            Siguiente estado transaccional:{" "}
            <span className="text-red-600 font-bold">
              {selectedStatus
                ? STATUS_LABELS[selectedStatus]
                : "Seleccione una opción"}
            </span>
          </p>

          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => {
              const isCurrent = s === request.status;
              return (
                <button
                  key={s}
                  disabled={isCurrent}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 text-xs font-semibold border rounded-md transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-slate-200 border-slate-300 text-muted-foreground opacity-60 cursor-not-allowed"
                      : selectedStatus === s
                        ? "border-red-600 bg-red-600 text-white shadow-sm"
                        : "border-border bg-white text-foreground hover:border-slate-400"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              );
            })}
          </div>

          {selectedStatus && (
            <div className="flex gap-3 text-sm pt-2 border-t border-dashed border-border/60">
              <button
                onClick={handleOpenModal}
                className="text-green-600 font-bold hover:underline cursor-pointer"
              >
                Confirmar Flujo
              </button>
              <button
                onClick={() => setSelectedStatus(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metadatos en Columna */}
        <div className="border border-border rounded-xl p-5 space-y-4 bg-slate-50/20 h-fit">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b pb-2">
            Información del Ticket
          </h3>
          <InfoRow
            icon={User}
            label="Solicitante Autorizado"
            value={requesterName}
          />
          <InfoRow
            icon={Building2}
            label="Departamento / Área"
            value={request.userRequester.area.description}
          />
          <InfoRow
            icon={Tag}
            label="Categoría de Servicio"
            value={request.category}
          />
          <InfoRow
            icon={Calendar}
            label="Fecha de Apertura"
            value={formatDateTime(request.createdAt)}
          />
          <InfoRow
            icon={Clock}
            label="Última Auditoría"
            value={formatDateTime(request.updatedAt)}
          />
        </div>

        <div className="lg:col-span-2 space-y-5">
          {/* Tarjeta de Sustento */}
          <div className="border border-border rounded-xl p-5 bg-card">
            <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Sustento del Requerimiento
            </h2>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {request.description}
            </p>
          </div>

          {/* Caja de Historial / Auditoría */}
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="bg-slate-50/60 p-4 border-b border-border flex items-center gap-2 font-bold text-sm text-foreground">
              <MessageSquare size={15} className="text-muted-foreground" />
              Línea de Tiempo y Comentarios ({request.comments.length})
            </div>

            {request.comments.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center italic">
                No se registran comentarios de auditoría en este ticket.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {request.comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 hover:bg-slate-50/20 transition-colors"
                  >
                    <div className="flex justify-between items-center text-xs flex-wrap gap-1">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                          {c.userAuthor.name.charAt(0)}
                        </div>
                        {c.userAuthor.name} {c.userAuthor.lastName ?? ""}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={13} />
                        {formatDateTime(c.createdAt)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2.5 pl-6 leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        title={`Confirmar Cambio de Estado`}
        onClose={handleCloseModal}
      >
        <div className="space-y-3 mt-2">
          <p className="text-xs text-muted-foreground leading-normal">
            Para transicionar el ticket a{" "}
            <span className="font-bold text-foreground uppercase">
              {selectedStatus && STATUS_LABELS[selectedStatus]}
            </span>
            , debe registrar una justificación obligatoria en la bitácora:
          </p>

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full border border-border p-3 rounded-md text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            placeholder="Escriba los motivos del cambio de estado o las observaciones del analista..."
            disabled={isMutating}
          />

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={handleCloseModal}
              disabled={isMutating}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-40"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirmTransition}
              disabled={isMutating || !commentText.trim()}
              className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
              }}
            >
              {isMutating ? "Guardando..." : "Firmar y Cambiar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
