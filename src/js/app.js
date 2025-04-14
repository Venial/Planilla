import { STORAGE_KEY } from "./utils/constants";
import { formatDate, formatNombreMetodo } from "./utils/helpers";
import { initializeCalendars } from "./app/components/calendar";
import { setupFormListeners } from "./app/components/forms";
import { updateAllTables } from "./app/components/tables";
import { initializePrint } from "./app/services/print";
import {
  initializeCalculations,
  updateCalculations,
} from "./app/core/calculations";
import { saveSheet, loadSheet, newSheet, clearData } from "./app/core/storage";

document.addEventListener("DOMContentLoaded", function () {
  // Estado global
  const state = {
    onlineMovements: [],
    posnetMovements: [],
    expenseMovements: [],
    currentDate: new Date().toISOString().split("T")[0],
  };

  // Inicialización
  function initializeApp() {
    document.getElementById("fecha-display").textContent = formatDate(
      state.currentDate
    );

    initializeCalendars(state);
    setupFormListeners(state);
    updateAllTables(state);
    initializeCalculations();
    initializePrint(state);

    // Cargar planilla del día si existe
    if (loadSheet(state.currentDate, state)) {
      updateCalculations(state);
    }
  }

  initializeApp();
});
