"use client";

import { AppLayout } from "@/app/components/appLayout";
import "@/styles/theme.css";
import { useSession } from "@/hooks/auth/useSession";
import { Toaster } from "sonner";

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useSession();

  if (loading) return <p>Cargando sistema...</p>;

  return (
    <>
      <Toaster richColors position="top-right" />
      <AppLayout>{children}</AppLayout>
    </>
  );
}