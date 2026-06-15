import { Role } from "../types/types";
import { Area } from "./interface";

export interface Login {
  user: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  lastName: string;
  area: Area;
  role: Role;
}