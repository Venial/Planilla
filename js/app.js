// Archivo principal de la aplicación
import { inicializarEventListeners } from "./listeners.js";
import { actualizarCalculos } from "./modules/calculations.js";
import {
  movimientosOnline,
  movimientosPosnet,
  movimientosEgresos,
} from "./core/globals.js";

document.addEventListener("DOMContentLoaded", function () {
  // Inicializar la aplicación
  inicializarEventListeners();
  actualizarCalculos();

  // Hacer disponibles las funciones globales
  window.movimientosOnline = movimientosOnline;
  window.movimientosPosnet = movimientosPosnet;
  window.movimientosEgresos = movimientosEgresos;
});
