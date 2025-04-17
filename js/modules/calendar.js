// Manejo de calendarios
import { STORAGE_KEY, CALENDAR_CONFIG } from "../core/constants.js";
import { formatDate } from "../core/helpers.js";
import { calendarioCargar, calendarioNueva } from "../core/globals.js";
import { cargarPlanilla, nuevaPlanilla } from "./storage.js";

export function inicializarCalendarios() {
  // Calendario para cargar planillas
  calendarioCargar = new Pikaday({
    ...CALENDAR_CONFIG,
    field: document.createElement("input"),
    container: document.getElementById("calendario-cargar"),
    onSelect: function () {
      const fechaSeleccionada = this.getMoment().format("YYYY-MM-DD");
      cargarPlanilla(fechaSeleccionada);
      bootstrap.Dropdown.getInstance(
        document.getElementById("dropdownCargar")
      ).hide();
    },
    toString: function (date, format) {
      return moment(date).format("DD/MM/YYYY");
    },
  });

  // Calendario para nueva planilla
  calendarioNueva = new Pikaday({
    ...CALENDAR_CONFIG,
    field: document.createElement("input"),
    container: document.getElementById("calendario-nueva"),
    onSelect: function () {
      const fechaSeleccionada = this.getMoment().format("YYYY-MM-DD");
      nuevaPlanilla(fechaSeleccionada);
      bootstrap.Dropdown.getInstance(
        document.getElementById("dropdownNueva")
      ).hide();
    },
  });

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

function personalizarBotonesCalendario() {
  document
    .querySelectorAll(
      ".pika-title .pika-prev, .pika-title .pika-next, .pika-title .pika-today"
    )
    .forEach((btn) => btn.remove());

  const botonSeleccionar = document.createElement("button");
  botonSeleccionar.className = "btn btn-sm btn-primary";
  botonSeleccionar.textContent = "Seleccionar";
  botonSeleccionar.style.margin = "0 5px";

  document.querySelectorAll(".pika-title").forEach((title) => {
    title.appendChild(botonSeleccionar.cloneNode(true));
  });
}

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
    const diaCargar = calendarioCargar.el.querySelector(`[data-day="${day}"]`);
    if (
      diaCargar &&
      diaCargar.getAttribute("data-month") == month &&
      diaCargar.getAttribute("data-year") == year
    ) {
      diaCargar.classList.add("has-planilla-cargar");
    }

    // Para calendario de nueva (rojo)
    calendarioNueva.setDate(date);
    const diaNueva = calendarioNueva.el.querySelector(`[data-day="${day}"]`);
    if (
      diaNueva &&
      diaNueva.getAttribute("data-month") == month &&
      diaNueva.getAttribute("data-year") == year
    ) {
      diaNueva.classList.add("has-planilla-nueva");
    }
  });
}
