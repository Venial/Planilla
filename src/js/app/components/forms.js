import { formatNombreMetodo } from "../../utils/helpers";
import {
  addOnlineMovement,
  addPosnetMovement,
  addExpenseMovement,
} from "../core/storage";

export function setupFormListeners(state) {
  // Formulario Online
  document
    .getElementById("form-online")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      addOnlineMovement(state, {
        metodo: document.getElementById("metodo-online").value,
        monto: parseFloat(document.getElementById("monto-online").value) || 0,
        operaciones:
          parseInt(document.getElementById("operaciones-online").value) || 0,
        fecha: new Date(),
      });
      this.reset();
    });

  // ... otros formularios
}
