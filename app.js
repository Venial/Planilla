document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  let movimientosOnline = [];
  let movimientosPosnet = [];
  let movimientosEgresos = [];
  let datosPrincipales = {
    balanceInicial: 0,
    balanceCierre: 0,
    efectivoCaja: 0,
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
  const ventaSistemaInput = document.getElementById("venta-sistema");
  const diferenciaBalanceElement = document.getElementById("diferencia-balance");
  const totalOnlineElement = document.getElementById("total-online");
  const totalPosnetElement = document.getElementById("total-posnet");
  const totalEgresosElement = document.getElementById("total-egresos");
  const totalCalculadoElement = document.getElementById("total-calculado");
  const totalSistemaElement = document.getElementById("total-sistema");
  const diferenciaSistemaElement = document.getElementById("diferencia-sistema");
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
  const editObservacionesBtn = document.getElementById("edit-observaciones-btn");
  const saveObservacionesBtn = document.getElementById("save-observaciones-btn");
  const fechaPlanillaInput = document.getElementById("fecha-planilla");
  const fechaDisplayElement = document.getElementById("fecha-display");
  const filtroOnline = document.getElementById("filtro-online");
  const filtroPosnet = document.getElementById("filtro-posnet");
  const filtroEgresos = document.getElementById("filtro-egresos");

  // Configurar fecha actual por defecto
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  fechaPlanillaInput.value = dateStr;
  fechaDisplayElement.textContent = formatDate(dateStr);

  // Evento para actualizar fecha display
  fechaPlanillaInput.addEventListener('change', function() {
    fechaDisplayElement.textContent = formatDate(this.value);
  });

  // Configurar eventos para observaciones
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

  // Configurar eventos para filtros
  filtroOnline.addEventListener('change', function() {
    actualizarListaOnline();
  });

  filtroPosnet.addEventListener('change', function() {
    actualizarListaPosnet();
  });

  filtroEgresos.addEventListener('change', function() {
    actualizarListaEgresos();
  });

  // Configurar campos de datos principales como readonly inicialmente
  setupReadonlyFields();

  // Configurar botones de edición
  setupEditButtons();

  // Formulario Pagos Online
  formOnline.addEventListener("submit", function (e) {
    e.preventDefault();

    const metodo = document.getElementById("metodo-online").value;
    const monto = parseFloat(document.getElementById("monto-online").value);
    const operaciones = parseInt(document.getElementById("operaciones-online").value);

    agregarMovimientoOnline({
      metodo: metodo,
      monto: monto,
      operaciones: operaciones,
      fecha: new Date(),
    });

    this.reset();
  });

  // Formulario Pagos POSNET
  formPosnet.addEventListener("submit", function (e) {
    e.preventDefault();

    const tipoTarjeta = document.getElementById("tipo-posnet").value;
    const monto = parseFloat(document.getElementById("monto-posnet").value);
    const operaciones = parseInt(document.getElementById("operaciones-posnet").value);

    agregarMovimientoPosnet({
      tipoTarjeta: tipoTarjeta,
      monto: monto,
      operaciones: operaciones,
      fecha: new Date(),
    });

    this.reset();
  });

  // Formulario Egresos
  formEgreso.addEventListener("submit", function (e) {
    e.preventDefault();

    const metodo = document.getElementById("metodo-egreso").value;
    const monto = parseFloat(document.getElementById("monto-egreso").value);
    const concepto = document.getElementById("concepto-egreso").value || "Egreso";

    agregarMovimientoEgreso({
      metodo: metodo,
      monto: monto,
      concepto: concepto,
      fecha: new Date(),
    });

    this.reset();
  });

  // Función para formatear fecha
  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR');
  }

  // Función para configurar campos readonly
  function setupReadonlyFields() {
    balanceInicialInput.readOnly = true;
    balanceCierreInput.readOnly = true;
    efectivoCajaInput.readOnly = true;
    ventaSistemaInput.readOnly = true;
    observacionesInput.readOnly = true;

    balanceInicialInput.classList.add("readonly-input");
    balanceCierreInput.classList.add("readonly-input");
    efectivoCajaInput.classList.add("readonly-input");
    ventaSistemaInput.classList.add("readonly-input");
    observacionesInput.classList.add("readonly-input");
  }

  // Función para configurar botones de edición
  function setupEditButtons() {
    document.getElementById("edit-balance-inicial").addEventListener("click", function () {
      toggleEditField(balanceInicialInput, "balanceInicial");
    });

    document.getElementById("edit-balance-cierre").addEventListener("click", function () {
      toggleEditField(balanceCierreInput, "balanceCierre");
    });

    document.getElementById("edit-efectivo-caja").addEventListener("click", function () {
      toggleEditField(efectivoCajaInput, "efectivoCaja");
    });

    document.getElementById("edit-venta-sistema").addEventListener("click", function () {
      toggleEditField(ventaSistemaInput, "ventaSistema");
    });

    document.getElementById("edit-observaciones").addEventListener("click", function () {
      toggleEditField(observacionesInput, "observaciones");
    });
  }

  // Función para alternar entre modo edición y readonly
  function toggleEditField(field, fieldName) {
    if (field.readOnly) {
      field.readOnly = false;
      field.classList.remove("readonly-input");
      field.focus();
    } else {
      field.readOnly = true;
      field.classList.add("readonly-input");
      datosPrincipales[fieldName] = fieldName === "observaciones" ? field.value : parseFloat(field.value) || 0;
      actualizarCalculos();
    }
  }

  // Función para agregar movimiento online
  function agregarMovimientoOnline(movimiento) {
    movimientosOnline.push(movimiento);
    actualizarListaOnline();
    actualizarCalculos();
  }

  // Función para agregar movimiento POSNET
  function agregarMovimientoPosnet(movimiento) {
    movimientosPosnet.push(movimiento);
    actualizarListaPosnet();
    actualizarCalculos();
  }

  // Función para agregar movimiento egreso
  function agregarMovimientoEgreso(movimiento) {
    movimientosEgresos.push(movimiento);
    actualizarListaEgresos();
    actualizarCalculos();
  }

  // Función para actualizar lista online con filtro
  function actualizarListaOnline() {
    listaOnline.innerHTML = "";

    const filtro = filtroOnline.value;
    const movimientosFiltrados = filtro 
      ? movimientosOnline.filter(m => m.metodo === filtro)
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

    // Actualizar totales (siempre con todos los movimientos, no solo los filtrados)
    const totalOpsAll = movimientosOnline.reduce((sum, m) => sum + m.operaciones, 0);
    const totalMontoAll = movimientosOnline.reduce((sum, m) => sum + m.monto, 0);
    
    totalOpsOnline.textContent = totalOpsAll;
    totalMontoOnline.textContent = `$${totalMontoAll.toFixed(2)}`;
  }

  // Función para actualizar lista POSNET con filtro
  function actualizarListaPosnet() {
    listaPosnet.innerHTML = "";

    const filtro = filtroPosnet.value;
    const movimientosFiltrados = filtro 
      ? movimientosPosnet.filter(m => m.tipoTarjeta === filtro)
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

    // Actualizar totales (siempre con todos los movimientos, no solo los filtrados)
    const totalOpsAll = movimientosPosnet.reduce((sum, m) => sum + m.operaciones, 0);
    const totalMontoAll = movimientosPosnet.reduce((sum, m) => sum + m.monto, 0);
    
    totalOpsPosnet.textContent = totalOpsAll;
    totalMontoPosnet.textContent = `$${totalMontoAll.toFixed(2)}`;
  }

  // Función para actualizar lista egresos con filtro
  function actualizarListaEgresos() {
    listaEgresos.innerHTML = "";

    const filtro = filtroEgresos.value;
    const movimientosFiltrados = filtro 
      ? movimientosEgresos.filter(m => m.metodo === filtro)
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

    // Actualizar totales (siempre con todos los movimientos, no solo los filtrados)
    const totalMontoAll = movimientosEgresos.reduce((sum, m) => sum + m.monto, 0);
    totalMontoEgresos.textContent = `$${totalMontoAll.toFixed(2)}`;
  }

  // Función para actualizar todos los cálculos
  function actualizarCalculos() {
    // Actualizar datos principales
    datosPrincipales.balanceInicial = parseFloat(balanceInicialInput.value) || 0;
    datosPrincipales.balanceCierre = parseFloat(balanceCierreInput.value) || 0;
    datosPrincipales.efectivoCaja = parseFloat(efectivoCajaInput.value) || 0;
    datosPrincipales.ventaSistema = parseFloat(ventaSistemaInput.value) || 0;
    datosPrincipales.observaciones = observacionesInput.value;

    // Actualizar observaciones para impresión
    observacionesPrint.textContent = datosPrincipales.observaciones;

    // Calcular diferencia de balance
    const diferenciaBalance = datosPrincipales.balanceCierre - datosPrincipales.balanceInicial;
    diferenciaBalanceElement.textContent = `$${diferenciaBalance.toFixed(2)}`;
    diferenciaBalanceElement.className = diferenciaBalance >= 0 ? "text-success" : "text-danger";

    // Calcular totales por categoría
    const totalOnline = movimientosOnline.reduce((sum, m) => sum + m.monto, 0);
    const totalPosnet = movimientosPosnet.reduce((sum, m) => sum + m.monto, 0);
    const totalEgresos = movimientosEgresos.reduce((sum, m) => sum + m.monto, 0);

    totalOnlineElement.textContent = `$${totalOnline.toFixed(2)}`;
    totalPosnetElement.textContent = `$${totalPosnet.toFixed(2)}`;
    totalEgresosElement.textContent = `$${totalEgresos.toFixed(2)}`;

    // Calcular total calculado según la fórmula solicitada
    const totalCalculado = diferenciaBalance + totalOnline + totalPosnet + totalEgresos + datosPrincipales.efectivoCaja;
    totalCalculadoElement.textContent = `$${totalCalculado.toFixed(2)}`;

    // Mostrar total sistema (venta del sistema)
    totalSistemaElement.textContent = `$${datosPrincipales.ventaSistema.toFixed(2)}`;

    // Calcular diferencia con sistema
    const diferenciaSistema = totalCalculado - datosPrincipales.ventaSistema;
    diferenciaSistemaElement.textContent = `$${diferenciaSistema.toFixed(2)}`;
    diferenciaSistemaElement.className = diferenciaSistema >= 0 ? "text-success" : "text-danger";
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

  // Función para imprimir
  document.getElementById("btn-imprimir").addEventListener("click", function () {
    window.print();
  });

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