import axios, { AxiosHeaders, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import backendURL from "./backend";
import Cookies from "js-cookie";
import { cookieData } from "./cookieData";

/**
 * Must match backend `API_ACCESS_TOKEN` / `INHOUSE_API_ACCESS_TOKEN`.
 * Server-only: in the browser this is empty, and middleware.ts adds the
 * header when it forwards /api/backend/* to the backend.
 */
function getApiAccessToken(): string {
  if (typeof window !== "undefined") return "";
  return (process.env.INHOUSE_API_ACCESS_TOKEN ?? "").trim();
}

/** Header the backend reads (override with API_ACCESS_HEADER). */
function getApiAccessHeaderName(): string {
  return (process.env.API_ACCESS_HEADER ?? "X-Inhouse-Access-Token").trim();
}

export function getBackendApiAccessHeaders(): Record<string, string> {
  const token = getApiAccessToken();
  const name = getApiAccessHeaderName();
  if (!token || !name) return {};
  return { [name]: token };
}

export function getBackendJsonFetchHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...getBackendApiAccessHeaders(),
  };
}

function normalizeBase(url: string): string {
  return url.trim().replace(/\/$/, "");
}

export function publicBackendJsonAxiosConfig(
  overrides?: AxiosRequestConfig
): AxiosRequestConfig {
  const extraHeaders =
    overrides?.headers &&
    typeof overrides.headers === "object" &&
    !(overrides.headers instanceof AxiosHeaders)
      ? (overrides.headers as Record<string, string>)
      : {};

  return {
    baseURL: backendURL,
    timeout: 12_000,
    ...overrides,
    headers: {
      ...getBackendJsonFetchHeaders(),
      ...extraHeaders,
    },
  };
}

type BackendAxiosConfigOptions = {
  type?: "application/json" | "multipart/form-data";
};

const backendAxiosConfig = (options?: BackendAxiosConfigOptions) => {
  const userToken = Cookies.get(cookieData.login.name);
  const accessHeaders = getBackendApiAccessHeaders();
  const contentType = options?.type ? options.type : "application/json";

  const config: AxiosRequestConfig = {
    baseURL: backendURL,
    headers: {
      "Content-Type": contentType,
      ...accessHeaders,
    },
  };

  if (userToken) {
    Object.assign(config, {
      headers: {
        "Content-Type": contentType,
        ...accessHeaders,
        Authorization: `Bearer ${userToken}`,
      },
    });
  }

  return config;
};

/**
 * Multipart config that lets axios set the boundary automatically.
 * Manually setting `Content-Type: multipart/form-data` without a boundary
 * can drop nested fields like uploadLocation on the server.
 */
export function backendMultipartAxiosConfig(): AxiosRequestConfig {
  const config = backendAxiosConfig({ type: "multipart/form-data" });
  if (config.headers && typeof config.headers === "object") {
    delete (config.headers as Record<string, string>)["Content-Type"];
  }
  return config;
}

export default backendAxiosConfig;

let backendAccessInterceptorAttached = false;

function attachBackendAccessInterceptor() {
  if (backendAccessInterceptorAttached) return;
  backendAccessInterceptorAttached = true;

  axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const expected = normalizeBase(backendURL);
    if (!expected) return config;

    const base = normalizeBase(String(config.baseURL ?? ""));
    if (base !== expected) return config;

    const pairs = getBackendApiAccessHeaders();
    if (!Object.keys(pairs).length) return config;

    if (!config.headers) {
      config.headers = new AxiosHeaders(pairs);
      return config;
    }
    if (config.headers instanceof AxiosHeaders) {
      for (const [key, value] of Object.entries(pairs)) {
        if (!config.headers.has(key)) config.headers.set(key, value);
      }
      return config;
    }
    Object.assign(config.headers as Record<string, string>, pairs);
    return config;
  });
}

attachBackendAccessInterceptor();
