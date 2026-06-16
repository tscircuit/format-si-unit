# format-si-unit

A lightweight utility to format and parse numbers with SI unit prefixes (k, M, G, etc.).

## Installation

```bash
npm install format-si-unit
# or
bun add format-si-unit
```

## Usage

```typescript
import { formatSiUnit, parseSiUnit } from "format-si-unit"

console.log(formatSiUnit(1500)) // "1.5k"
console.log(formatSiUnit(1_000_000)) // "1M"
console.log(formatSiUnit(0.001)) // "1m"
console.log(formatSiUnit(0)) // "0"
console.log(formatSiUnit()) // ""

console.log(parseSiUnit("1.5k")) // 1500
console.log(parseSiUnit("100µ")) // 0.0001
console.log(parseSiUnit("100u")) // 0.0001
console.log(parseSiUnit("abc")) // NaN
console.log(parseSiUnit()) // undefined
```

## Features

- Supports SI prefixes from pico (p) to tera (T)
- Handles null and undefined inputs
- Returns numbers with up to 3 significant digits
- Automatically selects the most appropriate SI prefix
- Parses SI-prefixed strings back to numbers
- TypeScript support included

## Development

To install dependencies:

```bash
bun install
```

To run tests:

```bash
bun test
```

To build:

```bash
bun run build
```

## License

MIT
