import { User } from "./user.types";

export interface QueryResponse<T> {
  status: string;
  results: T extends [] ? number : undefined;
  data: T;
}

export interface LoginReturnType {
  status: string;
  token: string;
  data: User;
}
