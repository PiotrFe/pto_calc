import {
  addAbsenceEntry,
  deleteAbsenceEntry,
  updateEntrySelectionOnPage,
} from "./scripts/comp-functions.js";

import { CONSTANTS } from "./scripts/constants.js";

init();

function init() {
  const addBtn = document.getElementById(CONSTANTS.IDS.BTN_ADD_ABSENCE);
  const deleteBtn = document.getElementById(CONSTANTS.IDS.BTN_DELETE_ABSENCE);
  const pageELem = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.PAGE_MAIN}`
  );

  addBtn.addEventListener("click", addAbsenceEntry);
  deleteBtn.addEventListener("click", deleteAbsenceEntry);
  pageELem.addEventListener("click", updateEntrySelectionOnPage);

  addAbsenceEntry();
}
