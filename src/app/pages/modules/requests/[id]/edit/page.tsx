"use client";

import RequestFormPage from "../../components/RequestForm";
import { useEditRequest } from "@/hooks/requests/useEditRequestPage";
import { Loader } from "@/app/components/Loader";

export default function EditRequestPage() {
  const {
    request,
    loading,
    updateRequest,
    handleBack,
  } = useEditRequest();

  if (loading) {
    return (
      <div className="py-20">
        <Loader
          text="Recuperando información de la solicitud..."
          color="border-red-600"
        />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-10 text-center border border-dashed rounded-xl max-w-2xl bg-white space-y-3">
        <p className="text-sm text-muted-foreground font-medium">
          No se encontró el registro solicitado o no cuenta con los permisos necesarios.
        </p>

        <button
          onClick={handleBack}
          className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
        >
          Regresar a la bandeja
        </button>
      </div>
    );
  }

  return (
    <RequestFormPage
      mode="edit"
      initialData={request}
      currentUser={request.userRequester}
      onBack={handleBack}
      onSubmit={updateRequest}
    />
  );
}