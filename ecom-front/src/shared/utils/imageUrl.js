const IMAGE_PROXY_PREFIX_PATTERN =
  /^https?:\/\/localhost:5000\/images\/(https?:\/\/.+)$/i;

export const normalizeImageUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const matched = raw.match(IMAGE_PROXY_PREFIX_PATTERN);
  if (matched?.[1]) {
    return matched[1];
  }

  return raw;
};

export default normalizeImageUrl;
