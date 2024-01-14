import {
  addListEntry,
  addListEntryOnClick,
  deleteActiveEntry,
  saveModalContent,
  toggleActiveListOnClick,
  updateEntrySelectionOnPage,
} from "./scripts/comp-functions.js";

import { addHeaderListeners } from "./scripts/header-functions.js";

import { CONSTANTS } from "./scripts/constants.js";

init();

function init() {
  const addBtn = document.getElementById(CONSTANTS.IDS.BTN_ADD_LIST_ENTRY);
  const saveModalContentBtn = document.getElementById(
    CONSTANTS.IDS.SAVE_MODAL_CONTENT_BUTTON
  );
  const deleteBtn = document.getElementById(
    CONSTANTS.IDS.BTN_DELETE_LIST_ENTRY
  );
  const pageElem = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.PAGE_MAIN}`
  );

  const employmentEntries = document.getElementById(
    CONSTANTS.IDS.EMPLOYMENT_ENTRIES
  );
  const absenceEntries = document.getElementById(CONSTANTS.IDS.ABSENCE_ENTRIES);

  addBtn.addEventListener("click", addListEntryOnClick);
  deleteBtn.addEventListener("click", deleteActiveEntry);
  pageElem.addEventListener("click", updateEntrySelectionOnPage);
  employmentEntries.addEventListener("click", toggleActiveListOnClick);
  absenceEntries.addEventListener("click", toggleActiveListOnClick);
  saveModalContentBtn.addEventListener("click", saveModalContent);

  addHeaderListeners();

  addListEntry({ entryType: CONSTANTS.ENTRY_TYPES.ABSENCE });
  addListEntry({ entryType: CONSTANTS.ENTRY_TYPES.EMPLOYMENT });
}
