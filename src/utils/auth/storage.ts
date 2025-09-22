/**
 * Authentication Token Storage Module
 *
 * Provides secure client-side token management with encryption, expiration handling,
 * and cross-tab synchronization. All functions include proper error handling and
 * SSR-safe checks for server-side rendering compatibility.
 */

/** Storage keys for token persistence */
const STORAGE_KEY = "access-token";
const EXPIRY_KEY = "token-expires-at";
const SALT = "_sakyi_salt_v1";

/**
 * Encrypts a token using base64 encoding with salt
 *
 * @param token - The raw authentication token to encrypt
 * @returns The encrypted token string, or original token if window is undefined (SSR)
 */
export const encryptToken = (token: string): string => {
  if (globalThis.window === undefined) return token;
  return btoa(token + SALT);
};

/**
 * Decrypts an encrypted token by removing the salt
 *
 * @param encryptedToken - The encrypted token string from storage
 * @returns The decrypted token string, or undefined if decryption fails or in SSR context
 */
export const decryptToken = (encryptedToken: string): string | undefined => {
  if (globalThis.window === undefined) return undefined;
  try {
    const decoded = atob(encryptedToken);
    const parts = decoded.split(SALT);
    return parts[0] || undefined;
  } catch {
    return undefined;
  }
};

/**
 * Retrieves and validates stored authentication token
 *
 * Performs comprehensive validation including:
 * - Token existence and format validation
 * - Expiration time checking
 * - Automatic cleanup of expired tokens
 *
 * @returns Object containing token data and validation status
 * @returns token - The decrypted token string or undefined if invalid
 * @returns expiresAt - Token expiration timestamp or undefined if invalid
 * @returns isValid - Boolean indicating if token is valid and not expired
 */
export const getStoredToken = (): {
  token: string | undefined;
  expiresAt: number | undefined;
  isValid: boolean;
} => {
  if (globalThis.window === undefined) {
    return { token: undefined, expiresAt: undefined, isValid: false };
  }

  try {
    const encryptedToken = localStorage.getItem(STORAGE_KEY);
    const storedExpiry = localStorage.getItem(EXPIRY_KEY);

    if (!encryptedToken || !storedExpiry) {
      return { token: undefined, expiresAt: undefined, isValid: false };
    }

    const expiresAt = Number.parseInt(storedExpiry, 10);
    const now = Date.now();

    if (now >= expiresAt) {
      clearStoredToken();
      return { token: undefined, expiresAt: undefined, isValid: false };
    }

    const token = decryptToken(encryptedToken);
    const isValid = !!token && token.length > 0;

    return { token, expiresAt, isValid };
  } catch (error) {
    console.error("Token retrieval error:", error);
    clearStoredToken();
    return { token: undefined, expiresAt: undefined, isValid: false };
  }
};

/**
 * Stores authentication token with encryption and expiration
 *
 * Securely persists the authentication token and its expiration time.
 * If either parameter is undefined/null, clears stored data instead.
 *
 * @param token - The authentication token to store, or undefined to clear
 * @param expiresAt - Unix timestamp when token expires, or undefined to clear
 */
export const setStoredToken = (token: string | undefined, expiresAt: number | undefined): void => {
  if (globalThis.window === undefined) return;

  try {
    if (token && expiresAt) {
      const encryptedToken = encryptToken(token);
      localStorage.setItem(STORAGE_KEY, encryptedToken);
      localStorage.setItem(EXPIRY_KEY, expiresAt.toString());
    } else {
      clearStoredToken();
    }
  } catch (error) {
    console.error("Storage write error:", error);
  }
};

/**
 * Clears all stored authentication data and signals logout across tabs
 *
 * Removes token and expiration data from localStorage and triggers a
 * cross-tab logout signal to synchronize authentication state across
 * multiple browser tabs/windows.
 */
export const clearStoredToken = (): void => {
  if (globalThis.window === undefined) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);

    // Signal cross-tab logout
    localStorage.setItem("logout-signal", Date.now().toString());
    localStorage.removeItem("logout-signal");
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

/**
 * Checks if user is currently authenticated
 *
 * Convenience function that validates stored token and returns authentication status.
 * Handles all token validation logic internally including expiration checks.
 *
 * @returns True if user has a valid, non-expired token; false otherwise
 */
export const isAuthenticated = (): boolean => {
  const { isValid } = getStoredToken();
  return isValid;
};
