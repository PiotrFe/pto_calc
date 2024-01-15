import { CONSTANTS } from "./constants.js";

export const parseTsFromId = (id = "") => {
  const idElems = id.split("-");

  return idElems?.[4] || null;
};

export const makeSelectable = (elem) => {
  elem.classList.add(CONSTANTS.CLASS_NAMES.SELECTABLE);
};

export const getListByEntryName = (entryName) => {
  const listName =
    entryName === CONSTANTS.ENTRY_TYPES.ABSENCE
      ? CONSTANTS.IDS.ABSENCE_ENTRIES
      : entryName === CONSTANTS.ENTRY_TYPES.EMPLOYMENT
      ? CONSTANTS.IDS.EMPLOYMENT_ENTRIES
      : null;

  if (!entryName) {
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
