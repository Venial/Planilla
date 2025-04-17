// Actualización de listas en el DOM
import { formatNombreMetodo } from "../core/helpers.js";
import {
  movimientosOnline,
  movimientosPosnet,
  movimientosEgresos,
} from "../core/globals.js";

export function actualizarListaOnline() {
  const listaOnline = document.getElementById("lista-online");
  listaOnline.innerHTML = "";
  let totalOps = 0;
  let totalMonto = 0;

  movimientosOnline.forEach((mov, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatNombreMetodo(mov.metodo)}</td>
      <td>${mov.operaciones}</td>
      <td class="text-success">$${mov.monto.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoOnline(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    listaOnline.appendChild(row);
    totalOps += mov.operaciones;
    totalMonto += mov.monto;
  });

  document.getElementById("total-ops-online").textContent = totalOps;
  document.getElementById(
    "total-monto-online"
  ).textContent = `$${totalMonto.toFixed(2)}`;
}

export function actualizarListaPosnet() {
  const listaPosnet = document.getElementById("lista-posnet");
  listaPosnet.innerHTML = "";
  let totalOps = 0;
  let totalMonto = 0;

  movimientosPosnet.forEach((mov, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatNombreMetodo(mov.tipoTarjeta)}</td>
      <td>${mov.operaciones}</td>
      <td class="text-success">$${mov.monto.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoPosnet(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    listaPosnet.appendChild(row);
    totalOps += mov.operaciones;
    totalMonto += mov.monto;
  });

  document.getElementById("total-ops-posnet").textContent = totalOps;
  document.getElementById(
    "total-monto-posnet"
  ).textContent = `$${totalMonto.toFixed(2)}`;
}

export function actualizarListaEgresos() {
  const listaEgresos = document.getElementById("lista-egresos");
  listaEgresos.innerHTML = "";
  let totalMonto = 0;

  movimientosEgresos.forEach((mov, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatNombreMetodo(mov.metodo)}</td>
      <td>${mov.concepto}</td>
      <td class="text-danger">$${mov.monto.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoEgreso(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    listaEgresos.appendChild(row);
    totalMonto += mov.monto;
  });

  document.getElementById(
    "total-monto-egresos"
  ).textContent = `$${totalMonto.toFixed(2)}`;
}
