"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/auth";
import { useSession } from "@/hooks/auth/useSession";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import Image from "next/image";
import Scotiabank_logo from "@/assets/image/Logo_Scotiabank.png";

export default function LoginPage() {
  const { login } = useAuth();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const isAuth = useSession();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!user.trim()) {
      setError("Ingrese el usuario");
      return;
    }

    if (!password.trim()) {
      setError("Ingrese la contraseña");
      return;
    }

    try {
      setLoading(true);
      await login(user, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="flex h-12 w-full items-center justify-center px-4">
          <Image
            src={Scotiabank_logo}
            alt="Logo Scotiabank"
            width={240}
            height={35}
            className="object-contain mb-5"
          />
        </div>
        <h1 className="mb-6 text-center text-3xl font-bold">
          Sistema de Solicitudes
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-">Usuario</label>

            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block">Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border p-3"
            />
          </div>

          {error && (
            <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-red-600 p-3 text-white cursor-pointer"
          >
            {loading ? "Validando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
