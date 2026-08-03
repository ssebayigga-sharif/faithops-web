/**
 * firebase.client.ts
 *
 * Axios instance pre-configured for Firebase Realtime Database REST API.
 *
 * Firebase REST rules:
 *  - Every endpoint is  <BASE_URL>/<path>.json
 *  - GET    → read a node (returns object | null)
 *  - POST   → push a new child (returns { name: "<auto-id>" })
 *  - PUT    → overwrite a node entirely
 *  - PATCH  → shallow-merge into a node
 *  - DELETE → remove a node
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { FirebaseApiError } from "../types";

export const FIREBASE_BASE_URL =
  "https://my-church-9abc5-default-rtdb.firebaseio.com";

// If you add Firebase Auth later, set this env var and the interceptor below
// will attach ?auth=<token> to every request automatically.
const AUTH_TOKEN = import.meta.env.VITE_FIREBASE_DB_SECRET ?? "";

export const firebaseClient: AxiosInstance = axios.create({
  baseURL: FIREBASE_BASE_URL,
  // Firebase REST responses are always JSON
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

import { getFirebaseAuth } from "./firebase";

firebaseClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (AUTH_TOKEN) {
      config.params = { ...config.params, auth: AUTH_TOKEN };
    } else {
      try {
        const auth = getFirebaseAuth();
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          config.params = { ...config.params, auth: token };
        }
      } catch (err) {
        console.error("Failed to attach ID token to request", err);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(normaliseError(error)),
);

firebaseClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(normaliseError(error)),
);

export function normaliseError(error: unknown): FirebaseApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;

    // Firebase returns { error: "..." } on 401 / rules failure
    const firebaseMsg =
      (error.response?.data as { error?: string })?.error ?? null;

    const message =
      firebaseMsg ??
      error.message ??
      `Request failed${status ? ` with status ${status}` : ""}`;

    return { message, status, raw: error };
  }

  if (error instanceof Error) {
    return { message: error.message, status: null, raw: error };
  }

  return {
    message: "An unknown error occurred.",
    status: null,
    raw: error,
  };
}

export function isFirebaseApiError(e: unknown): e is FirebaseApiError {
  return (
    typeof e === "object" &&
    e !== null &&
    "message" in e &&
    "status" in e &&
    "raw" in e
  );
}
