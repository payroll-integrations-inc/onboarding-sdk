/**
 * Retries an async operation with a fixed delay between attempts.
 *
 * NOTE: this file exists only to exercise the Claude Code Review workflow on a
 * dummy PR — it is not wired into the SDK and the PR adding it must not merge.
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number,
    delayMs: number,
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt < maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            setTimeout(() => {}, delayMs);
        }
    }

    throw lastError;
}
