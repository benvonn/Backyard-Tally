const USER_METADATA_KEY = "userMetadata";

interface UserMetadata {
  hasCompletedInitialLogin?: boolean;
  hasSeenTutorial?: boolean;
  redirectcount?: number;
  [key: string]: any;
}

interface MetadataStore {
  [userId: string]: UserMetadata;
}

export function getUserMetadata(userId: string | number): UserMetadata {
  try {
    const raw = localStorage.getItem(USER_METADATA_KEY);
    const meta: MetadataStore = raw ? JSON.parse(raw) : {};
    return meta[userId] || {};
  } catch (e) {
    console.error("Failed to parse userMetadata", e);
    return {};
  }
}

export function setUserMetadata(userId: string | number, data: Partial<UserMetadata>): void {
  try {
    const raw = localStorage.getItem(USER_METADATA_KEY);
    const meta: MetadataStore = raw ? JSON.parse(raw) : {};
    meta[userId] = { ...meta[userId], ...data, redirectcount: (meta[userId]?.redirectcount || 0) + 1 };
    localStorage.setItem(USER_METADATA_KEY, JSON.stringify(meta));
  } catch (e) {
    console.error("Failed to save userMetadata", e);
  }
}