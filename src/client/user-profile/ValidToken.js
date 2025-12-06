
export default function isValidOfflineToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    const now = Date.now() / 1000; // JWT exp is in seconds
    return payload.exp > now;
  } catch (e) {
    console.warn("Invalid token format", e);
    return false;
  }
}