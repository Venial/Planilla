// Inicialización de event listeners
import { guardarPlanilla, cargarPlanilla } from "./modules/storage.js";
import { imprimirPlanilla } from "./modules/print.js";
import { inicializarFormularios } from "./modules/forms.js";
import { inicializarCalendarios } from "./modules/calendar.js";
import { formatDate } from "./core/helpers.js";
import { actualizarCalculos } from "./modules/calculations.js";

export function inicializarEventListeners() {
  // Configuración inicial de fecha
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];
  document.getElementById("fecha-planilla").value = todayFormatted;
  document.getElementById("fecha-display").textContent =
    formatDate(todayFormatted);

  // Event listeners principales
  document
    .getElementById("fecha-planilla")
    .addEventListener("change", function () {
      document.getElementById("fecha-display").textContent = formatDate(
        this.value
      );
    });

  document
    .getElementById("btn-guardar")
    .addEventListener("click", guardarPlanilla);
  document
    .getElementById("btn-imprimir")
    .addEventListener("click", imprimirPlanilla);

  const datosPrincipalesIds = [
    "balance-inicial",
    "balance-cierre",
    "efectivo-caja",
    "venta-sistema",
  ];

  datosPrincipalesIds.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      // Listener para cambio manual
      input.addEventListener("input", actualizarCalculos);

      // Listener para cuando pierde el foco
      input.addEventListener("change", actualizarCalculos);
    }
  });

  // Inicializar otros módulos
  inicializarFormularios();
  inicializarCalendarios();
}
