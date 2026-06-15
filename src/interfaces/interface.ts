import { RequestStatus, RequestPriority, RequestCategory, Role } from "../types/types";

export type Area = {
  id: number;
  description: string;
};

export interface UserProfile { //Datos generales del usuario para el publico
  id: number;
  name: string;
  lastName: string;
  area: Area;
  role: Role;
}

export interface User extends UserProfile {  //Datos generales del usuario para validación de credenciales
  user: string;
  password: string;
}

export interface Comment {
  id: string;
  text: string;
  userAuthor: UserProfile;
  createdAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  userRequester: UserProfile;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
