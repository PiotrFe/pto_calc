import {
  addListEntry,
  addListEntryOnClick,
  deleteActiveEntry,
  toggleActiveListOnClick,
  updateEntrySelectionOnPage,
} from "./scripts/comp-functions.js";

import { addHeaderListeners } from "./scripts/header-functions.js";

import { CONSTANTS } from "./scripts/constants.js";

init();

function init() {
  const addBtn = document.getElementById(CONSTANTS.IDS.BTN_ADD_LIST_ENTRY);
  const addMultipleBtn = document.getElementById(
    CONSTANTS.IDS.BTN_ADD_LIST_ENTRY_MULTIPLE
  );
  const deleteBtn = document.getElementById(
    CONSTANTS.IDS.BTN_DELETE_LIST_ENTRY
  );
  const pageElem = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.PAGE_MAIN}`
  );
  const headerElem = document.getElementById(CONSTANTS.IDS.ABSENCE_HEADER);
  const employmentEntries = document.getElementById(
    CONSTANTS.IDS.EMPLOYMENT_ENTRIES
  );
  const absenceEntries = document.getElementById(CONSTANTS.IDS.ABSENCE_ENTRIES);

  addBtn.addEventListener("click", addListEntryOnClick);
  deleteBtn.addEventListener("click", deleteActiveEntry);
  pageElem.addEventListener("click", updateEntrySelectionOnPage);
  employmentEntries.addEventListener("click", toggleActiveListOnClick);
  absenceEntries.addEventListener("click", toggleActiveListOnClick);

  addHeaderListeners();

  addListEntry({ entryType: CONSTANTS.ENTRY_TYPES.ABSENCE });
  addListEntry({ entryType: CONSTANTS.ENTRY_TYPES.EMPLOYMENT });
}
