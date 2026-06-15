import { RequestStatus, RequestPriority } from "@/types/types";

type statusConfig = { label: string; className: string }
type priorityConfig = { label: string; className: string }

const statusConfig: Record<RequestStatus, statusConfig> = {
  pendiente: {
    label: 'Pendiente',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  en_revision: {
    label: 'En Revisión',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  aprobada: {
    label: 'Aprobada',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  rechazada: {
    label: 'Rechazada',
    className: 'bg-red-50 text-red-700 border border-red-200',
  },
  cerrada: {
    label: 'Cerrada',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  },
};

const priorityConfig: Record<RequestPriority, priorityConfig> = {
  alta: { label: 'Alta', className: 'bg-red-100 text-red-700' },
  media: { label: 'Media', className: 'bg-amber-100 text-amber-700' },
  baja: { label: 'Baja', className: 'bg-slate-100 text-slate-600' },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${cfg.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const cfg = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
