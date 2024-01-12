import { CONSTANTS } from "./constants.js";

function addListEntryClassNames(entry) {
  entry.classList.add("mb-3");
  entry.classList.add("row");
  entry.classList.add(CONSTANTS.CLASS_NAMES.LIST_ENTRY);
  entry.classList.add(CONSTANTS.CLASS_NAMES.LIST_ENTRY_EDITABLE);
}

function addEntryFieldClassNames({ elem, inputType, isStatic = false }) {
  const width = inputType === "date" ? 3 : inputType === "number" ? 2 : null;
  const widthClass = width ? `col-${width}` : "col";

  elem.classList.add(widthClass);
  elem.classList.add(CONSTANTS.CLASS_NAMES.LIST_ENTRY_CONTROL);

  if (isStatic) {
    elem.classList.add(CONSTANTS.CLASS_NAMES.LIST_ENTRY_CONTROL_STATIC);
  }
}

export { addListEntryClassNames, addEntryFieldClassNames };
