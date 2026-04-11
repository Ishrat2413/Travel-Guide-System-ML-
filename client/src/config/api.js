const normalizeBaseUrl = (url, fallback) => {
  const base = (url || fallback || "").trim();
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

export const NODE_API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_NODE_API_URL,
  "https://travel-guide-system-ml.onrender.com",
);

export const ML_API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_ML_API_URL,
  "https://travel-guide-system-ml-1.onrender.com",
);
