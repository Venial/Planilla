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
  const observacionesInput = document.getElementById("observaciones");
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
  const observacionesPrint = document.getElementById("observaciones-print");
  const editObservacionesBtn = document.getElementById(
    "edit-observaciones-btn"
  );
  const saveObservacionesBtn = document.getElementById(
    "save-observaciones-btn"
  );
  const fechaPlanillaInput = document.getElementById("fecha-planilla");
  const buscarFechaInput = document.getElementById("buscar-fecha");
  const fechaDisplayElement = document.getElementById("fecha-display");
  const btnGuardar = document.getElementById("btn-guardar");
  const btnCargar = document.getElementById("btn-cargar");
  const btnImprimir = document.getElementById("btn-imprimir");
  const filtroOnline = document.getElementById("filtro-online");
  const filtroPosnet = document.getElementById("filtro-posnet");
  const filtroEgresos = document.getElementById("filtro-egresos");

  // Configurar fecha actual por defecto
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  fechaPlanillaInput.value = dateStr;
  buscarFechaInput.value = dateStr;
  fechaDisplayElement.textContent = formatDate(dateStr);

  // Inicialización
  setupEventListeners();
  setupEditButtons();
  actualizarListas();
  actualizarCalculos();

  // Configurar eventos
  function setupEventListeners() {
    fechaPlanillaInput.addEventListener("change", function () {
      fechaDisplayElement.textContent = formatDate(this.value);
    });

    btnGuardar.addEventListener("click", guardarPlanilla);
    btnCargar.addEventListener("click", () =>
      cargarPlanilla(buscarFechaInput.value)
    );
    btnImprimir.addEventListener("click", () => window.print());

    filtroOnline.addEventListener("change", () => actualizarListaOnline());
    filtroPosnet.addEventListener("change", () => actualizarListaPosnet());
    filtroEgresos.addEventListener("change", () => actualizarListaEgresos());

    formOnline.addEventListener("submit", function (e) {
      e.preventDefault();
      agregarMovimientoOnline({
        metodo: document.getElementById("metodo-online").value,
        monto: parseFloat(document.getElementById("monto-online").value) || 0,
        operaciones:
          parseInt(document.getElementById("operaciones-online").value) || 0,
        fecha: new Date(),
      });
      this.reset();
    });

    formPosnet.addEventListener("submit", function (e) {
      e.preventDefault();
      agregarMovimientoPosnet({
        tipoTarjeta: document.getElementById("tipo-posnet").value,
        monto: parseFloat(document.getElementById("monto-posnet").value) || 0,
        operaciones:
          parseInt(document.getElementById("operaciones-posnet").value) || 0,
        fecha: new Date(),
      });
      this.reset();
    });

    formEgreso.addEventListener("submit", function (e) {
      e.preventDefault();
      agregarMovimientoEgreso({
        metodo: document.getElementById("metodo-egreso").value,
        monto: parseFloat(document.getElementById("monto-egreso").value) || 0,
        concepto: document.getElementById("concepto-egreso").value || "Egreso",
        fecha: new Date(),
      });
      this.reset();
    });

    editObservacionesBtn.addEventListener("click", function () {
      observacionesInput.readOnly = false;
      observacionesInput.focus();
      editObservacionesBtn.style.display = "none";
      saveObservacionesBtn.style.display = "block";
    });

    saveObservacionesBtn.addEventListener("click", function () {
      observacionesInput.readOnly = true;
      observacionesPrint.textContent = observacionesInput.value;
      editObservacionesBtn.style.display = "block";
      saveObservacionesBtn.style.display = "none";
      datosPrincipales.observaciones = observacionesInput.value;
    });
  }

  // Configurar botones de edición
  function setupEditButtons() {
    document.querySelectorAll('[id^="edit-"]').forEach((btn) => {
      const fieldId = btn.id.replace("edit-", "");
      const field = document.getElementById(fieldId);

      btn.addEventListener("click", function () {
        toggleEditField(field, fieldId);
      });
    });
  }

  function toggleEditField(field, fieldName) {
    if (field.readOnly) {
      // Modo edición
      field.readOnly = false;
      field.classList.remove("readonly-input");
      field.focus();
    } else {
      // Guardar cambios
      field.readOnly = true;
      field.classList.add("readonly-input");

      // Actualizar datos principales según el tipo de campo
      if (fieldName === "observaciones") {
        datosPrincipales[fieldName] = field.value;
      } else if (fieldName === "total-operaciones") {
        datosPrincipales.totalOperaciones = parseInt(field.value) || 0;
      } else {
        datosPrincipales[fieldName.replace("-", "")] =
          parseFloat(field.value) || 0;
      }

      // Actualizar cálculos
      actualizarCalculos();
    }
  }

  // Función para formatear fecha
  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString("es-AR");
  }

  // Funciones para guardar/cargar planillas
  function guardarPlanilla() {
    const planilla = {
      fecha: fechaPlanillaInput.value,
      datosPrincipales: {
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
    observacionesPrint.textContent = planilla.datosPrincipales.observaciones;

    // Cargar movimientos
    movimientosOnline = planilla.movimientosOnline || [];
    movimientosPosnet = planilla.movimientosPosnet || [];
    movimientosEgresos = planilla.movimientosEgresos || [];

    // Actualizar UI
    actualizarListas();
    actualizarCalculos();

    // Actualizar fecha
    fechaPlanillaInput.value = fecha;
    fechaDisplayElement.textContent = formatDate(fecha);
  }

  // Funciones para manejar movimientos
  function agregarMovimientoOnline(movimiento) {
    movimientosOnline.push(movimiento);
    actualizarListaOnline();
    actualizarCalculos();
  }

  function agregarMovimientoPosnet(movimiento) {
    movimientosPosnet.push(movimiento);
    actualizarListaPosnet();
    actualizarCalculos();
  }

  function agregarMovimientoEgreso(movimiento) {
    movimientosEgresos.push(movimiento);
    actualizarListaEgresos();
    actualizarCalculos();
  }

  // Funciones para actualizar las listas
  function actualizarListas() {
    actualizarListaOnline();
    actualizarListaPosnet();
    actualizarListaEgresos();
  }

  function actualizarListaOnline() {
    listaOnline.innerHTML = "";
    const filtro = filtroOnline.value;
    const movimientosFiltrados = filtro
      ? movimientosOnline.filter((m) => m.metodo === filtro)
      : movimientosOnline;

    let totalOps = 0;
    let totalMonto = 0;

    movimientosFiltrados.forEach((mov, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${formatNombreMetodo(mov.metodo)}</td>
        <td>${mov.operaciones}</td>
        <td class="text-success">$${mov.monto.toFixed(2)}</td>
        <td class="no-print">
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoOnline(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      listaOnline.appendChild(row);
      totalOps += mov.operaciones;
      totalMonto += mov.monto;
    });

    const totalOpsAll = movimientosOnline.reduce(
      (sum, m) => sum + m.operaciones,
      0
    );
    const totalMontoAll = movimientosOnline.reduce(
      (sum, m) => sum + m.monto,
      0
    );

    totalOpsOnline.textContent = totalOpsAll;
    totalMontoOnline.textContent = `$${totalMontoAll.toFixed(2)}`;
  }

  function actualizarListaPosnet() {
    listaPosnet.innerHTML = "";
    const filtro = filtroPosnet.value;
    const movimientosFiltrados = filtro
      ? movimientosPosnet.filter((m) => m.tipoTarjeta === filtro)
      : movimientosPosnet;

    let totalOps = 0;
    let totalMonto = 0;

    movimientosFiltrados.forEach((mov, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${formatNombreMetodo(mov.tipoTarjeta)}</td>
        <td>${mov.operaciones}</td>
        <td class="text-success">$${mov.monto.toFixed(2)}</td>
        <td class="no-print">
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoPosnet(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      listaPosnet.appendChild(row);
      totalOps += mov.operaciones;
      totalMonto += mov.monto;
    });

    const totalOpsAll = movimientosPosnet.reduce(
      (sum, m) => sum + m.operaciones,
      0
    );
    const totalMontoAll = movimientosPosnet.reduce(
      (sum, m) => sum + m.monto,
      0
    );

    totalOpsPosnet.textContent = totalOpsAll;
    totalMontoPosnet.textContent = `$${totalMontoAll.toFixed(2)}`;
  }

  function actualizarListaEgresos() {
    listaEgresos.innerHTML = "";
    const filtro = filtroEgresos.value;
    const movimientosFiltrados = filtro
      ? movimientosEgresos.filter((m) => m.metodo === filtro)
      : movimientosEgresos;

    let totalMonto = 0;

    movimientosFiltrados.forEach((mov, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${formatNombreMetodo(mov.metodo)}</td>
        <td>${mov.concepto}</td>
        <td class="text-danger">$${mov.monto.toFixed(2)}</td>
        <td class="no-print">
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoEgreso(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      listaEgresos.appendChild(row);
      totalMonto += mov.monto;
    });

    const totalMontoAll = movimientosEgresos.reduce(
      (sum, m) => sum + m.monto,
      0
    );
    totalMontoEgresos.textContent = `$${totalMontoAll.toFixed(2)}`;
  }

  // Función principal de cálculos

  function actualizarCalculos() {
    // 1. Obtener valores actuales de los inputs
    const bolsinInicial = parseFloat(balanceInicialInput.value) || 0;
    const bolsinCierre = parseFloat(balanceCierreInput.value) || 0;
    const efectivoCaja = parseFloat(efectivoCajaInput.value) || 0;
    const totalSistema = parseFloat(ventaSistemaInput.value) || 0;

    // 2. Calcular totales de movimientos
    const totalOnline = movimientosOnline.reduce(
      (sum, mov) => sum + mov.monto,
      0
    );
    const totalPosnet = movimientosPosnet.reduce(
      (sum, mov) => sum + mov.monto,
      0
    );
    const totalEgresos = movimientosEgresos.reduce(
      (sum, mov) => sum + mov.monto,
      0
    );

    // 3. Aplicar la fórmula exacta que me indicaste
    const diferenciaBolsin = bolsinCierre - bolsinInicial;
    const totalEfectivoCaja = efectivoCaja + totalEgresos;
    const totalDigital = totalOnline + totalPosnet;
    const totalPlanilla = totalEfectivoCaja + totalDigital + diferenciaBolsin;
    const diferenciaCierre = totalPlanilla - totalSistema;

    // 4. Actualizar la interfaz con los resultados
    diferenciaBalanceElement.textContent = `$${diferenciaBolsin.toFixed(2)}`;
    diferenciaBalanceElement.className =
      diferenciaBolsin >= 0 ? "text-success" : "text-danger";

    totalOnlineElement.textContent = `$${totalOnline.toFixed(2)}`;
    totalPosnetElement.textContent = `$${totalPosnet.toFixed(2)}`;
    totalEgresosElement.textContent = `$${totalEgresos.toFixed(2)}`;

    totalCalculadoElement.textContent = `$${totalPlanilla.toFixed(2)}`;
    totalSistemaElement.textContent = `$${totalSistema.toFixed(2)}`;

    diferenciaSistemaElement.textContent = `$${diferenciaCierre.toFixed(2)}`;
    diferenciaSistemaElement.className =
      diferenciaCierre >= 0 ? "text-success" : "text-danger";

    // 5. Actualizar datos principales
    datosPrincipales = {
      balanceInicial: bolsinInicial,
      balanceCierre: bolsinCierre,
      efectivoCaja: efectivoCaja,
      totalOperaciones: parseInt(totalOperacionesInput.value) || 0,
      ventaSistema: totalSistema,
      observaciones: observacionesInput.value,
    };
  }

  // Función para formatear nombres de métodos
  function formatNombreMetodo(metodo) {
    const nombres = {
      MP: "Mercado Pago",
      CTA_DNI: "Cuenta DNI",
      QR_MP: "QR MP",
      BNA_DEB: "BNA Débito",
      BNA_CRE: "BNA Crédito",
      VISA_DEB: "Visa Débito",
      VISA_CRED: "Visa Crédito",
      VISA_PREP: "Visa Prepago",
      MASTER_DEB: "Mastercard Débito",
      MASTER_CRED: "Mastercard Crédito",
      MASTER_PREP: "Mastercard Prepago",
      AMEX_DEB: "Amex Débito",
      AMEX_CRED: "Amex Crédito",
      CABAL_DEB: "CABAL Débito",
      CABAL_CRED: "CABAL Crédito",
      TRANSF_INM: "Transferencia Inmediata",
      EFECTIVO: "Efectivo",
      TRANSFERENCIA: "Transferencia",
      TARJETA: "Tarjeta",
    };
    return nombres[metodo] || metodo;
  }

  // Funciones globales para eliminar movimientos
  window.eliminarMovimientoOnline = function (index) {
    if (confirm("¿Estás seguro de eliminar este movimiento?")) {
      movimientosOnline.splice(index, 1);
      actualizarListaOnline();
      actualizarCalculos();
    }
  };

  window.eliminarMovimientoPosnet = function (index) {
    if (confirm("¿Estás seguro de eliminar este movimiento?")) {
      movimientosPosnet.splice(index, 1);
      actualizarListaPosnet();
      actualizarCalculos();
    }
  };

  window.eliminarMovimientoEgreso = function (index) {
    if (confirm("¿Estás seguro de eliminar este movimiento?")) {
      movimientosEgresos.splice(index, 1);
      actualizarListaEgresos();
      actualizarCalculos();
    }
  };
});
