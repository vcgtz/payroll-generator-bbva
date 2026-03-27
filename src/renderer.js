document.addEventListener('DOMContentLoaded', () => {
  const btnLoadCsv = document.getElementById('btnLoadCsv');
  const fileNameLabel = document.getElementById('fileName');
  const tableSection = document.getElementById('tableSection');
  const tableBody = document.getElementById('tableBody');
  const btnPreview = document.getElementById('btnPreview');
  const btnGenerate = document.getElementById('btnGenerate');
  const previewSection = document.getElementById('previewSection');
  const previewContent = document.getElementById('previewContent');
  const statusMsg = document.getElementById('statusMsg');

  let parsedRows = [];

  function showStatus(msg, isError) {
    statusMsg.textContent = msg;
    statusMsg.className = 'status' + (isError ? ' error' : '');
    statusMsg.classList.remove('hidden');
  }

  function hideStatus() {
    statusMsg.classList.add('hidden');
  }

  function renderTable(rows) {
    tableBody.innerHTML = '';
    rows.forEach((row, i) => {
      const tr = document.createElement('tr');
      const numTd = document.createElement('td');
      numTd.textContent = i + 1;
      tr.appendChild(numTd);

      for (let j = 0; j < 4; j++) {
        const td = document.createElement('td');
        td.textContent = row[j] || '';
        tr.appendChild(td);
      }
      tableBody.appendChild(tr);
    });
  }

  btnLoadCsv.addEventListener('click', async () => {
    hideStatus();
    const result = await window.electronAPI.openCsv();
    if (!result) return;

    const parsed = Papa.parse(result.content, { skipEmptyLines: true });

    if (parsed.data.length < 2) {
      showStatus('El archivo no contiene datos suficientes.', true);
      return;
    }

    // Skip header row
    parsedRows = parsed.data.slice(1);

    fileNameLabel.textContent = result.fileName;
    tableSection.classList.remove('hidden');
    previewSection.classList.add('hidden');
    btnPreview.disabled = false;
    btnGenerate.disabled = false;

    renderTable(parsedRows);
    showStatus(parsedRows.length + ' registro(s) cargados.');
  });

  btnPreview.addEventListener('click', () => {
    hideStatus();
    try {
      const prnText = Formatter.formatAllRecords(parsedRows);
      previewContent.textContent = prnText;
      previewSection.classList.remove('hidden');
    } catch (err) {
      showStatus('Error al generar vista previa: ' + err.message, true);
    }
  });

  btnGenerate.addEventListener('click', async () => {
    hideStatus();
    try {
      const prnText = Formatter.formatAllRecords(parsedRows);
      const saved = await window.electronAPI.savePrn(prnText);
      if (saved) {
        showStatus('Archivo PRN guardado exitosamente.');
      }
    } catch (err) {
      showStatus('Error al generar archivo: ' + err.message, true);
    }
  });
});
