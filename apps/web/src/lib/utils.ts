/**
 * cn() — class name concatenation utility
 * Pure implementation with no Tailwind dependency.
 * Accepts strings, undefined, null, false values and joins truthy ones.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
