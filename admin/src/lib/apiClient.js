import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

if (typeof window !== "undefined") {
  const token = window.localStorage?.getItem("hft_admin_token");
  if (token) apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export const unwrap = (response) => {
  const body = response?.data;
  if (body && typeof body === "object" && "data" in body) return body.data;
  return body;
};

export const extractApiError = (error, fallback = "Something went wrong.") => {
  const body = error?.response?.data;
  const message = body?.message || error?.message || fallback;
  const details = Array.isArray(body?.details) ? body.details : null;
  return { message, details };
};

export default apiClient;
