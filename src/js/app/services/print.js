export function setupPrintButton() {
  const printButton = document.getElementById("btn-imprimir");

  if (!printButton) {
    console.error("Botón de imprimir no encontrado");
    return;
  }

  printButton.addEventListener("click", () => {
    // Crear un div temporal con el contenido a imprimir
    const printContent = document.createElement("div");
    printContent.id = "printable-content";
    printContent.innerHTML = getPrintableHTML();

    // Aplicar estilos de impresión
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #printable-content, #printable-content * { 
          visibility: visible; 
        }
        #printable-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
      @media screen {
        #printable-content {
          position: fixed;
          left: -9999px;
        }
      }
    `;

    // Agregar al documento
    document.body.appendChild(style);
    document.body.appendChild(printContent);

    // Mostrar diálogo de impresión nativo
    setTimeout(() => {
      window.print();

      // Limpiar después de imprimir
      setTimeout(() => {
        document.body.removeChild(printContent);
        document.body.removeChild(style);
      }, 1000);
    }, 500);
  });
}

function getPrintableHTML() {
  const sections = ["calculos", "datos", "movimientos"];
  let html = "";

  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      const clone = section.cloneNode(true);

      // Limpiar elementos no deseados
      clone
        .querySelectorAll('.no-print, [data-bs-toggle="collapse"], form, .btn')
        .forEach((el) => {
          el.remove();
        });

      // Mostrar contenido colapsado
      clone.querySelectorAll(".collapse").forEach((el) => {
        el.classList.remove("collapse");
      });

      html += clone.outerHTML;
    }
  });

  return html;
}
