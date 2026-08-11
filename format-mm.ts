/**
 * Format a value already expressed in millimetres for diagnostics.
 *
 * Keeps millimetres as the fixed unit rather than selecting an SI prefix,
 * rounds floating-point dust to three decimal places, and drops trailing zeros.
 */
export const formatMm = (value: number): string => {
  const rounded = Math.round(value * 1000) / 1000
  return `${Number(rounded.toFixed(3))}mm`
}
