const USER_METADATA_KEY = "userMetadata";

export function getUserMetadata(userId) {
  try {
    const raw = localStorage.getItem(USER_METADATA_KEY);
    const meta = raw ? JSON.parse(raw) : {};
    return meta[userId] || {};
  } catch (e) {
    console.error("Failed to parse userMetadata", e);
    return {};
  }
}

export function setUserMetadata(userId, data) {
  try {
    const raw = localStorage.getItem(USER_METADATA_KEY);
    const meta = raw ? JSON.parse(raw) : {};
    meta[userId] = { ...meta[userId], ...data, redirectcount: (meta[userId]?.redirectcount || 0) + 1 };
    localStorage.setItem(USER_METADATA_KEY, JSON.stringify(meta));
  } catch (e) {
    console.error("Failed to save userMetadata", e);
  }
}