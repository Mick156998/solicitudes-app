"use client";

import RequestDetail from "../components/RequestDetail";
import { useRequestDetailPage } from "@/hooks/requests/useRequestDetailPage";
import { Loader } from "@/app/components/Loader";

export default function RequestDetailPage() {
  const {
    user,
    request,
    loading,
    refreshRequest,
    handleBack,
    handleEdit,
    handleStatusChange,
    handleCommentsChange,
  } = useRequestDetailPage();

  if (loading || !request || !user) {
    return (
      <div className="py-20">
        <Loader text="Abriendo canal seguro de auditoría..." color="border-red-600" />
      </div>
    );
  }

  return (
    <RequestDetail
      onRefresh={refreshRequest}
      user={user}
      request={request}
      onBack={handleBack}
      onEdit={handleEdit}
      onStatusChange={handleStatusChange}
      onCommentsChange={handleCommentsChange}
    />
  );
}