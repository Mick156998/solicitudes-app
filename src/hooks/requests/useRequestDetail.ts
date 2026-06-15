"use client";

import { useState } from "react";
import { v4 as uid } from "uuid";
import { RequestStatus } from "@/types/types";
import { Comment, Request, UserProfile } from "@/interfaces/interface";
import { toast } from "sonner";

interface UseRequestDetailProps {
  request: Request;
  user: UserProfile;
  onStatusChange: (id: string, status: RequestStatus) => Promise<boolean>;
  onCommentsChange: (id: string, comments: Comment[]) => Promise<boolean>;
  onRefresh: () => void;
}

export function useRequestDetail({
  request,
  user,
  onStatusChange,
  onCommentsChange,
  onRefresh,
}: UseRequestDetailProps) {
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(
    null,
  );
  const [isMutating, setIsMutating] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleOpenModal = () => {
    if (selectedStatus) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCommentText("");
  };

  const handleConfirmTransition = async () => {
    if (!commentText.trim() || !selectedStatus) return;

    try {
      setIsMutating(true);

      const updatedComments: Comment[] = [
        ...request.comments,
        {
          id: "COM-" + uid().toUpperCase(),
          text: commentText.trim(),
          userAuthor: user,
          createdAt: new Date().toISOString(),
        },
      ];

      const commentsSuccess = await onCommentsChange(
        request.id,
        updatedComments,
      );

      if (commentsSuccess) {
        const statusSuccess = await onStatusChange(request.id, selectedStatus);

        if (statusSuccess) {
          setIsModalOpen(false);
          setCommentText("");
          setSelectedStatus(null);
          setShowStatusPanel(false);

          onRefresh();
          toast.success("Transacción procesada correctamente.");
        } else {
          toast.error("Error interno en el flujo de autorizaciones. Contacte al administrador de sistemas.");
        }

      } else {
        toast.error("Error interno en el registro de la sustentación del flujo. Contacte al administrador de sistemas.");
      }
    } catch (error) {
      console.error("Error en la transición de estados de la solicitud:",error,);
      toast.error("Error interno en el procesamiento de los datos. Contacte al administrador de sistemas.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleToggleStatusPanel = () => {
    setShowStatusPanel((prev) => !prev);
    setSelectedStatus(null);
  };

  return {
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
  };
}
