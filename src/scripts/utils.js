import { CONSTANTS } from "./constants.js";

export const parseTsFromId = (id = "") => {
  const idElems = id.split("-");

  return idElems?.[2] || null;
};

export const makeSelectable = (elem) => {
  elem.classList.add(CONSTANTS.CLASS_NAMES.SELECTABLE);
};
