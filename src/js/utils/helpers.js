export function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("es-AR", options);
}

export function formatNombreMetodo(metodo) {
  return PAYMENT_METHODS[metodo] || metodo;
}
