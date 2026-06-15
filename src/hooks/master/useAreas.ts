"use client";

import { useEffect, useState } from "react";
import { Area } from "@/interfaces/interface";
import { areaService } from "@/services/master.service";

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const loadAreas = async () => {
    try {
      setLoadingAreas(true);
      const data = await areaService.getAll();
      setAreas(data);
    } catch (error) {
      console.error("Error al obtener los datos maestros", error);
    } finally {
      setLoadingAreas(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  return {
    areas,
    loadingAreas,
    loadAreas,
  };
}