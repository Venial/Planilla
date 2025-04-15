export function initializeUI(state) {
  // Configurar botones de edición
  document.querySelectorAll('[id^="edit-"]').forEach((btn) => {
    btn.addEventListener("click", function () {
      const fieldId = this.id.replace("edit-", "");
      const field = document.getElementById(fieldId);
      toggleEditField(field, fieldId, state);
    });
  });
}

function toggleEditField(field, fieldId, state) {
  if (field.readOnly) {
    field.readOnly = false;
    field.classList.remove("readonly-input");
    field.focus();
  } else {
    field.readOnly = true;
    field.classList.add("readonly-input");
    updateCalculations(state); // Actualizar cálculos al salir de edición
  }
}
