/**
 * A simple hash function to compute a numeric hash for a given object or string.
 *
 * This implementation uses the FNV-1a hash algorithm (64-bit) for better collision resistance
 * and distribution of hash values compared to the previous DJB2-based implementation.
 * The hash is reduced to a 32-bit integer for compatibility with systems expecting 32-bit hash values.
 *
 * Rationale for FNV-1a:
 * - FNV-1a is lightweight and efficient for non-cryptographic use cases.
 * - It provides good hash distribution and fewer collisions compared to DJB2, especially for similar strings or objects.
 * - The algorithm works well for inputs of varying lengths, making it suitable for hashing JSON-serialized objects.
 */
export function simpleHash(obj: any): number {
    const str = typeof obj === "string" ? obj : JSON.stringify(obj);
    let hash = 0xcbf29ce484222325n;
    const prime = 0x100000001b3n;

    for (let i = 0; i < str.length; i++) {
        hash ^= BigInt(str.charCodeAt(i));
        hash *= prime;
    }

    return Number(hash & 0xffffffffn);
}
export default simpleHash;

/**
 *
 * Previous version:
 *
 * export function simpleHash(obj: any): number {
 *    const str = JSON.stringify(obj);
 *     let hash = 5381;
 *     for (let i = 0; i < str.length; i++) {
 *         hash = (hash * 33) ^ str.charCodeAt(i);
 *     }
 *     return hash >>> 0;
 * }
 */

export const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
};
