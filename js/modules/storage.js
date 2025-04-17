// Manejo del almacenamiento
import { STORAGE_KEY } from "../core/constants.js";
import { formatDate } from "../core/helpers.js";
import {
  movimientosOnline,
  movimientosPosnet,
  movimientosEgresos,
} from "../core/globals.js";
import {
  actualizarListaOnline,
  actualizarListaPosnet,
  actualizarListaEgresos,
} from "./lists.js";
import { actualizarCalculos } from "./calculations.js";

export function guardarPlanilla() {
  const fechaPlanillaInput = document.getElementById("fecha-planilla");

  const planilla = {
    fecha: fechaPlanillaInput.value,
    movimientosOnline: movimientosOnline,
    movimientosPosnet: movimientosPosnet,
    movimientosEgresos: movimientosEgresos,
    balanceInicial:
      parseFloat(document.getElementById("balance-inicial").value) || 0,
    balanceCierre:
      parseFloat(document.getElementById("balance-cierre").value) || 0,
    efectivoCaja:
      parseFloat(document.getElementById("efectivo-caja").value) || 0,
    ventaSistema:
      parseFloat(document.getElementById("venta-sistema").value) || 0,
    observaciones: document.getElementById("observaciones").value,
  };

  let planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  planillas[fechaPlanillaInput.value] = planilla;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(planillas));

  alert(
    "Planilla guardada correctamente para la fecha " +
      formatDate(fechaPlanillaInput.value)
  );
}

export function cargarPlanilla(fecha) {
  const fechaPlanillaInput = document.getElementById("fecha-planilla");
  const fechaDisplay = document.getElementById("fecha-display");

  const planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const planilla = planillas[fecha || fechaPlanillaInput.value];

  if (planilla) {
    // Actualizar fecha
    fechaPlanillaInput.value = fecha || fechaPlanillaInput.value;
    fechaDisplay.textContent = formatDate(fechaPlanillaInput.value);

    // Cargar movimientos
    movimientosOnline = planilla.movimientosOnline || [];
    movimientosPosnet = planilla.movimientosPosnet || [];
    movimientosEgresos = planilla.movimientosEgresos || [];

    // Cargar valores
    document.getElementById("balance-inicial").value =
      planilla.balanceInicial || 0;
    document.getElementById("balance-cierre").value =
      planilla.balanceCierre || 0;
    document.getElementById("efectivo-caja").value = planilla.efectivoCaja || 0;
    document.getElementById("venta-sistema").value = planilla.ventaSistema || 0;
    document.getElementById("observaciones").value =
      planilla.observaciones || "";

    // Actualizar UI
    actualizarListaOnline();
    actualizarListaPosnet();
    actualizarListaEgresos();
    actualizarCalculos();

    return true;
  } else {
    alert("No se encontró una planilla guardada para esta fecha");
    return false;
  }
}

export function nuevaPlanilla(fecha) {
  const fechaPlanillaInput = document.getElementById("fecha-planilla");
  const planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  if (planillas[fecha]) {
    if (
      !confirm(
        `Ya existe una planilla para ${formatDate(fecha)}. ¿Desea editarla?`
      )
    ) {
      return false;
    }
    return cargarPlanilla(fecha);
  }

  fechaPlanillaInput.value = fecha;
  document.getElementById("fecha-display").textContent = formatDate(fecha);
  limpiarDatos();
  return true;
}

function limpiarDatos() {
  movimientosOnline = [];
  movimientosPosnet = [];
  movimientosEgresos = [];

  document.getElementById("balance-inicial").value = "";
  document.getElementById("balance-cierre").value = "";
  document.getElementById("efectivo-caja").value = "";
  document.getElementById("venta-sistema").value = "";
  document.getElementById("observaciones").value = "";

  actualizarListaOnline();
  actualizarListaPosnet();
  actualizarListaEgresos();
  actualizarCalculos();
}
