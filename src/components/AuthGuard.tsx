"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          router.push("/login"); // Redirect to login if no token
          return;
        }

        // Call the /user/me endpoint to validate the token
        const response = await fetch("http://192.168.68.154:8000/api/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const userData = await response.json();

        setIsAuthenticated(true);
        setUserRole(userData.role); // Assume `role` is returned by /user/me
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("authToken"); // Clear invalid token
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Role-based route protection
  useEffect(() => {
    if (userRole) {
      if (
        pathname.startsWith("/admin") &&
        userRole !== "admin"
      ) {
        router.push("/unauthorized"); // Redirect unauthorized users
      } else if (
        pathname.startsWith("/dispatcher") &&
        userRole !== "dispatcher"
      ) {
        router.push("/unauthorized");
      }
    }
  }, [userRole, pathname, router]);

  if (!isAuthenticated) {
    return null; // Show a loader or nothing until authentication is resolved
  }

  return <>{children}</>;
};

export default AuthGuard;
