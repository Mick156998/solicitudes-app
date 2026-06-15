"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-sm font-semibold text-foreground p-4 rounded" style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)"
          }}>
            {title}
          </h2>
        )}

        <div className="p-4 space-y-4">
            {children}
        </div>

      </div>
    </div>
  );
}