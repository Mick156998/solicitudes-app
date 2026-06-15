const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error("Error en la petición");
    }

    return response.json();
  },

  post: async <TResponse, TBody>(
    endpoint: string,
    body: TBody,
  ): Promise<TResponse> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error en la petición");
    }

    return response.json();
  },

  put: async <TResponse, TBody>(
    endpoint: string,
    body: TBody,
  ): Promise<TResponse> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error en la petición");
    }

    return response.json();
  },

  patch: async <TResponse, TBody>(
    endpoint: string,
    body: TBody,
  ): Promise<TResponse> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error en la petición");
    }

    return response.json();
  },

  delete: async (endpoint: string): Promise<void> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error en la petición");
    }
  },
};
