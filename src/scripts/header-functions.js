import { CONSTANTS } from "./constants.js";
import { updateHeaderSort } from "./sorting.js";

function addHeaderListeners() {
  document
    .querySelector("#employment-from")
    .addEventListener("click", () =>
      updateHeaderSort(
        CONSTANTS.ENTRY_TYPES.EMPLOYMENT,
        CONSTANTS.SORT_FIELDS.FROM
      )
    );

  document.querySelector("#employment-to").addEventListener("click", () => {
    updateHeaderSort(
      CONSTANTS.ENTRY_TYPES.EMPLOYMENT,
      CONSTANTS.SORT_FIELDS.TO
    );
  });

  document
    .querySelector("#employment-percent")
    .addEventListener("click", () => {
      updateHeaderSort(
        CONSTANTS.ENTRY_TYPES.EMPLOYMENT,
        CONSTANTS.SORT_FIELDS.PERCENT
      );
    });

  document.querySelector("#absence-from").addEventListener("click", () => {
    updateHeaderSort(CONSTANTS.ENTRY_TYPES.ABSENCE, CONSTANTS.SORT_FIELDS.FROM);
  });

  document.querySelector("#absence-to").addEventListener("click", () => {
    updateHeaderSort(CONSTANTS.ENTRY_TYPES.ABSENCE, CONSTANTS.SORT_FIELDS.TO);
  });

  document.querySelector("#absence-percent").addEventListener("click", () => {
    updateHeaderSort(
      CONSTANTS.ENTRY_TYPES.ABSENCE,
      CONSTANTS.SORT_FIELDS.PERCENT
    );
  });

  document.querySelector("#absence-reason").addEventListener("click", () => {
    updateHeaderSort(
      CONSTANTS.ENTRY_TYPES.ABSENCE,
      CONSTANTS.SORT_FIELDS.REASON
    );
  });
}

export { addHeaderListeners };
