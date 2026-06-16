import { parseSiPrefix, SI_PREFIXES } from "./parse-si-prefix"

const SI_PREFIX_PATTERN = SI_PREFIXES
  .filter((prefix) => prefix !== "")
  .sort((a, b) => b.length - a.length)
  .map((prefix) => prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|")

const SI_UNIT_PATTERN = new RegExp(
  `^([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?)(?:(${SI_PREFIX_PATTERN}))?$`,
)

export function parseSiUnit(value?: string | null): number | undefined {
  if (value == null) return undefined

  const trimmed = value.trim()
  if (trimmed === "") return undefined

  const match = trimmed.match(SI_UNIT_PATTERN)
  if (!match) return Number.NaN

  const numericValue = Number(match[1])
  const prefixValue = parseSiPrefix(match[2] ?? "")

  if (prefixValue == null) return Number.NaN

  return numericValue * prefixValue
}
