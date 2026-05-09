const AUTH_STORAGE_KEY = "auth";
const AUTH_TOKEN_STORAGE_KEY = "authToken";

const normalizeToken = (token) => {
  if (!token) return null;
  return String(token).replace(/^Bearer\s+/i, "").trim() || null;
};

const isObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseStoredAuth = (rawAuth) => {
  if (!rawAuth) return null;
  try {
    const parsed = JSON.parse(rawAuth);
    return isObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const extractAuthToken = (payload) => {
  if (!isObject(payload)) return null;

  const directToken =
    payload.token ||
    payload.jwt ||
    payload.jwtToken ||
    payload["jwt-token"] ||
    payload.accessToken ||
    payload.authToken;

  if (directToken) return normalizeToken(directToken);

  const nestedToken =
    payload.user?.token ||
    payload.user?.jwt ||
    payload.user?.jwtToken ||
    payload.user?.["jwt-token"] ||
    payload.user?.accessToken ||
    payload.user?.authToken ||
    payload.data?.token ||
    payload.data?.jwt ||
    payload.data?.jwtToken ||
    payload.data?.["jwt-token"] ||
    payload.data?.accessToken ||
    payload.data?.authToken ||
    payload.data?.user?.token ||
    payload.data?.user?.jwt ||
    payload.data?.user?.jwtToken ||
    payload.data?.user?.["jwt-token"] ||
    payload.data?.user?.accessToken ||
    payload.data?.user?.authToken;

  return normalizeToken(nestedToken);
};

export const getStoredAuth = () => {
  if (typeof window === "undefined") return null;
  return parseStoredAuth(window.localStorage.getItem(AUTH_STORAGE_KEY));
};

export const getStoredAuthToken = () => {
  if (typeof window === "undefined") return null;

  const fromTokenKey = normalizeToken(
    window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  );
  if (fromTokenKey) return fromTokenKey;

  const authPayload = getStoredAuth();
  const resolvedToken = extractAuthToken(authPayload);
  if (resolvedToken) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, resolvedToken);
  }
  return resolvedToken;
};

export const persistAuthSession = (authPayload) => {
  if (typeof window === "undefined") return null;
  if (!isObject(authPayload)) return null;

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));
  const token = extractAuthToken(authPayload);
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
  return token;
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};
