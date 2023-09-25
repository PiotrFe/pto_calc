import {
  addAbsenceEntry,
  deleteAbsenceEntry,
  updateEntrySelectionOnPage,
} from "./scripts/comp-functions.js";

import { updateHeaderSort } from "./scripts/header-functions.js";

import { CONSTANTS } from "./scripts/constants.js";

init();

function init() {
  const addBtn = document.getElementById(CONSTANTS.IDS.BTN_ADD_ABSENCE);
  const deleteBtn = document.getElementById(CONSTANTS.IDS.BTN_DELETE_ABSENCE);
  const pageElem = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.PAGE_MAIN}`
  );
  const headerElem = document.getElementById(CONSTANTS.IDS.ABSENCE_HEADER);

  addBtn.addEventListener("click", addAbsenceEntry);
  deleteBtn.addEventListener("click", deleteAbsenceEntry);
  pageElem.addEventListener("click", updateEntrySelectionOnPage);
  headerElem.addEventListener("click", updateHeaderSort);

  addAbsenceEntry();
}
