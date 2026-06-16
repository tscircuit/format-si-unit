const SI_PREFIX_VALUES = new Map<string, number>([
  ["T", 1e12],
  ["G", 1e9],
  ["M", 1e6],
  ["k", 1e3],
  ["", 1],
  ["m", 1e-3],
  ["µ", 1e-6],
  ["u", 1e-6],
  ["n", 1e-9],
  ["p", 1e-12],
])

export function parseSiUnit(value?: string | null): number | undefined {
  if (value == null) return undefined

  const trimmed = value.trim()
  if (trimmed === "") return undefined

  const match = trimmed.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)([TGMkmµunp]?)$/,
  )
  if (!match) return Number.NaN

  const numericValue = Number(match[1])
  const prefixValue = SI_PREFIX_VALUES.get(match[2])

  if (prefixValue == null) return Number.NaN

  return numericValue * prefixValue
}
