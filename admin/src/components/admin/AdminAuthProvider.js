"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  adminLogin,
  getAdminProfile,
  getStoredAdminToken,
  setAdminToken,
} from "@/services/adminService";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = getStoredAdminToken();
      if (!token) {
        setBooting(false);
        return;
      }

      setAdminToken(token);
      const result = await getAdminProfile();
      if (!result.success) {
        setAdminToken(null);
        setBooting(false);
        return;
      }

      setAdmin(result.data);
      setBooting(false);
    };

    init();
  }, []);

  const value = useMemo(
    () => ({
      admin,
      booting,
      isAuthenticated: Boolean(admin),
      async login(credentials) {
        const result = await adminLogin(credentials);
        if (result.success) setAdmin(result.data.admin);
        return result;
      },
      logout() {
        setAdminToken(null);
        setAdmin(null);
      },
    }),
    [admin, booting]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
