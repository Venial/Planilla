// Manejo de impresión
import { formatDate, formatNombreMetodo } from "../core/helpers.js";
import {
  movimientosOnline,
  movimientosPosnet,
  movimientosEgresos,
} from "../core/globals.js";

export function imprimirPlanilla() {
  const printStyle = `
    @media print {
      body * { visibility: hidden; }
      #print-section, #print-section * { visibility: visible; }
      #print-section {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        font-size: 12px;
      }
      .no-print { display: none !important; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
      th { background-color: #f2f2f2; }
      .text-success { color: #28a745 !important; }
      .text-danger { color: #dc3545 !important; }
    }
  `;

  const styleElement = document.createElement("style");
  styleElement.innerHTML = printStyle;

  const printSection = document.createElement("div");
  printSection.id = "print-section";

  const fechaPlanillaInput = document.getElementById("fecha-planilla");
  const fecha = formatDate(fechaPlanillaInput.value);

  let contenido = `
    <div class="container mt-3">
      <h3 class="text-center">Planilla RES - ${fecha}</h3>
      <hr>
      
      <h4>Datos Principales</h4>
      <table class="table">
        <tr><th>Balance Inicial</th><td>${
          document.getElementById("balance-inicial").value || 0
        }</td></tr>
        <tr><th>Balance Cierre</th><td>${
          document.getElementById("balance-cierre").value || 0
        }</td></tr>
        <tr><th>Efectivo en Caja</th><td>${
          document.getElementById("efectivo-caja").value || 0
        }</td></tr>
        <tr><th>Venta del Sistema</th><td>${
          document.getElementById("venta-sistema").value || 0
        }</td></tr>
        <tr><th>Diferencia</th><td class="${
          document.getElementById("diferencia-sistema").className
        }">
          ${document.getElementById("diferencia-sistema").textContent}
        </td></tr>
      </table>
      
      <h4>Pagos Online</h4>
      <table class="table">
        <thead><tr><th>Método</th><th>Operaciones</th><th>Monto</th></tr></thead>
        <tbody>
          ${movimientosOnline
            .map(
              (mov) => `
            <tr>
              <td>${formatNombreMetodo(mov.metodo)}</td>
              <td>${mov.operaciones}</td>
              <td>$${mov.monto.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <th>Total</th>
            <th>${movimientosOnline.reduce(
              (sum, mov) => sum + mov.operaciones,
              0
            )}</th>
            <th>$${movimientosOnline
              .reduce((sum, mov) => sum + mov.monto, 0)
              .toFixed(2)}</th>
          </tr>
        </tbody>
      </table>
      
      <h4>Pagos POSNET</h4>
      <table class="table">
        <thead><tr><th>Tipo</th><th>Operaciones</th><th>Monto</th></tr></thead>
        <tbody>
          ${movimientosPosnet
            .map(
              (mov) => `
            <tr>
              <td>${formatNombreMetodo(mov.tipoTarjeta)}</td>
              <td>${mov.operaciones}</td>
              <td>$${mov.monto.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <th>Total</th>
            <th>${movimientosPosnet.reduce(
              (sum, mov) => sum + mov.operaciones,
              0
            )}</th>
            <th>$${movimientosPosnet
              .reduce((sum, mov) => sum + mov.monto, 0)
              .toFixed(2)}</th>
          </tr>
        </tbody>
      </table>
      
      <h4>Egresos</h4>
      <table class="table">
        <thead><tr><th>Método</th><th>Concepto</th><th>Monto</th></tr></thead>
        <tbody>
          ${movimientosEgresos
            .map(
              (mov) => `
            <tr>
              <td>${formatNombreMetodo(mov.metodo)}</td>
              <td>${mov.concepto}</td>
              <td class="text-danger">$${mov.monto.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <th colspan="2">Total</th>
            <th class="text-danger">$${movimientosEgresos
              .reduce((sum, mov) => sum + mov.monto, 0)
              .toFixed(2)}</th>
          </tr>
        </tbody>
      </table>
      
      <div class="mt-3">
        <p><strong>Observaciones:</strong></p>
        <p>${document.getElementById("observaciones").value || "Ninguna"}</p>
      </div>
    </div>
  `;

  printSection.innerHTML = contenido;
  document.body.appendChild(styleElement);
  document.body.appendChild(printSection);
  window.print();

  setTimeout(() => {
    document.body.removeChild(styleElement);
    document.body.removeChild(printSection);
  }, 100);
}
