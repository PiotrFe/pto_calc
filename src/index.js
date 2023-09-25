import {
  addAbsenceEntry,
  deleteAbsenceEntry,
  markActiveEntry,
} from "./scripts/comp-functions.js";

import { CONSTANTS } from "./scripts/constants.js";

init();

function init() {
  const addBtn = document.getElementById("btn-add-absence-entry-1");
  const deleteBtn = document.getElementById("btn-delete-absence-entry-1");

  addBtn.addEventListener("click", addAbsenceEntry);
  deleteBtn.addEventListener("click", deleteAbsenceEntry);

  addAbsenceEntry();
}
