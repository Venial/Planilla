// Cálculos y actualización de resultados
import {
  movimientosOnline,
  movimientosPosnet,
  movimientosEgresos,
} from "../core/globals.js";

export function actualizarCalculos() {
  const bolsinInicial =
    parseFloat(document.getElementById("balance-inicial").value) || 0;
  const bolsinCierre =
    parseFloat(document.getElementById("balance-cierre").value) || 0;
  const efectivoCaja =
    parseFloat(document.getElementById("efectivo-caja").value) || 0;
  const totalSistema =
    parseFloat(document.getElementById("venta-sistema").value) || 0;

  // Calcular totales de movimientos
  const totalOnline = movimientosOnline.reduce(
    (sum, mov) => sum + mov.monto,
    0
  );
  const totalPosnet = movimientosPosnet.reduce(
    (sum, mov) => sum + mov.monto,
    0
  );
  const totalEgresos = movimientosEgresos.reduce(
    (sum, mov) => sum + mov.monto,
    0
  );

  // Aplicar fórmula exacta
  const diferenciaBolsin = bolsinCierre - bolsinInicial;
  const totalEfectivoCaja = efectivoCaja + totalEgresos;
  const totalDigital = totalOnline + totalPosnet;
  const totalPlanilla = totalEfectivoCaja + totalDigital + diferenciaBolsin;
  const diferenciaCierre = totalPlanilla - totalSistema;

  // Actualizar UI
  document.getElementById(
    "diferencia-balance"
  ).textContent = `$${diferenciaBolsin.toFixed(2)}`;
  document.getElementById(
    "total-efectivo"
  ).textContent = `$${totalEfectivoCaja.toFixed(2)}`;
  document.getElementById("total-online").textContent = `$${totalOnline.toFixed(
    2
  )}`;
  document.getElementById("total-posnet").textContent = `$${totalPosnet.toFixed(
    2
  )}`;
  document.getElementById(
    "total-egresos"
  ).textContent = `$${totalEgresos.toFixed(2)}`;
  document.getElementById(
    "total-calculado"
  ).textContent = `$${totalPlanilla.toFixed(2)}`;
  document.getElementById(
    "total-sistema"
  ).textContent = `$${totalSistema.toFixed(2)}`;
  document.getElementById(
    "diferencia-sistema"
  ).textContent = `$${diferenciaCierre.toFixed(2)}`;

  // Colores según resultados
  document.getElementById("diferencia-balance").className =
    diferenciaBolsin >= 0 ? "text-success" : "text-danger";
  document.getElementById("diferencia-sistema").className =
    diferenciaCierre >= 0 ? "text-success" : "text-danger";
}
