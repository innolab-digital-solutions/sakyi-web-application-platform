// Retry and smart refresh logic
export class RetryManager {
  private retryCount = 0;
  private readonly maxRetries = 3;
  private lastRefreshTime = 0;
  private readonly refreshCooldown = 30_000; // 30 seconds

  canRetry(): boolean {
    return this.retryCount < this.maxRetries;
  }

  incrementRetry(): number {
    return ++this.retryCount;
  }

  resetRetry(): void {
    this.retryCount = 0;
  }

  getRetryDelay(): number {
    return Math.min(5000 * this.retryCount, 30_000);
  }

  canRefresh(): boolean {
    const now = Date.now();
    return now - this.lastRefreshTime >= this.refreshCooldown;
  }

  markRefreshAttempt(): void {
    this.lastRefreshTime = Date.now();
  }

  shouldRetryWithDelay(): { shouldRetry: boolean; delay: number } {
    if (!this.canRetry()) {
      return { shouldRetry: false, delay: 0 };
    }

    const delay = this.getRetryDelay();
    this.incrementRetry();

    return { shouldRetry: true, delay };
  }
}

export const createTokenHelpers = (tokenExpiresAt: number | undefined) => ({
  isTokenExpiringSoon: (bufferMinutes: number = 2): boolean => {
    if (!tokenExpiresAt) return true;
    const bufferMs = bufferMinutes * 60 * 1000;
    return Date.now() >= tokenExpiresAt - bufferMs;
  },

  isTokenExpired: (): boolean => {
    if (!tokenExpiresAt) return true;
    return Date.now() >= tokenExpiresAt;
  },

  getTimeUntilExpiry: (): number => {
    if (!tokenExpiresAt) return 0;
    return Math.max(0, tokenExpiresAt - Date.now());
  },

  getRefreshDelay: (): number => {
    const timeLeft = tokenExpiresAt ? tokenExpiresAt - Date.now() : 0;
    // Schedule refresh 2 minutes before expiry, minimum 30 seconds
    return Math.max(timeLeft - 120_000, 30_000);
  },
});
