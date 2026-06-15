export type RequestStatus =
  | "pendiente"
  | "en_revision"
  | "aprobada"
  | "rechazada"
  | "cerrada";
export type RequestPriority = "alta" | "media" | "baja";
export type RequestCategory =
  | "Hardware"
  | "Software"
  | "Acceso"
  | "Infraestructura"
  | "Compras"
  | "Otros";

export type Role = "Administrador" | "Usuario";
