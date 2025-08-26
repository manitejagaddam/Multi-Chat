import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Helper to throw if response not ok
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    console.error("❌ API Error:", res.status, text); // 🔍 Debug line
    throw new Error(`${res.status}: ${text}`);
  }
}

// General API request function
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const fullUrl = `${API_BASE}${url}`;
  console.log(`📡 [API Request] ${method} ${fullUrl}`, data || ""); // 🔍 Debug line

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  console.log("📩 [API Response]", res.status, res.statusText); // 🔍 Debug line

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const fullUrl = `${API_BASE}${queryKey.join("/")}`;
    console.log("📡 [QueryFn] GET", fullUrl); // 🔍 Debug line

    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    console.log("📩 [QueryFn Response]", res.status, res.statusText); // 🔍 Debug line

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.warn("⚠️ Unauthorized 401, returning null"); // 🔍 Debug line
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
