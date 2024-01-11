import { CONSTANTS } from "./constants.js";

function addListEntryClassNames(entry) {
  entry.classList.add("mb-3");
  entry.classList.add("row");
  entry.classList.add(CONSTANTS.CLASS_NAMES.LIST_ENTRY);
}

export { addListEntryClassNames };
