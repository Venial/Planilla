// Manejo de movimientos
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

export function agregarMovimientoOnline(movimiento) {
  movimientosOnline.push(movimiento);
  actualizarListaOnline();
  actualizarCalculos();
}

export function agregarMovimientoPosnet(movimiento) {
  movimientosPosnet.push(movimiento);
  actualizarListaPosnet();
  actualizarCalculos();
}

export function agregarMovimientoEgreso(movimiento) {
  movimientosEgresos.push(movimiento);
  actualizarListaEgresos();
  actualizarCalculos();
}

// Funciones globales para eliminar movimientos
window.eliminarMovimientoOnline = function (index) {
  if (confirm("¿Estás seguro de eliminar este movimiento?")) {
    movimientosOnline.splice(index, 1);
    actualizarListaOnline();
    actualizarCalculos();
  }
};

window.eliminarMovimientoPosnet = function (index) {
  if (confirm("¿Estás seguro de eliminar este movimiento?")) {
    movimientosPosnet.splice(index, 1);
    actualizarListaPosnet();
    actualizarCalculos();
  }
};

window.eliminarMovimientoEgreso = function (index) {
  if (confirm("¿Estás seguro de eliminar este movimiento?")) {
    movimientosEgresos.splice(index, 1);
    actualizarListaEgresos();
    actualizarCalculos();
  }
};
