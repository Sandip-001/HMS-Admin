"use client";

import { Provider } from "react-redux";
import { store } from "./store";

import {
  useAppDispatch,
  useAppSelector,
} from "./hooks";

import {
  fetchCurrentUser,
} from "./thunks/authThunks";

import {
  useEffect,
} from "react";

import {
  useRouter,
  usePathname,
} from "next/navigation";

function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const pathname = usePathname();

  const { user, initialized } =
    useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!initialized) return;

    const isLogin =
      pathname === "/login" ||
      pathname === "/";

    if (!user && !isLogin) {
      router.replace("/login");
    }

    if (user && isLogin) {
      router.replace("/pharmacy/dashboard");
    }
  }, [
    initialized,
    user,
    pathname,
    router,
  ]);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking Session...
      </div>
    );
  }

  return children;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthGate>{children}</AuthGate>
    </Provider>
  );
}