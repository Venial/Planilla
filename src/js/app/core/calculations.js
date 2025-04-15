export function initializeCalculations(state) {
  // Configurar event listeners para los campos de datos principales
  const calculationFields = [
    "balance-inicial",
    "balance-cierre",
    "efectivo-caja",
    "venta-sistema",
  ];

  calculationFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.addEventListener("change", () => updateCalculations(state));
  });
}

export function updateCalculations(state) {
  const bolsinInicial =
    parseFloat(document.getElementById("balance-inicial").value) || 0;
  const bolsinCierre =
    parseFloat(document.getElementById("balance-cierre").value) || 0;
  const efectivoCaja =
    parseFloat(document.getElementById("efectivo-caja").value) || 0;
  const totalSistema =
    parseFloat(document.getElementById("venta-sistema").value) || 0;

  // Calcular totales de movimientos desde el estado
  const totalOnline = state.onlineMovements.reduce(
    (sum, mov) => sum + mov.monto,
    0
  );
  const totalPosnet = state.posnetMovements.reduce(
    (sum, mov) => sum + mov.monto,
    0
  );
  const totalEgresos = state.expenseMovements.reduce(
    (sum, mov) => sum + mov.monto,
    0
  );

  // Resto del cálculo...
}
