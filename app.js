document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  const STORAGE_KEY = "planillas_res";
  let movimientosOnline = [];
  let movimientosPosnet = [];
  let movimientosEgresos = [];

  // Formularios
  const formOnline = document.getElementById("form-online");
  const formPosnet = document.getElementById("form-posnet");
  const formEgreso = document.getElementById("form-egreso");

  // Tablas
  const listaOnline = document.getElementById("lista-online");
  const listaPosnet = document.getElementById("lista-posnet");
  const listaEgresos = document.getElementById("lista-egresos");

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
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-AR", options);
  }

  // Formulario Pagos Online
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

  // Formulario Pagos POSNET
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

  // Formulario Egresos
  formEgreso.addEventListener("submit", function (e) {
    e.preventDefault();
    agregarMovimientoEgreso({
      metodo: document.getElementById("metodo-egreso").value,
      concepto: document.getElementById("concepto-egreso").value || "Egreso",
      monto: parseFloat(document.getElementById("monto-egreso").value) || 0,
      fecha: new Date(),
    });
    this.reset();
  });

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
  function actualizarListaOnline() {
    listaOnline.innerHTML = "";
    let totalOps = 0;
    let totalMonto = 0;

    movimientosOnline.forEach((mov, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${formatNombreMetodo(mov.metodo)}</td>
            <td>${mov.operaciones}</td>
            <td class="text-success">$${mov.monto.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoOnline(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
      listaOnline.appendChild(row);
      totalOps += mov.operaciones;
      totalMonto += mov.monto;
    });

    document.getElementById("total-ops-online").textContent = totalOps;
    document.getElementById(
      "total-monto-online"
    ).textContent = `$${totalMonto.toFixed(2)}`;
  }

  function actualizarListaPosnet() {
    listaPosnet.innerHTML = "";
    let totalOps = 0;
    let totalMonto = 0;

    movimientosPosnet.forEach((mov, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${formatNombreMetodo(mov.tipoTarjeta)}</td>
            <td>${mov.operaciones}</td>
            <td class="text-success">$${mov.monto.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoPosnet(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
      listaPosnet.appendChild(row);
      totalOps += mov.operaciones;
      totalMonto += mov.monto;
    });

    document.getElementById("total-ops-posnet").textContent = totalOps;
    document.getElementById(
      "total-monto-posnet"
    ).textContent = `$${totalMonto.toFixed(2)}`;
  }

  function actualizarListaEgresos() {
    listaEgresos.innerHTML = "";
    let totalMonto = 0;

    movimientosEgresos.forEach((mov, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${formatNombreMetodo(mov.metodo)}</td>
            <td>${mov.concepto}</td>
            <td class="text-danger">$${mov.monto.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarMovimientoEgreso(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
      listaEgresos.appendChild(row);
      totalMonto += mov.monto;
    });

    document.getElementById(
      "total-monto-egresos"
    ).textContent = `$${totalMonto.toFixed(2)}`;
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

    // Calcular totales de movimientos
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
      MASTER_DEB: "Mastercard Débito",
      MASTER_CRED: "Mastercard Crédito",
      AMEX: "American Express",
      CABAL: "CABAL",
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

  // Inicializar cálculos
  actualizarCalculos();
});
