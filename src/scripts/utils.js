import { CONSTANTS } from "./constants.js";

export const parseTsFromId = (id = "") => {
  const idElems = id.split("-");

  return idElems?.[4] || null;
};

export const makeSelectable = (elem) => {
  elem.classList.add(CONSTANTS.CLASS_NAMES.SELECTABLE);
};

export const getListByEntryName = (entryName) => {
  const n = entryName.toUpperCase();
  const listName =
    n === CONSTANTS.ENTRY_TYPES.ABSENCE
      ? CONSTANTS.IDS.ABSENCE_ENTRIES
      : n === CONSTANTS.ENTRY_TYPES.EMPLOYMENT
      ? CONSTANTS.IDS.EMPLOYMENT_ENTRIES
      : null;

  if (!listName) {
    return null;
  }

  return document.getElementById(listName);
};

export const toggleModalLaunchPropOnBtn = (active) => {
  const btn = document.getElementById(
    CONSTANTS.IDS.BTN_ADD_LIST_ENTRY_MULTIPLE
  );

  if (active) {
    btn.dataset.bsToggle = "modal";
  } else {
    delete btn.dataset.bsToggle;
  }
};

export const getActiveEntryList = () =>
  document.querySelector(`.${CONSTANTS.CLASS_NAMES.LIST_ACTIVE}`);

export const getActiveEntry = () =>
  document.querySelector(`.${CONSTANTS.CLASS_NAMES.CONTROL_SELECTED}`);

export const getPasteDataWindow = () =>
  document.querySelector(`.${CONSTANTS.IDS.PASTE_DATA_WINDOW}`);

export const dateToString = (date, delimiter) => {
  if (!date) {
    return null;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);

  if (delimiter === "/") {
    return `${day}/${month}/${year}`;
  } else if (delimiter === "-") {
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};

export const clearModalContent = () => {
  const textArea = document.getElementById("modal-text-area");
  textArea.value = "";
};

export const closeModal = () => {
  const closeBtn = document.getElementById("close-modal-btn");

  closeBtn.dispatchEvent(new Event("click"));
};

export const getListTypeFromListElem = (listElem) => {
  if (!listElem) {
    return;
  }
};

export const getEntryDatValues = (entryElem) => {
  if (!entryElem || !entryElem.children) {
    return [];
  }

  const controlA = Array.from(entryElem.children)[0];
  const controlB = Array.from(entryElem.children)[1];
  const dateFrom = new Date(controlA.dataset.entryVal);
  const dateTo = new Date(controlB.dataset.entryVal);

  return [dateFrom, dateTo];
};

export const updateErrorHighlight = (entryElem, add) => {
  if (!entryElem?.classList) {
    return;
  }

  if (add) {
    entryElem.classList.add("error");
  } else {
    entryElem.classList.remove("error");
  }
};

export const toggleCalcView = () => {
  const pageElem = document.getElementById(CONSTANTS.IDS.PAGE_CONTAINER);
  pageElem.classList.toggle("translated");
};
