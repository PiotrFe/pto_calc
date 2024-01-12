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
