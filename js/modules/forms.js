// Manejo de formularios
import {
  agregarMovimientoOnline,
  agregarMovimientoPosnet,
  agregarMovimientoEgreso,
} from "./movements.js";
import { actualizarCalculos } from "./calculations.js";

export function inicializarFormularios() {
  const formOnline = document.getElementById("form-online");
  const formPosnet = document.getElementById("form-posnet");
  const formEgreso = document.getElementById("form-egreso");

  formOnline.addEventListener("submit", function (e) {
    e.preventDefault();
    agregarMovimientoOnline({
      metodo: document.getElementById("metodo-online").value,
      monto: parseFloat(document.getElementById("monto-online").value) || 0,
      operaciones:
        parseInt(document.getElementById("operaciones-online").value) || 0,
      fecha: new Date(),
    });
    this.reset();
  });

  formPosnet.addEventListener("submit", function (e) {
    e.preventDefault();
    agregarMovimientoPosnet({
      tipoTarjeta: document.getElementById("tipo-posnet").value,
      monto: parseFloat(document.getElementById("monto-posnet").value) || 0,
      operaciones:
        parseInt(document.getElementById("operaciones-posnet").value) || 0,
      fecha: new Date(),
    });
    this.reset();
  });

  formEgreso.addEventListener("submit", function (e) {
    e.preventDefault();
    agregarMovimientoEgreso({
      metodo: document.getElementById("metodo-egreso").value,
      concepto: document.getElementById("concepto-egreso").value || "Egreso",
      monto: parseFloat(document.getElementById("monto-egreso").value) || 0,
      fecha: new Date(),
    });
    this.reset();
  });
}
