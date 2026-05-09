const CONTACT_MESSAGES_KEY = "contactMessages";

const parseMessages = (rawValue) => {
  if (!rawValue) return [];
  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getContactMessages = () => {
  if (typeof window === "undefined") return [];
  return parseMessages(window.localStorage.getItem(CONTACT_MESSAGES_KEY));
};

export const saveContactMessage = (payload) => {
  if (typeof window === "undefined") return null;
  const messages = getContactMessages();
  const nextMessage = {
    id: `msg-${Date.now()}`,
    name: String(payload?.name || "").trim(),
    email: String(payload?.email || "").trim().toLowerCase(),
    message: String(payload?.message || "").trim(),
    createdAt: new Date().toISOString(),
  };

  const nextMessages = [nextMessage, ...messages];
  window.localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(nextMessages));
  return nextMessage;
};

