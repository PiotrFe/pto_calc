import { CONSTANTS } from "./constants.js";
import {
  addActiveEntryListener,
  addDateListener,
  clearControlListeners,
  setItemActive,
} from "./listeners.js";
import { makeSelectable } from "./utils.js";

function addAbsenceEntry() {
  const absenceEntry = document.createElement("div");
  const elemIdx = Date.now();
  const absenceList = document.getElementById(CONSTANTS.IDS.ABSENCE_ENTRY_LIST);

  absenceEntry.classList.add("mb-3");
  absenceEntry.classList.add("row");
  absenceEntry.classList.add(CONSTANTS.CLASS_NAMES.ABSENCE_ENTRY);

  for (let control of [
    { type: CONSTANTS.IDS.ABSENCE_DATE_FROM, inputType: "date" },
    { type: CONSTANTS.IDS.ABSENCE_DATE_TO, inputType: "date" },
    { type: CONSTANTS.IDS.ABSENCE_PERCENT, inputType: "number" },
    { type: CONSTANTS.IDS.ABSENCE_REASON, inputType: "select" },
  ]) {
    const { type, inputType } = control;
    const absenceControl = createAbsenceControl({
      type,
      inputType,
      idx: elemIdx,
      ...(inputType === "number" && {
        min: 0,
        max: 100,
        value: 100,
      }),
    });

    absenceEntry.append(absenceControl);
  }

  addActiveEntryListener(absenceEntry);
  makeSelectable(absenceEntry);

  absenceList.append(absenceEntry);
}

function deleteAbsenceEntry() {
  const trashElem = document.querySelector(
    `#${CONSTANTS.IDS.BTN_DELETE_ABSENCE}`
  );
  const isDisabled = trashElem.classList.contains(
    CONSTANTS.CLASS_NAMES.ICON_DISABLED
  );

  if (isDisabled) {
    return;
  }

  const activeEntry = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.CONTROL_SELECTED}`
  );

  if (!activeEntry) {
    return;
  }

  clearControlListeners(activeEntry);

  const prevSibling = activeEntry.nextElementSibling;

  activeEntry.remove();

  if (prevSibling) {
    setItemActive(prevSibling);
  } else {
    setTrashActive(false);
  }
}

function createAbsenceControl({ type, inputType, idx, ...otherProps }) {
  const divElem = document.createElement("div");
  const width = inputType === "date" ? 3 : inputType === "number" ? 2 : null;
  const widthClass = width ? `col-${width}` : "col";

  divElem.classList.add(widthClass);
  divElem.classList.add(CONSTANTS.CLASS_NAMES.ABSENCE_CONTROL);

  const { inputElem } = createControl({
    inputType,
    id: `${type}-${idx}`,
    type,
    classListArr: ["form-control", type],
    ...otherProps,
  });

  if (inputType === "select") {
    appendAbsenceOptions(inputElem);
    inputElem.value = CONSTANTS.ABSENCE_REASONS?.[0] || "";
  }

  divElem.append(inputElem);

  return divElem;
}

function createControl({
  id,
  classListArr = [],
  inputType = "text",
  type,
  ...otherProps
}) {
  const elemType = inputType !== "select" ? "input" : "select";
  let inputElem = document.createElement(elemType);

  if (elemType !== "select") {
    inputElem.type = inputType;
  }

  inputElem.id = id;

  for (let [key, val] of Object.entries(otherProps)) {
    inputElem[key] = val;
  }

  for (let cls of classListArr) {
    inputElem.classList.add(cls);
  }

  if (inputType === "date") {
    addDateListener(inputElem);
  }

  return { inputElem };
}

function appendAbsenceOptions(selectElem) {
  if (!selectElem) {
    return;
  }

  for (let absence of CONSTANTS.ABSENCE_REASONS) {
    const optionElem = document.createElement("option");
    optionElem.value = absence;
    optionElem.textContent = absence;

    selectElem.append(optionElem);
  }
}

function updateEntrySelectionOnPage(e) {
  const elemsUnderCursor = document.elementsFromPoint(e.x, e.y);
  const skipClear = elemsUnderCursor.some(
    (e) =>
      e.classList.contains(CONSTANTS.CLASS_NAMES.CLICKABLE) ||
      e.classList.contains(CONSTANTS.CLASS_NAMES.SELECTABLE)
  );

  if (skipClear) {
    return;
  }

  clearEntrySelection();
}

function clearEntrySelection() {
  const elem = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.CONTROL_SELECTED}`
  );

  if (elem) {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.CONTROL_SELECTED);
  }

  setTrashActive(false);
}

function setTrashActive(active = false) {
  const trashElem = document.querySelector(
    `#${CONSTANTS.IDS.BTN_DELETE_ABSENCE}`
  );

  if (!trashElem) {
    return;
  }

  const isDisabled = trashElem.classList.contains(
    CONSTANTS.CLASS_NAMES.ICON_DISABLED
  );

  const skip = (isDisabled && !active) || (!isDisabled && active);

  if (skip) {
    return;
  }

  if (active) {
    trashElem.classList.remove(CONSTANTS.CLASS_NAMES.ICON_DISABLED);
  } else {
    trashElem.classList.add(CONSTANTS.CLASS_NAMES.ICON_DISABLED);
  }
}

export {
  addAbsenceEntry,
  deleteAbsenceEntry,
  setTrashActive,
  updateEntrySelectionOnPage,
};
