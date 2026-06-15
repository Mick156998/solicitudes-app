import { api } from "./api";
import { Area } from "@/interfaces/interface";

export const areaService = {
  getAll: async (): Promise<Area[]> => {
    return api.get<Area[]>("/areas");
  },
};
