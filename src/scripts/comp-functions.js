import { CONSTANTS } from "./constants.js";
import {
  addActiveEntryListener,
  addDateListener,
  addSubmissionListener,
  clearControlListeners,
  setItemActive,
} from "./listeners.js";
import { addListEntryClassNames } from "./styling.js";
import { makeSelectable } from "./utils.js";

const baseEntryControls = [
  { type: CONSTANTS.IDS.ABSENCE_DATE_FROM, inputType: "date" },
  { type: CONSTANTS.IDS.ABSENCE_DATE_TO, inputType: "date" },
  { type: CONSTANTS.IDS.ABSENCE_PERCENT, inputType: "number" },
];

const absenceEntryControls = [
  { type: CONSTANTS.IDS.ABSENCE_REASON, inputType: "select" },
];

function addListEntry({ entryType }) {
  const newEntry = document.createElement("form");
  const elemIdx = Date.now();

  newEntry.method = "POST";
  newEntry.dataset.entryType = entryType;

  const entryList = document.getElementById(
    entryType === CONSTANTS.ENTRY_TYPES.ABSENCE
      ? CONSTANTS.IDS.ABSENCE_ENTRIES
      : CONSTANTS.IDS.EMPLOYMENT_ENTRIES
  );

  addListEntryClassNames(newEntry);

  const entryControls = [
    ...baseEntryControls,
    ...(entryType === CONSTANTS.ENTRY_TYPES.ABSENCE
      ? absenceEntryControls
      : []),
  ];

  for (let control of entryControls) {
    const { type, inputType } = control;
    const absenceControl = createEntryControl({
      type,
      inputType,
      idx: elemIdx,
      ...(inputType === "number" && {
        min: 0,
        max: 100,
        value: 100,
      }),
      required: true,
    });

    newEntry.append(absenceControl);
  }

  addActiveEntryListener(newEntry);
  addSubmissionListener(newEntry);
  makeSelectable(newEntry);

  entryList.append(newEntry);
}

function addAbsenceEntry() {
  addListEntry({ entryType: CONSTANTS.ENTRY_TYPES.ABSENCE });
}

function addEmploymentEntry() {
  addListEntry({ entryType: CONSTANTS.ENTRY_TYPES.EMPLOYMENT });
}

function addListEntryOnClick() {
  const activeList = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.LIST_ACTIVE}`
  );

  const activeEntry = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.CONTROL_SELECTED}`
  );

  if (!activeList && !activeEntry) {
    return;
  }

  const listToUpdate = activeList || activeEntry.parentElement;

  if (listToUpdate.id === CONSTANTS.IDS.ABSENCE_ENTRIES) {
    addAbsenceEntry();
  } else if (listToUpdate.id === CONSTANTS.IDS.EMPLOYMENT_ENTRIES) {
    addEmploymentEntry();
  }
}

function deleteActiveEntry() {
  const trashElem = document.querySelector(
    `#${CONSTANTS.IDS.BTN_DELETE_LIST_ENTRY}`
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

  const nextSibling = activeEntry.nextElementSibling;

  activeEntry.remove();

  if (nextSibling) {
    setItemActive(nextSibling);
  } else {
    setTrashActive(false);
  }
}

function createEntryControl({ type, inputType, idx, ...otherProps }) {
  const divElem = document.createElement("div");
  const width = inputType === "date" ? 3 : inputType === "number" ? 2 : null;
  const widthClass = width ? `col-${width}` : "col";

  divElem.classList.add(widthClass);
  divElem.classList.add(CONSTANTS.CLASS_NAMES.LIST_ENTRY_CONTROL);

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

  inputElem.setAttribute("required", true);

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

  submitActiveFormEntry();
  clearEntrySelection();
}

function submitActiveFormEntry() {
  const elem = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.CONTROL_SELECTED}`
  );

  if (elem) {
    elem.requestSubmit();
  }
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
    `#${CONSTANTS.IDS.BTN_DELETE_LIST_ENTRY}`
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

function clearActiveListSelection() {
  const activeList = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.LIST_ACTIVE}`
  );

  if (activeList) {
    activeList.classList.remove(CONSTANTS.CLASS_NAMES.LIST_ACTIVE);
  }
}

function toggleActiveListOnClick(e) {
  const listElem = e.target;
  const isList = listElem.classList.contains(
    CONSTANTS.CLASS_NAMES.LIST_ENTRIES
  );

  if (!isList) {
    return;
  }

  const isActive = listElem.classList.contains(
    CONSTANTS.CLASS_NAMES.LIST_ACTIVE
  );
  const activeList = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.LIST_ACTIVE}`
  );

  if (activeList) {
    activeList.classList.remove(CONSTANTS.CLASS_NAMES.LIST_ACTIVE);
  }

  if (isActive) {
    listElem.classList.remove(CONSTANTS.CLASS_NAMES.LIST_ACTIVE);
  } else {
    listElem.classList.add(CONSTANTS.CLASS_NAMES.LIST_ACTIVE);
  }
}

export {
  addListEntry,
  addListEntryOnClick,
  addAbsenceEntry,
  addEmploymentEntry,
  clearActiveListSelection,
  deleteActiveEntry,
  setTrashActive,
  toggleActiveListOnClick,
  updateEntrySelectionOnPage,
};
