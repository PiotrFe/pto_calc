import { CONSTANTS } from "./constants.js";

function addAbsenceEntry() {
  const elemCount =
    document.getElementsByClassName(CONSTANTS.CLASS_NAMES.ABSENCE_ENTRY)
      .length || 0;
  const elemIdx = elemCount + 1; // change this - may result in duplicated ids

  const absenceEntry = document.createElement("div");
  absenceEntry.classList.add("mb3-3");
  absenceEntry.classList.add("row");
  absenceEntry.classList.add(CONSTANTS.CLASS_NAMES.ABSENCE_ENTRY);

  const absenceList = document.getElementById(CONSTANTS.IDS.ABSENCE_LIST);

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

  divElem.classList.add("col-3");
  divElem.classList.add(CONSTANTS.CLASS_NAMES.ABSENCE_CONTROL);

  const { labelElem, inputElem } = createControl({
    inputType,
    id: `${type}-${idx}`,
    classListArr: ["form-control"],
    labelClassListArr: ["form-label"],
    labelText: "",
    ...otherProps,
  });

  divElem.append(labelElem);
  divElem.append(inputElem);

  return divElem;
}

function createControl({
  id,
  classListArr = [],
  inputType = "text",
  labelClassListArr = [],
  labelText = "",
  ...otherProps
}) {
  const labelElem = document.createElement("label");
  let inputElem = document.createElement("input");

  inputElem.type = inputType;
  inputElem.id = id;

  console.log({
    inputType,
    otherProps,
  });

  for (let [key, val] of Object.entries(otherProps)) {
    inputElem[key] = val;
  }

  for (let cls of classListArr) {
    inputElem.classList.add(cls);
  }

  for (let cls of labelClassListArr) {
    labelElem.classList.add(cls);
  }

  labelElem.for = id;
  labelElem.textContent = labelText;

  return { labelElem, inputElem };
}

export { addAbsenceEntry, deleteAbsenceEntry };
