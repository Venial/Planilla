document.addEventListener("DOMContentLoaded", function () {
  // Configuración inicial de fecha
  const fechaPlanillaInput = document.getElementById("fecha-planilla");
  const fechaDisplay = document.getElementById("fecha-display");
  const today = new Date();
  fechaPlanillaInput.value = today.toISOString().split("T")[0];
  fechaDisplay.textContent = formatDate(fechaPlanillaInput.value);

  fechaPlanillaInput.addEventListener("change", function () {
    fechaDisplay.textContent = formatDate(this.value);
  });

  // Función para formatear fecha
  function formatDate(dateString) {
    const options = { day: "2-digit", month: "2-d. igit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-AR", options);
  }

  // Función de cálculos actualizada según tu fórmula
  function actualizarCalculos() {
    const bolsinInicial =
      parseFloat(document.getElementById("balance-inicial").value) || 0;
    const bolsinCierre =
      parseFloat(document.getElementById("balance-cierre").value) || 0;
    const efectivoCaja =
      parseFloat(document.getElementById("efectivo-caja").value) || 0;
    const totalSistema =
      parseFloat(document.getElementById("venta-sistema").value) || 0;

    // Totales de movimientos (deberás adaptar estas líneas a tus variables reales)
    const totalOnline = 0; // Reemplaza con tu lógica real
    const totalPosnet = 0; // Reemplaza con tu lógica real
    const totalEgresos = 0; // Reemplaza con tu lógica real

    // Aplicar fórmula exacta
    const diferenciaBolsin = bolsinCierre - bolsinInicial;
    const totalEfectivoCaja = efectivoCaja + totalEgresos;
    const totalDigital = totalOnline + totalPosnet;
    const totalPlanilla = totalEfectivoCaja + totalDigital + diferenciaBolsin;
    const diferenciaCierre = totalPlanilla - totalSistema;

    // Actualizar UI
    document.getElementById(
      "diferencia-balance"
    ).textContent = `$${diferenciaBolsin.toFixed(2)}`;
    document.getElementById(
      "total-efectivo"
    ).textContent = `$${totalEfectivoCaja.toFixed(2)}`;
    document.getElementById(
      "total-online"
    ).textContent = `$${totalOnline.toFixed(2)}`;
    document.getElementById(
      "total-posnet"
    ).textContent = `$${totalPosnet.toFixed(2)}`;
    document.getElementById(
      "total-egresos"
    ).textContent = `$${totalEgresos.toFixed(2)}`;
    document.getElementById(
      "total-calculado"
    ).textContent = `$${totalPlanilla.toFixed(2)}`;
    document.getElementById(
      "total-sistema"
    ).textContent = `$${totalSistema.toFixed(2)}`;
    document.getElementById(
      "diferencia-sistema"
    ).textContent = `$${diferenciaCierre.toFixed(2)}`;

    // Colores según resultados
    document.getElementById("diferencia-balance").className =
      diferenciaBolsin >= 0 ? "text-success" : "text-danger";
    document.getElementById("diferencia-sistema").className =
      diferenciaCierre >= 0 ? "text-success" : "text-danger";
  }

  // Configuración de los botones de edición (similar a tu versión anterior)
  document.querySelectorAll('[id^="edit-"]').forEach((btn) => {
    btn.addEventListener("click", function () {
      const fieldId = this.id.replace("edit-", "");
      const field = document.getElementById(fieldId);
      toggleEditField(field, fieldId);
    });
  });

  function toggleEditField(field, fieldId) {
    if (field.readOnly) {
      field.readOnly = false;
      field.classList.remove("readonly-input");
      field.focus();
    } else {
      field.readOnly = true;
      field.classList.add("readonly-input");
      actualizarCalculos();
    }
  }

  // Inicializar cálculos
  actualizarCalculos();
});
