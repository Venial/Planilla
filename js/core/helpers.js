// Funciones de ayuda
import { METODOS_NOMBRES } from "./constants.js";

export function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
}

export function formatNombreMetodo(metodo) {
  return METODOS_NOMBRES[metodo] || metodo;
}

export function toggleEditField(field) {
  if (field.readOnly) {
    field.readOnly = false;
    field.classList.remove("readonly-input");
    field.focus();
  } else {
    field.readOnly = true;
    field.classList.add("readonly-input");
  }
}
