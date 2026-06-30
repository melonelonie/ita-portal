// ─────────────────────────────────────────────────────────────
// Simulated network delay utility
// ─────────────────────────────────────────────────────────────

/**
 * Simulates network latency for mock API handlers.
 * @param min Minimum delay in ms (default 300)
 * @param max Maximum delay in ms (default 800)
 */
export function delay(min = 300, max = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates a slow network for testing loading states.
 */
export function slowDelay(): Promise<void> {
  return delay(1200, 2500);
}

/**
 * Simulates an instant response (for optimistic updates).
 */
export function instantDelay(): Promise<void> {
  return delay(50, 100);
}
