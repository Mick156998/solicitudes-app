"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Clock,
  Search,
  CheckCircle,
  XCircle,
  Archive,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { RequestStatus } from "@/types/types";
import { StatusBadge } from "@/app/components/statusBadge";
import { useDashboard } from "@/hooks/dashboard/useDashboardPage";
import { Loader } from "@/app/components/Loader";

const STATUS_META: Record<
  RequestStatus,
  {
    label: string;
    icon: React.FC<{ size?: number; className?: string }>;
    color: string;
    bg: string;
  }
> = {
  pendiente: { label: "Pendiente", icon: Clock, color: "#f59e0b", bg: "#fffbeb" },
  en_revision: { label: "En Revisión", icon: Search, color: "#3b82f6", bg: "#eff6ff" },
  aprobada: { label: "Aprobada", icon: CheckCircle, color: "#10b981", bg: "#ecfdf5" },
  rechazada: { label: "Rechazada", icon: XCircle, color: "#ef4444", bg: "#fef2f2" },
  cerrada: { label: "Cerrada", icon: Archive, color: "#64748b", bg: "#f1f5f9" },
};

export default function DashboardPage() {
  const {
    loading,
    counts,
    pieData,
    categoryData,
    urgentRequests,
    recentRequests,
  } = useDashboard(STATUS_META);

  if (loading) {
    return (
      <div className="py-20">
        <Loader text="Construyendo paneles analíticos corporativos..." color="border-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-10 rounded-xl border border-border/60 shadow-sm mx-auto">
      
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard de Gestión</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Resumen general y métricas de rendimiento de solicitudes internas
        </p>
      </div>

      {urgentRequests.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50/70 animate-fadeIn">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-900 leading-normal">
            Se identificaron <span className="font-bold">{urgentRequests.length} solicitud{urgentRequests.length > 1 ? "es" : ""}</span> con 
            prioridad <span className="font-bold uppercase text-amber-700">alta</span> que requieren atención o asignación inmediata de recursos.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {(Object.entries(STATUS_META) as [RequestStatus, typeof STATUS_META[RequestStatus]][]).map(([key, meta]) => {
          const Icon = meta.icon;
          const count = counts[key];
          return (
            <div
              key={key}
              className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: meta.bg }}
                >
                  <Icon size={16} />
                </div>
                <span className="text-2xl font-bold text-foreground tracking-tight">
                  {count}
                </span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{meta.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-3">
            <TrendingUp size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Distribución Total por Estado
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={160} className="sm:max-w-[50%]">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} className="focus:outline-none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 w-full flex-1">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between border-b border-slate-50 pb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-medium text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground bg-slate-50 px-2 py-0.5 rounded-md border">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-3">
            <TrendingUp size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Volumen Técnico por Categoría
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#64748b", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Bar dataKey="total" fill="#0f172a" radius={[4, 4, 0, 0]} name="Solicitado" maxBarSize={25} />
              <Bar dataKey="aprobadas" fill="#10b981" radius={[4, 4, 0, 0]} name="Aprobado" maxBarSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Monitor de Actividad Reciente (Últimos Cambios)
          </h3>
        </div>
        <div className="divide-y divide-border">
          {recentRequests.map((req) => (
            <div
              key={req.id}
              className="w-full flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-slate-50/40 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {req.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  <span className="text-slate-700 font-bold">{req.id}</span> · {req.userRequester.name} {req.userRequester.lastName} · <span className="underline decoration-slate-200">{req.category}</span>
                </p>
              </div>
              <div className="shrink-0">
                <StatusBadge status={req.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}