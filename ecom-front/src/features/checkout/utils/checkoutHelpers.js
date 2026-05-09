export const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const digitsOnly = (value) => value.replace(/\D/g, "");

export const validateCardNumber = (cardNumber) => {
  const clean = digitsOnly(cardNumber);
  if (clean.length < 13 || clean.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i -= 1) {
    let digit = Number(clean[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const buildAddressLabel = (address) => {
  const parts = [
    address?.street,
    address?.buildingName,
    address?.city,
    address?.state,
    address?.country,
  ].filter(Boolean);
  return parts.join(", ");
};
