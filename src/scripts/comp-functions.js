import { CONSTANTS } from "./constants.js";
import { parseTsFromId } from "./utils.js";

function addAbsenceEntry() {
  const elemCount =
    document.getElementsByClassName(CONSTANTS.CLASS_NAMES.ABSENCE_ENTRY)
      .length || 0;
  const elemIdx = Date.now();

  const absenceEntry = document.createElement("div");
  absenceEntry.classList.add("mb-3");
  absenceEntry.classList.add("row");
  absenceEntry.classList.add(CONSTANTS.CLASS_NAMES.ABSENCE_ENTRY);

  const absenceList = document.getElementById(CONSTANTS.IDS.ABSENCE_ENTRY_LIST);

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

  absenceList.append(absenceEntry);
}

function deleteAbsenceEntry() {
  alert("Deleting!");
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
    classListArr: ["form-control"],
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
    appendDateListener({ elem: inputElem, type });
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

function appendDateListener({ elem, type }) {
  const prop =
    type === CONSTANTS.CONTROL_TYPES.ABSENCE_DATE_FROM
      ? "min"
      : type === CONSTANTS.CONTROL_TYPES.ABSENCE_DATE_TO
      ? "max"
      : null;

  if (!prop) {
    return;
  }

  const siblingName =
    type === CONSTANTS.CONTROL_TYPES.ABSENCE_DATE_FROM
      ? CONSTANTS.CONTROL_TYPES.ABSENCE_DATE_TO
      : type === CONSTANTS.CONTROL_TYPES.ABSENCE_DATE_TO
      ? CONSTANTS.CONTROL_TYPES.ABSENCE_DATE_FROM
      : null;

  const siblingIdTs = parseTsFromId(elem.id);
  const siblingId = `${siblingName}-${siblingIdTs}`;

  elem.addEventListener("change", (e) => {
    const siblingDate = document.getElementById(siblingId);
    siblingDate.min = null;
    siblingDate.max = null;
    siblingDate[prop] = e.target.value;
  });
}

function markActiveEntry(e) {
  console.log(e.target);
}

function onFromDateChange(e) {
  console.log(e.target.value);
}

export { addAbsenceEntry, deleteAbsenceEntry, markActiveEntry };
