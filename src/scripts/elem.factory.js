import { CONSTANTS } from "./constants.js";
import { addEntryFieldClassNames } from "./styling.js";
import { addDateListener } from "./listeners.js";

function createEntryControl({ type, inputType, idx, value, ...otherProps }) {
  const divElem = document.createElement("div");
  const classListArr = ["form-control", type];

  if (type === CONSTANTS.IDS.ABSENCE_DATE_FROM) {
    classListArr.push(CONSTANTS.CLASS_NAMES.LIST_ENTRY_DATE_FROM);
  }

  if (type === CONSTANTS.IDS.ABSENCE_DATE_TO) {
    classListArr.push(CONSTANTS.CLASS_NAMES.LIST_ENTRY_DATE_TO);
  }

  const { inputElem } = createControl({
    inputType,
    id: `${type}-${idx}`,
    type,
    classListArr,
    value,
    ...otherProps,
  });

  if (inputType === "select") {
    appendAbsenceOptions(inputElem);

    if (!value) {
      inputElem.value = CONSTANTS.ABSENCE_REASONS?.[0] || "";
    } else {
      inputElem.value = value;
    }
  }

  addEntryFieldClassNames({ elem: divElem, inputType, isStatic: false });

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

function createPasteDataWindow() {
  createOverlay();
}

function createOverlay() {
  const overlayElem = document.createElement("div");
  overlayElem.id = "overlay-main";

  document.querySelector(`#page-main`).append(overlayElem);
}

export { createEntryControl, createPasteDataWindow };
