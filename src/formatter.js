(function (exports) {
  function parseImporte(value) {
    // Strip currency symbol, commas, and whitespace
    var cleaned = value.replace(/[$,\s]/g, '');
    var num = parseFloat(cleaned);
    if (isNaN(num) || num < 0) {
      throw new Error('Importe invalido: ' + value);
    }
    return Math.round(num * 100);
  }

  function formatRecord(row, seqNum) {
    var nombre = (row[0] || '').toString().trim();
    var importe = (row[1] || '0').toString().trim();
    var cuenta = (row[2] || '').toString().trim();
    var rfc = (row[3] || '').toString().trim();

    // Field 1: Secuencia (pos 1-9, 9 chars, numeric, right-aligned, zero-padded)
    var secuencia = String(seqNum).padStart(9, '0');

    // Field 2: RFC (pos 10-25, 16 chars, alphanumeric, left-aligned)
    var rfcField = rfc ? rfc.substring(0, 16).padEnd(16, ' ') : ''.padEnd(16, ' ');

    // Field 3: Tipo de cuenta (pos 26-27, 2 chars, always 99)
    var tipoCuenta = '99';

    // Field 4: Numero de cuenta (pos 28-47, 20 chars, alphanumeric, left-aligned)
    var cuentaField = cuenta.substring(0, 20).padEnd(20, ' ');

    // Field 5: Importe a pagar (pos 48-62, 15 chars, numeric, right-aligned, zero-padded)
    var centavos = parseImporte(importe);
    var importeField = String(centavos).padStart(15, '0');

    // Field 6: Nombre del trabajador (pos 63-102, 40 chars, alphanumeric, left-aligned)
    var nombreField = nombre.substring(0, 40).padEnd(40, ' ');

    // Field 7: Banco destino (pos 103-105, always 001)
    var banco = '001';

    // Field 8: Plaza destino (pos 106-108, always 001)
    var plaza = '001';

    var line = secuencia + rfcField + tipoCuenta + cuentaField + importeField + nombreField + banco + plaza;

    if (line.length !== 108) {
      throw new Error('Linea generada con longitud incorrecta: ' + line.length + ' (esperado 108)');
    }

    return line;
  }

  function formatAllRecords(rows) {
    var lines = [];
    for (var i = 0; i < rows.length; i++) {
      lines.push(formatRecord(rows[i], i + 1));
    }
    return lines.join('\r\n') + '\r\n';
  }

  exports.formatRecord = formatRecord;
  exports.formatAllRecords = formatAllRecords;
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.Formatter = {}));
