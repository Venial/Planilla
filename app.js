document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
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
  const diferenciaSistemaElement =
    document.getElementById("diferencia-sistema");
  const listaOnline = document.getElementById("lista-online");
  const listaPosnet = document.getElementById("lista-posnet");
  const listaEgresos = document.getElementById("lista-egresos");
  const totalOpsOnline = document.getElementById("total-ops-online");
  const totalMontoOnline = document.getElementById("total-monto-online");
  const totalOpsPosnet = document.getElementById("total-ops-posnet");
  const totalMontoPosnet = document.getElementById("total-monto-posnet");
  const totalOpsEgresos = document.getElementById("total-ops-egresos");
  const totalMontoEgresos = document.getElementById("total-monto-egresos");
  // Elementos del DOM para observaciones
  const observacionesInput = document.getElementById("observaciones");
  const observacionesPrint = document.getElementById("observaciones-print");
  const editObservacionesBtn = document.getElementById(
    "edit-observaciones-btn"
  );
  const saveObservacionesBtn = document.getElementById(
    "save-observaciones-btn"
  );

  // Configurar eventos para observaciones
  editObservacionesBtn.addEventListener("click", function () {
    // Habilitar edición
    observacionesInput.readOnly = false;
    observacionesInput.focus();

    // Mostrar botón de guardar y ocultar de editar
    editObservacionesBtn.style.display = "none";
    saveObservacionesBtn.style.display = "block";
  });

  saveObservacionesBtn.addEventListener("click", function () {
    // Deshabilitar edición
    observacionesInput.readOnly = true;

    // Actualizar la versión para imprimir
    observacionesPrint.textContent = observacionesInput.value;

    // Mostrar botón de editar y ocultar de guardar
    editObservacionesBtn.style.display = "block";
    saveObservacionesBtn.style.display = "none";

    // Guardar en datosPrincipales
    datosPrincipales.observaciones = observacionesInput.value;
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
    const operaciones = parseInt(
      document.getElementById("operaciones-online").value
    );
    const descripcion =
      document.getElementById("descripcion-online").value || "Pago online";

    agregarMovimientoOnline({
      metodo: metodo,
      monto: monto,
      operaciones: operaciones,
      descripcion: descripcion,
      fecha: new Date(),
    });

    this.reset();
  });

  // Formulario Pagos POSNET
  formPosnet.addEventListener("submit", function (e) {
    e.preventDefault();

    const tipoTarjeta = document.getElementById("tipo-posnet").value;
    const monto = parseFloat(document.getElementById("monto-posnet").value);
    const operaciones = parseInt(
      document.getElementById("operaciones-posnet").value
    );
    const descripcion =
      document.getElementById("descripcion-posnet").value || "Pago POSNET";

    agregarMovimientoPosnet({
      tipoTarjeta: tipoTarjeta,
      monto: monto,
      operaciones: operaciones,
      descripcion: descripcion,
      fecha: new Date(),
    });

    this.reset();
  });

  // Formulario Egresos
  formEgreso.addEventListener("submit", function (e) {
    e.preventDefault();

    const metodo = document.getElementById("metodo-egreso").value;
    const monto = parseFloat(document.getElementById("monto-egreso").value);
    const operaciones =
      parseInt(document.getElementById("operaciones-egreso").value) || 0;
    const concepto =
      document.getElementById("concepto-egreso").value || "Egreso";

    agregarMovimientoEgreso({
      metodo: metodo,
      monto: monto,
      operaciones: operaciones,
      concepto: concepto,
      fecha: new Date(),
    });

    this.reset();
  });

  // Función para configurar campos readonly
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

  // Función para configurar botones de edición
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

  // Función para alternar entre modo edición y readonly
  function toggleEditField(field, fieldName) {
    if (field.readOnly) {
      field.readOnly = false;
      field.classList.remove("readonly-input");
      field.focus();
    } else {
      field.readOnly = true;
      field.classList.add("readonly-input");
      // Actualizar el valor en datosPrincipales
      datosPrincipales[fieldName] =
        fieldName === "observaciones"
          ? field.value
          : parseFloat(field.value) || 0;
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

  // Función para actualizar lista online
  function actualizarListaOnline() {
    listaOnline.innerHTML = "";

    let totalOps = 0;
    let totalMonto = 0;

    movimientosOnline.forEach((mov, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${formatNombreMetodo(mov.metodo)}</td>
        <td>${mov.descripcion}</td>
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

    totalOpsOnline.textContent = totalOps;
    totalMontoOnline.textContent = `$${totalMonto.toFixed(2)}`;
  }

  // Función para actualizar lista POSNET
  function actualizarListaPosnet() {
    listaPosnet.innerHTML = "";

    let totalOps = 0;
    let totalMonto = 0;

    movimientosPosnet.forEach((mov, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${formatNombreMetodo(mov.tipoTarjeta)}</td>
        <td>${mov.descripcion}</td>
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

    totalOpsPosnet.textContent = totalOps;
    totalMontoPosnet.textContent = `$${totalMonto.toFixed(2)}`;
  }

  // Función para actualizar lista egresos
  function actualizarListaEgresos() {
    listaEgresos.innerHTML = "";

    let totalOps = 0;
    let totalMonto = 0;

    movimientosEgresos.forEach((mov, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${formatNombreMetodo(mov.metodo)}</td>
        <td>${mov.concepto}</td>
        <td>${mov.operaciones}</td>
        <td class="text-danger">$${mov.monto.toFixed(2)}</td>
        <td class="no-print">
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoEgreso(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      listaEgresos.appendChild(row);

      totalOps += mov.operaciones;
      totalMonto += mov.monto;
    });

    totalOpsEgresos.textContent = totalOps;
    totalMontoEgresos.textContent = `$${totalMonto.toFixed(2)}`;
  }

  // Función para actualizar todos los cálculos
  function actualizarCalculos() {
    // ... (resto del código existente)
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

    // Calcular total calculado
    const totalCalculado =
      diferenciaBalance +
      datosPrincipales.efectivoCaja +
      totalOnline +
      totalPosnet -
      totalEgresos;
    totalCalculadoElement.textContent = `$${totalCalculado.toFixed(2)}`;

    // Calcular diferencia con sistema
    const diferenciaSistema = totalCalculado - datosPrincipales.ventaSistema;
    diferenciaSistemaElement.textContent = `$${diferenciaSistema.toFixed(2)}`;
    diferenciaSistemaElement.className =
      diferenciaSistema >= 0 ? "text-success" : "text-danger";
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
  document
    .getElementById("btn-imprimir")
    .addEventListener("click", function () {
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
