import { formatNombreMetodo } from "../../utils/helpers";

export function updateOnlineTable(state) {
  const table = document.getElementById("lista-online");
  table.innerHTML = "";

  state.onlineMovements.forEach((mov, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatNombreMetodo(mov.metodo)}</td>
      <td>${mov.operaciones}</td>
      <td class="text-success">$${mov.monto.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteOnlineMovement(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    table.appendChild(row);
  });

  // Actualizar totales...
}

// ... otras funciones de tablas
