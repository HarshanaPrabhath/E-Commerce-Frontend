const readJson = (key, fallbackValue) => {
  if (typeof window === "undefined") return fallbackValue;
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) return fallbackValue;
    const parsed = JSON.parse(rawValue);
    return parsed ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
};

export const extractOrdersList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  if (Array.isArray(payload.content)) return payload.content;
  if (Array.isArray(payload.orders)) return payload.orders;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && Array.isArray(payload.data.orders)) return payload.data.orders;
  if (payload.data && Array.isArray(payload.data.content)) return payload.data.content;

  return [];
};

export const resolveCurrentUserId = (reduxUser) => {
  const authData = readJson("auth", null);
  const storedUser = authData?.user && typeof authData.user === "object"
    ? authData.user
    : authData;

  return (
    reduxUser?.userId ??
    reduxUser?.id ??
    storedUser?.userId ??
    storedUser?.id ??
    null
  );
};

export const resolveCurrentUserEmail = (reduxUser) => {
  const authData = readJson("auth", null);
  const storedUser =
    authData?.user && typeof authData.user === "object" ? authData.user : authData;
  const email =
    reduxUser?.email ??
    reduxUser?.user?.email ??
    storedUser?.email ??
    storedUser?.user?.email ??
    null;

  return email ? String(email).trim().toLowerCase() : null;
};

export const resolveOrderUserId = (order) =>
  order?.userId ?? order?.user?.userId ?? order?.user?.id ?? null;

export const resolveOrderEmail = (order) => {
  const email =
    order?.email ??
    order?.billingEmail ??
    order?.user?.email ??
    order?.customer?.email ??
    null;
  return email ? String(email).trim().toLowerCase() : null;
};

export const resolveOrderId = (order) =>
  order?.orderId ??
  order?.id ??
  order?._id ??
  `${order?.createdAt || order?.orderDate || "order"}-${resolveOrderUserId(order) || "guest"}`;

export const resolveOrderTotal = (order) =>
  Number(order?.total ?? order?.totalAmount ?? order?.grandTotal ?? 0);

export const resolveOrderItems = (order) =>
  Array.isArray(order?.items)
    ? order.items
    : Array.isArray(order?.orderItems)
      ? order.orderItems
      : Array.isArray(order?.orderItemDTOS)
        ? order.orderItemDTOS
        : [];

export const resolveOrderDate = (order) =>
  order?.createdAt ?? order?.orderDate ?? order?.date ?? null;

export const resolveOrderStatus = (order) =>
  order?.status ?? order?.orderStatus ?? "Processing";
