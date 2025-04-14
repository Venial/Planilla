import { STORAGE_KEY } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";

export function saveSheet(date, state) {
  const sheet = {
    fecha: date,
    movimientosOnline: state.onlineMovements,
    movimientosPosnet: state.posnetMovements,
    movimientosEgresos: state.expenseMovements,
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

  let sheets = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  sheets[date] = sheet;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets));

  alert(`Planilla guardada correctamente para la fecha ${formatDate(date)}`);
  return true;
}

export function loadSheet(date, state) {
  const sheets = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const sheet = sheets[date];

  if (sheet) {
    // Actualizar estado
    state.currentDate = date;
    state.onlineMovements = sheet.movimientosOnline || [];
    state.posnetMovements = sheet.movimientosPosnet || [];
    state.expenseMovements = sheet.movimientosEgresos || [];

    // Actualizar UI
    document.getElementById("fecha-display").textContent = formatDate(date);
    document.getElementById("balance-inicial").value =
      sheet.balanceInicial || 0;
    document.getElementById("balance-cierre").value = sheet.balanceCierre || 0;
    document.getElementById("efectivo-caja").value = sheet.efectivoCaja || 0;
    document.getElementById("venta-sistema").value = sheet.ventaSistema || 0;
    document.getElementById("observaciones").value = sheet.observaciones || "";

    return true;
  }

  alert("No se encontró una planilla guardada para esta fecha");
  return false;
}

// ... otras funciones de storage
