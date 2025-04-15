export function setupPrintButton() {
  const printButton = document.getElementById("btn-imprimir");

  if (printButton) {
    printButton.addEventListener("click", handlePrint);
  }
}

function handlePrint() {
  // Clonar el contenido principal que quieres imprimir
  const printContent = document
    .querySelector(".container-fluid")
    .cloneNode(true);

  // Crear una ventana de impresión
  const printWindow = window.open("", "_blank");

  // Estilos para impresión
  const styles = `
    <style>
      @media print {
        body * {
          visibility: hidden;
        }
        .print-container, .print-container * {
          visibility: visible;
        }
        .print-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        .card {
          border: 1px solid #ddd;
          margin-bottom: 20px;
          break-inside: avoid;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
      }
    </style>
  `;

  // Configurar el contenido de la ventana de impresión
  printWindow.document.write(`
    <html>
      <head>
        <title>Planilla RES - ${
          document.getElementById("fecha-display").textContent
        }</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        ${styles}
      </head>
      <body>
        <div class="print-container">
          <h2 class="text-center mb-4">Planilla RES</h2>
          <p class="text-center mb-4"><strong>Fecha:</strong> ${
            document.getElementById("fecha-display").textContent
          }</p>
          ${printContent.innerHTML}
        </div>
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 200);
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
