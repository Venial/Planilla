document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  const STORAGE_KEY = "planillas_res";
  let movimientosOnline = [];
  let movimientosPosnet = [];
  let movimientosEgresos = [];
  let fechaActual = new Date().toISOString().split("T")[0];

  // Elementos del DOM
  const fechaDisplay = document.getElementById("fecha-display");

  // Formularios
  const formOnline = document.getElementById("form-online");
  const formPosnet = document.getElementById("form-posnet");
  const formEgreso = document.getElementById("form-egreso");

  // Tablas
  const listaOnline = document.getElementById("lista-online");
  const listaPosnet = document.getElementById("lista-posnet");
  const listaEgresos = document.getElementById("lista-egresos");

  // Configuración inicial
  fechaDisplay.textContent = formatDate(fechaActual);
  inicializarCalendarios();
  inicializarEventListeners();
  actualizarCalculos();

  // Funciones auxiliares
  function formatDate(dateString) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("es-AR", options);
  }

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

  // Funciones para calendarios
  function inicializarCalendarios() {
    // Calendario para cargar planillas
    const calendarioCargar = new Pikaday({
      field: document.createElement("input"),
      container: document.getElementById("calendario-cargar"),
      format: "YYYY-MM-DD",
      i18n: {
        previousMonth: "Mes anterior",
        nextMonth: "Mes siguiente",
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        weekdays: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      },
      onSelect: function () {
        const fechaSeleccionada = this.getMoment().format("YYYY-MM-DD");
        cargarPlanilla(fechaSeleccionada);
        bootstrap.Dropdown.getInstance(
          document.getElementById("dropdownCargar")
        ).hide();
      },
    });

    // Calendario para nueva planilla
    const calendarioNueva = new Pikaday({
      field: document.createElement("input"),
      container: document.getElementById("calendario-nueva"),
      format: "YYYY-MM-DD",
      i18n: {
        previousMonth: "Mes anterior",
        nextMonth: "Mes siguiente",
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        weekdays: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      },
      onSelect: function () {
        const fechaSeleccionada = this.getMoment().format("YYYY-MM-DD");
        nuevaPlanilla(fechaSeleccionada);
        bootstrap.Dropdown.getInstance(
          document.getElementById("dropdownNueva")
        ).hide();
      },
    });

    // Personalizar botones de los calendarios
    function personalizarBotonesCalendario() {
      document
        .querySelectorAll(".pika-title .pika-prev, .pika-title .pika-next")
        .forEach((btn) => btn.remove());

      const botonSeleccionar = document.createElement("button");
      botonSeleccionar.className = "btn btn-sm btn-primary";
      botonSeleccionar.textContent = "Seleccionar";
      botonSeleccionar.style.margin = "0 5px";

      document.querySelectorAll(".pika-title").forEach((title) => {
        title.appendChild(botonSeleccionar.cloneNode(true));
      });
    }

    // Marcar fechas con planillas guardadas
    function marcarFechasGuardadas() {
      const planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      const fechasGuardadas = Object.keys(planillas);

      fechasGuardadas.forEach((fecha) => {
        const date = new Date(fecha);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        // Para calendario de cargar (verde)
        calendarioCargar.setDate(date);
        const diaCargar = calendarioCargar.el.querySelector(
          `[data-day="${day}"]`
        );
        if (
          diaCargar &&
          diaCargar.getAttribute("data-month") == month &&
          diaCargar.getAttribute("data-year") == year
        ) {
          diaCargar.classList.add("has-planilla-cargar");
        }

        // Para calendario de nueva (rojo)
        calendarioNueva.setDate(date);
        const diaNueva = calendarioNueva.el.querySelector(
          `[data-day="${day}"]`
        );
        if (
          diaNueva &&
          diaNueva.getAttribute("data-month") == month &&
          diaNueva.getAttribute("data-year") == year
        ) {
          diaNueva.classList.add("has-planilla-nueva");
        }
      });
    }

    // Eventos para cuando se muestran los calendarios
    document
      .getElementById("dropdownCargar")
      .addEventListener("shown.bs.dropdown", function () {
        personalizarBotonesCalendario();
        marcarFechasGuardadas();
      });

    document
      .getElementById("dropdownNueva")
      .addEventListener("shown.bs.dropdown", function () {
        personalizarBotonesCalendario();
        marcarFechasGuardadas();
      });
  }

  // Funciones principales
  function guardarPlanilla() {
    const planilla = {
      fecha: fechaActual,
      movimientosOnline: movimientosOnline,
      movimientosPosnet: movimientosPosnet,
      movimientosEgresos: movimientosEgresos,
      balanceInicial:
        parseFloat(document.getElementById("balance-inicial").value) || 0,
      balanceCierre:
        parseFloat(document.getElementById("balance-cierre").value) || 0,
      efectivoCaja:
        parseFloat(document.getElementById("efectivo-caja").value) || 0,
      ventaSistema:
        parseFloat(document.getElementById("venta-sistema").value) || 0,
      observaciones: document.getElementById("observaciones").value,
    };

    let planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    planillas[fechaActual] = planilla;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planillas));

    alert(
      "Planilla guardada correctamente para la fecha " + formatDate(fechaActual)
    );
  }

  function cargarPlanilla(fecha) {
    const planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const planilla = planillas[fecha];

    if (planilla) {
      // Actualizar fecha
      fechaActual = fecha;
      fechaDisplay.textContent = formatDate(fechaActual);

      // Cargar movimientos
      movimientosOnline = planilla.movimientosOnline || [];
      movimientosPosnet = planilla.movimientosPosnet || [];
      movimientosEgresos = planilla.movimientosEgresos || [];

      // Cargar valores
      document.getElementById("balance-inicial").value =
        planilla.balanceInicial || 0;
      document.getElementById("balance-cierre").value =
        planilla.balanceCierre || 0;
      document.getElementById("efectivo-caja").value =
        planilla.efectivoCaja || 0;
      document.getElementById("venta-sistema").value =
        planilla.ventaSistema || 0;
      document.getElementById("observaciones").value =
        planilla.observaciones || "";

      // Actualizar UI
      actualizarListaOnline();
      actualizarListaPosnet();
      actualizarListaEgresos();
      actualizarCalculos();

      return true;
    } else {
      alert("No se encontró una planilla guardada para esta fecha");
      return false;
    }
  }

  function nuevaPlanilla(fecha) {
    const planillas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    if (planillas[fecha]) {
      if (
        !confirm(
          `Ya existe una planilla para ${formatDate(fecha)}. ¿Desea editarla?`
        )
      ) {
        return false;
      }
      return cargarPlanilla(fecha);
    }

    fechaActual = fecha;
    fechaDisplay.textContent = formatDate(fechaActual);
    limpiarDatos();
    return true;
  }

  function limpiarDatos() {
    movimientosOnline = [];
    movimientosPosnet = [];
    movimientosEgresos = [];

    document.getElementById("balance-inicial").value = "";
    document.getElementById("balance-cierre").value = "";
    document.getElementById("efectivo-caja").value = "";
    document.getElementById("venta-sistema").value = "";
    document.getElementById("observaciones").value = "";

    actualizarListaOnline();
    actualizarListaPosnet();
    actualizarListaEgresos();
    actualizarCalculos();
  }

  function imprimirPlanilla() {
    const printStyle = `
          @media print {
              body * {
                  visibility: hidden;
              }
              #print-section, #print-section * {
                  visibility: visible;
              }
              #print-section {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  font-size: 12px;
              }
              .no-print {
                  display: none !important;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 4px;
                  text-align: left;
              }
              th {
                  background-color: #f2f2f2;
              }
              .text-success {
                  color: #28a745 !important;
              }
              .text-danger {
                  color: #dc3545 !important;
              }
          }
      `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = printStyle;

    const printSection = document.createElement("div");
    printSection.id = "print-section";

    const fecha = formatDate(fechaActual);
    let contenido = `
          <div class="container mt-3">
              <h3 class="text-center">Planilla RES - ${fecha}</h3>
              <hr>
              
              <h4>Datos Principales</h4>
              <table class="table">
                  <tr>
                      <th>Balance Inicial</th>
                      <td>${
                        document.getElementById("balance-inicial").value || 0
                      }</td>
                  </tr>
                  <tr>
                      <th>Balance Cierre</th>
                      <td>${
                        document.getElementById("balance-cierre").value || 0
                      }</td>
                  </tr>
                  <tr>
                      <th>Efectivo en Caja</th>
                      <td>${
                        document.getElementById("efectivo-caja").value || 0
                      }</td>
                  </tr>
                  <tr>
                      <th>Venta del Sistema</th>
                      <td>${
                        document.getElementById("venta-sistema").value || 0
                      }</td>
                  </tr>
              </table>
              
              <h4>Cálculos</h4>
              <table class="table">
                  <tr>
                      <th>Diferencia Balance</th>
                      <td>${
                        document.getElementById("diferencia-balance")
                          .textContent
                      }</td>
                  </tr>
                  <tr>
                      <th>Total Efectivo</th>
                      <td>${
                        document.getElementById("total-efectivo").textContent
                      }</td>
                  </tr>
                  <tr>
                      <th>Total Ingresos Online</th>
                      <td>${
                        document.getElementById("total-online").textContent
                      }</td>
                  </tr>
                  <tr>
                      <th>Total Ingresos POSNET</th>
                      <td>${
                        document.getElementById("total-posnet").textContent
                      }</td>
                  </tr>
                  <tr>
                      <th>Total Egresos</th>
                      <td>${
                        document.getElementById("total-egresos").textContent
                      }</td>
                  </tr>
                  <tr>
                      <th>Total Calculado</th>
                      <td>${
                        document.getElementById("total-calculado").textContent
                      }</td>
                  </tr>
                  <tr>
                      <th>Total Sistema</th>
                      <td>${
                        document.getElementById("total-sistema").textContent
                      }</td>
                  </tr>
                  <tr>
                      <th>Diferencia</th>
                      <td>${
                        document.getElementById("diferencia-sistema")
                          .textContent
                      }</td>
                  </tr>
              </table>
              
              <h4>Pagos Online</h4>
              <table class="table">
                  <thead>
                      <tr>
                          <th>Método</th>
                          <th>Operaciones</th>
                          <th>Monto</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${movimientosOnline
                        .map(
                          (mov) => `
                          <tr>
                              <td>${formatNombreMetodo(mov.metodo)}</td>
                              <td>${mov.operaciones}</td>
                              <td>$${mov.monto.toFixed(2)}</td>
                          </tr>
                      `
                        )
                        .join("")}
                      <tr>
                          <th>Total</th>
                          <th>${movimientosOnline.reduce(
                            (sum, mov) => sum + mov.operaciones,
                            0
                          )}</th>
                          <th>$${movimientosOnline
                            .reduce((sum, mov) => sum + mov.monto, 0)
                            .toFixed(2)}</th>
                      </tr>
                  </tbody>
              </table>
              
              <h4>Pagos POSNET</h4>
              <table class="table">
                  <thead>
                      <tr>
                          <th>Tipo</th>
                          <th>Operaciones</th>
                          <th>Monto</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${movimientosPosnet
                        .map(
                          (mov) => `
                          <tr>
                              <td>${formatNombreMetodo(mov.tipoTarjeta)}</td>
                              <td>${mov.operaciones}</td>
                              <td>$${mov.monto.toFixed(2)}</td>
                          </tr>
                      `
                        )
                        .join("")}
                      <tr>
                          <th>Total</th>
                          <th>${movimientosPosnet.reduce(
                            (sum, mov) => sum + mov.operaciones,
                            0
                          )}</th>
                          <th>$${movimientosPosnet
                            .reduce((sum, mov) => sum + mov.monto, 0)
                            .toFixed(2)}</th>
                      </tr>
                  </tbody>
              </table>
              
              <h4>Egresos</h4>
              <table class="table">
                  <thead>
                      <tr>
                          <th>Método</th>
                          <th>Concepto</th>
                          <th>Monto</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${movimientosEgresos
                        .map(
                          (mov) => `
                          <tr>
                              <td>${formatNombreMetodo(mov.metodo)}</td>
                              <td>${mov.concepto}</td>
                              <td class="text-danger">$${mov.monto.toFixed(
                                2
                              )}</td>
                          </tr>
                      `
                        )
                        .join("")}
                      <tr>
                          <th colspan="2">Total</th>
                          <th class="text-danger">$${movimientosEgresos
                            .reduce((sum, mov) => sum + mov.monto, 0)
                            .toFixed(2)}</th>
                      </tr>
                  </tbody>
              </table>
              
              <div class="mt-3">
                  <p><strong>Observaciones:</strong></p>
                  <p>${
                    document.getElementById("observaciones").value || "Ninguna"
                  }</p>
              </div>
          </div>
      `;

    printSection.innerHTML = contenido;
    document.body.appendChild(styleElement);
    document.body.appendChild(printSection);
    window.print();

    setTimeout(() => {
      document.body.removeChild(styleElement);
      document.body.removeChild(printSection);
    }, 100);
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

  // Función de cálculos
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

  // Configuración de los botones de edición
  function inicializarEventListeners() {
    document
      .getElementById("btn-guardar")
      .addEventListener("click", guardarPlanilla);
    document
      .getElementById("btn-imprimir")
      .addEventListener("click", imprimirPlanilla);

    document.querySelectorAll('[id^="edit-"]').forEach((btn) => {
      btn.addEventListener("click", function () {
        const fieldId = this.id.replace("edit-", "");
        const field = document.getElementById(fieldId);
        toggleEditField(field, fieldId);
      });
    });

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
        concepto: document.getElementById("concepto-egreso").value || "Egreso",
        monto: parseFloat(document.getElementById("monto-egreso").value) || 0,
        fecha: new Date(),
      });
      this.reset();
    });
  }

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
  // Configuración inicial de fecha
  const fechaPlanillaInput = document.getElementById("fecha-planilla");
  const fechaDisplay = document.getElementById("fecha-display");
  const today = new Date();
  fechaPlanillaInput.value = today.toISOString().split("T")[0];
  fechaDisplay.textContent = formatDate(fechaPlanillaInput.value);

  fechaPlanillaInput.addEventListener("change", function () {
    fechaDisplay.textContent = formatDate(this.value);
  });

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

  // Funciones globales para eliminar movimientos
  window.eliminarMovimientoOnline = function (index) {
    if (confirm("¿Estás seguro de eliminar este movimiento?")) {
      movimientosOnline.splice(index, 1);
      actualizarListaOnline();
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
