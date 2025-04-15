import {
  initializeCalculations,
  updateCalculations,
} from "./app/core/calculations.js";
import { STORAGE_KEY } from "./utils/constants.js";
import { setupPrintButton } from "./app/services/print.js";

document.addEventListener("DOMContentLoaded", function () {
  const state = {
    onlineMovements: [],
    posnetMovements: [],
    expenseMovements: [],
    currentDate: new Date().toISOString().split("T")[0],
  };

  function initializeApp() {
    // ... otras inicializaciones
    setupPrintButton();
    // Inicializar cálculos después de cargar los listeners
    initializeCalculations(state);

    // Cargar planilla del día si existe
    if (loadSheet(state.currentDate, state)) {
      updateCalculations(state); // Forzar actualización inicial
    }
  }

  initializeApp();
});
