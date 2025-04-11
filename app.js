document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  const STORAGE_KEY = "planillas_res";
  let movimientosOnline = [];
  let movimientosPosnet = [];
  let movimientosEgresos = [];
  let datosPrincipales = {
    balanceInicial: 0,
    balanceCierre: 0,
    efectivoCaja: 0,
    totalOperaciones: 0,
    ventaSistema: 0,
    observaciones: "",
  };

  // Elementos del DOM
  const formOnline = document.getElementById("form-online");
  const formPosnet = document.getElementById("form-posnet");
  const formEgreso = document.getElementById("form-egreso");
  const balanceInicialInput = document.getElementById("balance-inicial");
  const balanceCierreInput = document.getElementById("balance-cierre");
  const efectivoCajaInput = document.getElementById("efectivo-caja");
  const totalOperacionesInput = document.getElementById("total-operaciones");
  const ventaSistemaInput = document.getElementById("venta-sistema");
  const diferenciaBalanceElement =
    document.getElementById("diferencia-balance");
  const totalOnlineElement = document.getElementById("total-online");
  const totalPosnetElement = document.getElementById("total-posnet");
  const totalEgresosElement = document.getElementById("total-egresos");
  const totalCalculadoElement = document.getElementById("total-calculado");
  const totalSistemaElement = document.getElementById("total-sistema");
  const diferenciaSistemaElement =
    document.getElementById("diferencia-sistema");
  const listaOnline = document.getElementById("lista-online");
  const listaPosnet = document.getElementById("lista-posnet");
  const listaEgresos = document.getElementById("lista-egresos");
  const totalOpsOnline = document.getElementById("total-ops-online");
  const totalMontoOnline = document.getElementById("total-monto-online");
  const totalOpsPosnet = document.getElementById("total-ops-posnet");
  const totalMontoPosnet = document.getElementById("total-monto-posnet");
  const totalMontoEgresos = document.getElementById("total-monto-egresos");
  const observacionesInput = document.getElementById("observaciones");
  const observacionesPrint = document.getElementById("observaciones-print");
  const editObservacionesBtn = document.getElementById(
    "edit-observaciones-btn"
  );
  const saveObservacionesBtn = document.getElementById(
    "save-observaciones-btn"
  );
  const fechaPlanillaInput = document.getElementById("fecha-planilla");
  const fechaDisplayElement = document.getElementById("fecha-display");
  const btnGuardar = document.getElementById("btn-guardar");
  const btnCargar = document.getElementById("btn-cargar");
  const buscarFechaInput = document.getElementById("buscar-fecha");

  // Configurar fecha actual por defecto
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  fechaPlanillaInput.value = dateStr;
  buscarFechaInput.value = dateStr;
  fechaDisplayElement.textContent = formatDate(dateStr);

  // Evento para actualizar fecha display
  fechaPlanillaInput.addEventListener("change", function () {
    fechaDisplayElement.textContent = formatDate(this.value);
  });

  // Configurar eventos para guardado/carga
  btnGuardar.addEventListener("click", guardarPlanilla);
  btnCargar.addEventListener("click", () => {
    cargarPlanilla(buscarFechaInput.value);
  });

  // Funciones para guardar/cargar planillas
  function guardarPlanilla() {
    const planilla = {
      fecha: fechaPlanillaInput.value,
      datosPrincipales: {
        ...datosPrincipales,
        balanceInicial: parseFloat(balanceInicialInput.value) || 0,
        balanceCierre: parseFloat(balanceCierreInput.value) || 0,
        efectivoCaja: parseFloat(efectivoCajaInput.value) || 0,
        totalOperaciones: parseInt(totalOperacionesInput.value) || 0,
        ventaSistema: parseFloat(ventaSistemaInput.value) || 0,
        observaciones: observacionesInput.value,
      },
      movimientosOnline: movimientosOnline,
      movimientosPosnet: movimientosPosnet,
      movimientosEgresos: movimientosEgresos,
      timestamp: new Date().toISOString(),
    };

    const planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    planillas[planilla.fecha] = planilla;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planillas));

    alert(`Planilla del ${formatDate(planilla.fecha)} guardada correctamente`);
  }

  function cargarPlanilla(fecha) {
    const planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const planilla = planillas[fecha];

    if (!planilla) {
      alert("No se encontró planilla para esta fecha");
      return;
    }

    // Cargar datos principales
    balanceInicialInput.value = planilla.datosPrincipales.balanceInicial;
    balanceCierreInput.value = planilla.datosPrincipales.balanceCierre;
    efectivoCajaInput.value = planilla.datosPrincipales.efectivoCaja;
    totalOperacionesInput.value = planilla.datosPrincipales.totalOperaciones;
    ventaSistemaInput.value = planilla.datosPrincipales.ventaSistema;
    observacionesInput.value = planilla.datosPrincipales.observaciones;

    // Cargar movimientos
    movimientosOnline = planilla.movimientosOnline || [];
    movimientosPosnet = planilla.movimientosPosnet || [];
    movimientosEgresos = planilla.movimientosEgresos || [];

    // Actualizar UI
    actualizarListaOnline();
    actualizarListaPosnet();
    actualizarListaEgresos();
    actualizarCalculos();

    // Actualizar fecha
    fechaPlanillaInput.value = fecha;
    fechaDisplayElement.textContent = formatDate(fecha);
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    // Ajuste para zona horaria
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString("es-AR");
  }

  // Resto de tu código JavaScript (configuración de eventos, funciones de actualización, etc.)
  // ... (mantén todas las otras funciones igual que antes) ...

  // Configurar campos de datos principales como readonly inicialmente
  setupReadonlyFields();

  // Configurar botones de edición
  setupEditButtons();

  function setupReadonlyFields() {
    balanceInicialInput.readOnly = true;
    balanceCierreInput.readOnly = true;
    efectivoCajaInput.readOnly = true;
    totalOperacionesInput.readOnly = true;
    ventaSistemaInput.readOnly = true;
    observacionesInput.readOnly = true;

    balanceInicialInput.classList.add("readonly-input");
    balanceCierreInput.classList.add("readonly-input");
    efectivoCajaInput.classList.add("readonly-input");
    totalOperacionesInput.classList.add("readonly-input");
    ventaSistemaInput.classList.add("readonly-input");
    observacionesInput.classList.add("readonly-input");
  }

  function setupEditButtons() {
    document
      .getElementById("edit-balance-inicial")
      .addEventListener("click", function () {
        toggleEditField(balanceInicialInput, "balanceInicial");
      });

    document
      .getElementById("edit-balance-cierre")
      .addEventListener("click", function () {
        toggleEditField(balanceCierreInput, "balanceCierre");
      });

    document
      .getElementById("edit-efectivo-caja")
      .addEventListener("click", function () {
        toggleEditField(efectivoCajaInput, "efectivoCaja");
      });

    document
      .getElementById("edit-total-operaciones")
      .addEventListener("click", function () {
        toggleEditField(totalOperacionesInput, "totalOperaciones");
      });

    document
      .getElementById("edit-venta-sistema")
      .addEventListener("click", function () {
        toggleEditField(ventaSistemaInput, "ventaSistema");
      });

    document
      .getElementById("edit-observaciones")
      .addEventListener("click", function () {
        toggleEditField(observacionesInput, "observaciones");
      });
  }

  function toggleEditField(field, fieldName) {
    if (field.readOnly) {
      field.readOnly = false;
      field.classList.remove("readonly-input");
      field.focus();
    } else {
      field.readOnly = true;
      field.classList.add("readonly-input");
      datosPrincipales[fieldName] =
        fieldName === "observaciones"
          ? field.value
          : parseFloat(field.value) || 0;
      actualizarCalculos();
    }
  }

  // Resto de las funciones (actualizarListas, agregarMovimientos, etc.)
  // ... (mantén todas las otras funciones igual que antes) ...

  // Función para actualizar todos los cálculos
  function actualizarCalculos() {
    // Actualizar datos principales
    datosPrincipales.balanceInicial =
      parseFloat(balanceInicialInput.value) || 0;
    datosPrincipales.balanceCierre = parseFloat(balanceCierreInput.value) || 0;
    datosPrincipales.efectivoCaja = parseFloat(efectivoCajaInput.value) || 0;
    datosPrincipales.totalOperaciones =
      parseInt(totalOperacionesInput.value) || 0;
    datosPrincipales.ventaSistema = parseFloat(ventaSistemaInput.value) || 0;
    datosPrincipales.observaciones = observacionesInput.value;

    // Actualizar observaciones para impresión
    observacionesPrint.textContent = datosPrincipales.observaciones;

    // Calcular diferencia de balance
    const diferenciaBalance =
      datosPrincipales.balanceCierre - datosPrincipales.balanceInicial;
    diferenciaBalanceElement.textContent = `$${diferenciaBalance.toFixed(2)}`;
    diferenciaBalanceElement.className =
      diferenciaBalance >= 0 ? "text-success" : "text-danger";

    // Calcular totales por categoría
    const totalOnline = movimientosOnline.reduce((sum, m) => sum + m.monto, 0);
    const totalPosnet = movimientosPosnet.reduce((sum, m) => sum + m.monto, 0);
    const totalEgresos = movimientosEgresos.reduce(
      (sum, m) => sum + m.monto,
      0
    );

    totalOnlineElement.textContent = `$${totalOnline.toFixed(2)}`;
    totalPosnetElement.textContent = `$${totalPosnet.toFixed(2)}`;
    totalEgresosElement.textContent = `$${totalEgresos.toFixed(2)}`;

    // Calcular total calculado según la fórmula solicitada
    const totalCalculado =
      diferenciaBalance +
      totalOnline +
      totalPosnet +
      totalEgresos +
      datosPrincipales.efectivoCaja;
    totalCalculadoElement.textContent = `$${totalCalculado.toFixed(2)}`;

    // Mostrar total sistema (venta del sistema)
    totalSistemaElement.textContent = `$${datosPrincipales.ventaSistema.toFixed(
      2
    )}`;

    // Calcular diferencia con sistema
    const diferenciaSistema = totalCalculado - datosPrincipales.ventaSistema;
    diferenciaSistemaElement.textContent = `$${diferenciaSistema.toFixed(2)}`;
    diferenciaSistemaElement.className =
      diferenciaSistema >= 0 ? "text-success" : "text-danger";
  }

  // Resto de las funciones (formatNombreMetodo, eliminarMovimientos, etc.)
  // ... (mantén todas las otras funciones igual que antes) ...
});
