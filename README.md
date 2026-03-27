# Payroll Generator BBVA

Desktop application built with Electron to generate BBVA-format TXT files for payroll disbursement (Dispersión de Nómina).

The app reads a CSV file with employee payment data and converts it into a fixed-width text file (`.txt`) following BBVA's layout specification — 108 characters per line. Accented characters (á, é, í, ó, ú, ñ) are automatically replaced with their ASCII equivalents for BBVA compatibility.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

## Usage

1. Click **Cargar CSV** to select your CSV file.
2. Review the loaded data in the table.
3. Click **Vista Previa** to preview the formatted output.
4. Click **Generar Archivo TXT** to save the file. You'll be prompted to choose the location and filename.

Click **Instrucciones** in the header for a detailed in-app help guide (in Spanish).

## CSV Format

The CSV file must have **4 columns** in this exact order. Column headers are ignored — only the order matters.

| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| Nombre | Employee full name | Yes | GARCÍA LÓPEZ MARÍA |
| Importe | Payment amount (supports `$`, commas, spaces) | Yes | $4,652.01 |
| Cuenta | BBVA account number (10 digits) | Yes | 0123456789 |
| RFC | Tax ID of the employee | No | GALM850101AB1 |

Example:

```csv
Nombre,Importe,Cuenta,RFC
GARCÍA LÓPEZ MARÍA,$4652.01,0123456789,GALM850101AB1
PEÑA NIÑO JOSÉ,$12589.00,9901093870,
```

## TXT Output Format

Each line is exactly **108 characters** (108 bytes in latin1 encoding) following BBVA's layout:

| Position | Field | Length | Description |
|----------|-------|--------|-------------|
| 1–9 | Secuencia | 9 | Auto-increment starting at 1, zero-padded left |
| 10–25 | RFC | 16 | Employee RFC or blank spaces |
| 26–27 | Tipo de cuenta | 2 | Always `99` (Nómina) |
| 28–47 | Número de cuenta | 20 | Account number, space-padded right |
| 48–62 | Importe | 15 | Amount in centavos (no decimal point), zero-padded left |
| 63–102 | Nombre | 40 | Employee name, space-padded right |
| 103–105 | Banco destino | 3 | Always `001` |
| 106–108 | Plaza destino | 3 | Always `001` |

The file uses CRLF line endings and latin1 encoding. Accented characters in names (ñ, á, é, í, ó, ú) are replaced with their ASCII equivalents (n, a, e, i, o, u) to ensure each character is exactly 1 byte. The full layout specification is available in `docs/layout_instructions.pdf`.

## License

MIT
