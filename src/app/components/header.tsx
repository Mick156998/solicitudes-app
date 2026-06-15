"use client";

import { Menu } from "lucide-react";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

import { User } from "@/interfaces/interface";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({
  onToggleSidebar,
}: HeaderProps) {
  const pathname = usePathname();

  const user: User | null =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const getPageTitle = (): string => {
    if (pathname.includes("/dashboard")) {
      return "Dashboard";
    }

    if (pathname.includes("/requests/create")) {
      return "Nueva Solicitud";
    }

    if (pathname.includes("/requests/") && pathname.includes("/edit")) {
      return "Editar Solicitud";
    }

    if (pathname.includes("/requests/") && !pathname.endsWith("/requests")) {
      return "Detalle de Solicitud";
    }

    if (pathname.includes("/requests")) {
      return "Solicitudes";
    }

    return "Sistema de Solicitudes";
  };

  const initials = user ? `${user.name[0]}${user.lastName[0]}` : "--";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-6">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-1.5 rounded-md hover:bg-muted/50 transition-colors text-foreground cursor-pointer"
      >
        <Menu size={18} />
      </button>
      
      <div>
        <h1 className="text-lg font-semibold text-slate-800">
          {getPageTitle()}
        </h1>

        <p className="text-sm text-slate-500">
          Gestión de solicitudes internas
        </p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">
              {user?.name} {user?.lastName}
            </p>

            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
