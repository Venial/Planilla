// Funciones de ayuda
import { METODOS_NOMBRES } from "./constants.js";

export function formatDate(dateString) {
  // Asegurarnos de manejar correctamente la fecha local
  const date = new Date(dateString);

  // Ajustar para zona horaria de Argentina (UTC-3)
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + offset);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  };

  return date.toLocaleDateString("es-AR", options);
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
