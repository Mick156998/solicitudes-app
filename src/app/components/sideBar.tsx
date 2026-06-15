"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

import {
  LayoutDashboard,
  Inbox,
  PlusCircle,
  Users,
  Building2,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from "lucide-react";

import { User } from "@/interfaces/interface";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const user: User | null =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const isAdmin = user?.role === "Administrador";

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
      adminOnly: true,
    },
    {
      label: "Solicitudes",
      href: ROUTES.REQUESTS,
      icon: Inbox,
    },
    {
      label: "Nueva Solicitud",
      href: ROUTES.REQUEST_CREATE,
      icon: PlusCircle,
    },
  ];

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    router.replace(ROUTES.LOGIN);
  };

  const initials = user ? `${user.name[0]}${user.lastName[0]}` : "--";

  return (
    <>
      
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 flex h-full w-64 flex-col transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:flex
        `}
        style={{
          backgroundColor: "var(--sidebar)",
          color: "var(--sidebar-foreground)",
        }}
      >
        <div
          className="flex items-center gap-3 border-b px-5 py-5"
          style={{
            borderColor: "var(--sidebar-border)",
          }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "var(--sidebar-primary)",
            }}
          >
            <Building2 size={16} color="white" />
          </div>

          <div>
            <div className="text-sm font-semibold leading-tight">Gestor de</div>

            <div className="text-sm font-semibold leading-tight">
              Solicitudes
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="px-3 py-2 text-xs uppercase tracking-wider opacity-50">
            Menú Principal
          </p>

          {navItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`
                      flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors
                      ${
                        isActive
                          ? "font-medium text-white"
                          : "opacity-70 hover:opacity-100"
                      }
                    `}
                  style={
                    isActive
                      ? {
                          backgroundColor: "var(--sidebar-primary)",
                        }
                      : {}
                  }
                >
                  <Icon size={16} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
        </nav>

        <div
          className="border-t px-3 py-4"
          style={{
            borderColor: "var(--sidebar-border)",
          }}
        >
          <div className="mb-3 flex items-center gap-3 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {initials}
            </div>

            <div>
              <div className="text-xs font-medium">
                {user?.name} {user?.lastName}
              </div>

              <div className="text-xs opacity-50">{user?.role}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-300 hover:bg-white/5 cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
