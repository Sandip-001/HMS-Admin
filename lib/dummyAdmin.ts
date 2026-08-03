export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "admin";
}

export const DUMMY_ADMIN = {
  id: 1,
  username: "Hospital Admin",
  email: "admin@hospital.com",
  password: "admin@123",
  role: "admin",
};