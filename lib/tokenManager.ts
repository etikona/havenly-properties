// lib/tokenManager.ts
export const TokenManager = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;

    // Check cookie first
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (cookieToken) return cookieToken;

    // Fallback to localStorage
    return localStorage.getItem("adminToken");
  },

  setToken(token: string, days: number = 7) {
    if (typeof window === "undefined") return;

    // Set cookie
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `adminToken=${token};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

    // Set localStorage
    localStorage.setItem("adminToken", token);
    localStorage.setItem("tokenExpiry", expires.toISOString());
  },

  removeToken() {
    if (typeof window === "undefined") return;

    // Remove cookie
    document.cookie =
      "adminToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";

    // Remove localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("adminUser");
  },

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry) return true; // If no expiry set, assume valid

    return new Date(expiry) > new Date();
  },

  getTokenExpiryDate(): Date | null {
    const expiry = localStorage.getItem("tokenExpiry");
    return expiry ? new Date(expiry) : null;
  },

  getRemainingDays(): number | null {
    const expiryDate = this.getTokenExpiryDate();
    if (!expiryDate) return null;

    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
};
