((exports) => {
  const parseImporte = (value) => {
    const cleaned = value.replace(/[$,\s]/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num) || num < 0) {
      throw new Error(`Importe invalido: ${value}`);
    }
    return Math.round(num * 100);
  };

  const formatRecord = (row, seqNum) => {
    const nombre = (row[0] || '').toString().trim();
    const importe = (row[1] || '0').toString().trim();
    const cuenta = (row[2] || '').toString().trim();
    const rfc = (row[3] || '').toString().trim();

    const secuencia = String(seqNum).padStart(9, '0');
    const rfcField = rfc ? rfc.substring(0, 16).padEnd(16, ' ') : ' '.repeat(16);
    const tipoCuenta = '99';
    const cuentaField = cuenta.substring(0, 20).padEnd(20, ' ');
    const centavos = parseImporte(importe);
    const importeField = String(centavos).padStart(15, '0');
    const nombreField = nombre.substring(0, 40).padEnd(40, ' ');
    const banco = '001';
    const plaza = '001';

    const line = secuencia + rfcField + tipoCuenta + cuentaField + importeField + nombreField + banco + plaza;

    if (line.length !== 108) {
      throw new Error(`Linea generada con longitud incorrecta: ${line.length} (esperado 108)`);
    }

    return line;
  };

  const formatAllRecords = (rows) => rows.map((row, i) => formatRecord(row, i + 1)).join('\r\n') + '\r\n';

  exports.formatRecord = formatRecord;
  exports.formatAllRecords = formatAllRecords;
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.Formatter = {}));
