"use client";

import RequestFormPage from "../components/RequestForm";
import { useCreateRequest } from "@/hooks/requests/useCreateRequestPage";
import { Loader } from "@/app/components/Loader";

export default function CreateRequestPage() {
  const { user, createRequest, handleBack } = useCreateRequest();

  if (!user) {
    return (
      <div className="py-20">
        <Loader
          text="Inicializando formulario seguro..."
          color="border-red-600"
        />
      </div>
    );
  }

  return (
    <RequestFormPage
      mode="create"
      currentUser={user}
      onBack={handleBack}
      onSubmit={createRequest}
    />
  );
}
