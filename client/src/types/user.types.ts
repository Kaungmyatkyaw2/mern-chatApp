export interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  password: string;
  createdAt: Date;
}

