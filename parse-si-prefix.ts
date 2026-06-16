const SI_PREFIX_VALUES = new Map<string, number>([
  ["T", 1e12],
  ["G", 1e9],
  ["M", 1e6],
  ["K", 1e3],
  ["k", 1e3],
  ["", 1],
  ["m", 1e-3],
  ["µ", 1e-6],
  ["u", 1e-6],
  ["n", 1e-9],
  ["p", 1e-12],
  ["f", 1e-15],
])

export const SI_PREFIXES = [...SI_PREFIX_VALUES.keys()]

export function parseSiPrefix(prefix: string): number | undefined {
  return SI_PREFIX_VALUES.get(prefix)
}
