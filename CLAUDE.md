# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run the app**: `npm start` (launches Electron)
- **Build Windows installer**: `npm run dist:win` (requires electron-builder)
- No test suite or linter configured

## Architecture

Electron desktop app that converts CSV payroll data into BBVA-format TXT files (fixed-width, 108 chars/line) for "Dispersión de Nómina".

**Process model (3 files):**
- `src/main.js` — Main process: window creation, IPC handlers for file open/save dialogs
- `src/preload.js` — Context bridge exposing `electronAPI.openCsv()` and `electronAPI.savePrn()` to the renderer
- `src/renderer.js` — UI logic: CSV parsing (PapaParse), table rendering, preview/generate workflow

**Core business logic:**
- `src/formatter.js` — Pure formatting module (UMD-lite: works in both Node and browser). Converts CSV rows into 108-char fixed-width lines per BBVA spec. Loaded via `<script>` tag in the renderer as `window.Formatter`.

**UI:**
- `src/index.html` — Single HTML file with embedded CSS. All in Spanish. BBVA brand color: `#004481`.

**Data flow:** CSV file → PapaParse → table display → `Formatter.formatAllRecords()` → TXT preview/file save

## TXT Layout (108 chars/line)

| Pos | Len | Field | Source |
|-----|-----|-------|--------|
| 1-9 | 9 | Secuencia | Auto-increment, zero-padded left |
| 10-25 | 16 | RFC | CSV col 4 (optional, space-padded) |
| 26-27 | 2 | Tipo de cuenta | Always `99` |
| 28-47 | 20 | Número de cuenta | CSV col 3, space-padded right |
| 48-62 | 15 | Importe | CSV col 2, centavos (no decimal), zero-padded left |
| 63-102 | 40 | Nombre | CSV col 1, space-padded right |
| 103-105 | 3 | Banco destino | Always `001` |
| 106-108 | 3 | Plaza destino | Always `001` |

CRLF line endings. Latin1 encoding. Accented characters (ñ, á, é, í, ó, ú) are stripped to ASCII equivalents in the nombre field. File must end with a newline. Full spec in `docs/layout_instructions.pdf`.

## CSV Input

4 columns (headers ignored, order matters): **Nombre, Importe, Número de cuenta, RFC**. Importe may contain `$`, commas, or spaces — all stripped during parsing.

## Key Constraints

- CommonJS modules (`"type": "commonjs"` in package.json), no bundler
- Context isolation ON, node integration OFF — all Node/filesystem access goes through preload IPC
- `formatter.js` must remain a pure-function module with no Electron dependencies (used as both Node module and browser script)
