import { DUMMY_ADMIN } from "@/lib/dummyAdmin";


const USER_KEY = "hospital_admin";

export const authService = {
  login(email: string, password: string) {
    if (
      email === DUMMY_ADMIN.email &&
      password === DUMMY_ADMIN.password
    ) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(DUMMY_ADMIN)
      );

      return DUMMY_ADMIN;
    }

    return null;
  },

  logout() {
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser() {
    if (typeof window === "undefined") return null;

    const user = localStorage.getItem(USER_KEY);

    if (!user) return null;

    return JSON.parse(user);
  },
};