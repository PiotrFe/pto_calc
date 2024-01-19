import { getListByEntryName, parseTsFromId } from "./utils.js";
import { CONSTANTS } from "./constants.js";
import {
  clearActiveListSelection,
  getListEntry,
  highlightOverlappingEntries,
  setTrashActive,
  submitActiveFormEntry,
} from "./comp-functions.js";

import { sortListOnElemAdded } from "./sorting.js";

import { addListEntryClassNames, addEntryFieldClassNames } from "./styling.js";

// ADDING
function addDateListener(elem) {
  elem.addEventListener("change", dateChangeListener);
}

function addActiveEntryListener(elem) {
  elem.addEventListener("click", activeEntryListener);
}

function addSubmissionListener(elem) {
  elem.addEventListener("submit", submissionListener);
}

function addStaticDivClickListener(elem) {
  elem.addEventListener("click", staticDivClickListener);
}

// REMOVING
function clearControlListeners(elem) {
  if (!elem) {
    return;
  }

  const dateFrom = elem.querySelector(
    `.${CONSTANTS.CLASS_NAMES.LIST_ENTRY_DATE_FROM}`
  );
  const dateTo = elem.querySelector(
    `.${CONSTANTS.CLASS_NAMES.LIST_ENTRY_DATE_TO}`
  );

  removeDateListener(dateFrom);
  removeDateListener(dateTo);
  removeActiveEntryListener(elem);
  removeSubmissionListener(elem);
  removeStaticDivClickListener(elem);
}

function removeDateListener(elem) {
  if (!elem) {
    return;
  }
  elem.removeEventListener("change", dateChangeListener);
}

function removeActiveEntryListener(elem) {
  elem.removeEventListener("click", activeEntryListener);
}

function removeSubmissionListener(elem) {
  elem.removeEventListener("submit", submissionListener);
}

function removeStaticDivClickListener(elem) {
  elem.removeEventListener("click", staticDivClickListener);
}

// LISTENERS

function dateChangeListener(e) {
  const elem = e.target;
  const prop = elem.classList.contains(
    CONSTANTS.CONTROL_TYPES.LIST_ENTRY_DATE_FROM
  )
    ? "min"
    : elem.classList.contains(CONSTANTS.CONTROL_TYPES.LIST_ENTRY_DATE_TO)
    ? "max"
    : null;

  if (!prop) {
    return;
  }

  const siblingName = elem.classList.contains(
    CONSTANTS.CONTROL_TYPES.LIST_ENTRY_DATE_FROM
  )
    ? CONSTANTS.CONTROL_TYPES.LIST_ENTRY_DATE_TO
    : elem.classList.contains(CONSTANTS.CONTROL_TYPES.LIST_ENTRY_DATE_TO)
    ? CONSTANTS.CONTROL_TYPES.LIST_ENTRY_DATE_FROM
    : null;
  const siblingIdTs = parseTsFromId(elem.id);
  const siblingId = `${siblingName}-${siblingIdTs}`;
  const siblingDate = document.getElementById(siblingId);

  siblingDate.min = null;
  siblingDate.max = null;

  const dateVal = e.target.value;

  if (dateVal !== "") {
    siblingDate[prop] = dateVal;
  }
}

function activeEntryListener(e) {
  const elemsUnderCursor = document.elementsFromPoint(e.x, e.y);
  const clickableElem = elemsUnderCursor.find(
    (elem) =>
      elem.classList.contains(CONSTANTS.CLASS_NAMES.CLICKABLE) ||
      elem.classList.contains(CONSTANTS.CLASS_NAMES.SELECTABLE)
  );

  if (clickableElem) {
    setItemActive(clickableElem);
  }
}

function submissionListener(e) {
  e.preventDefault();
  const success = convertEntryToDiv({ entryElem: e.target });

  if (success) {
    const listElem = getListByEntryName(e.target.dataset.entrytype);
    sortListOnElemAdded(listElem);
    highlightOverlappingEntries({ listElem });
  }
}

function setItemActive(elem) {
  const currSelectedElem = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.CONTROL_SELECTED}`
  );

  if (currSelectedElem && elem !== currSelectedElem) {
    const isEditable = currSelectedElem.classList.contains(
      CONSTANTS.CLASS_NAMES.LIST_ENTRY_EDITABLE
    );

    if (isEditable) {
      submitActiveFormEntry();
    }
    currSelectedElem.classList.remove(CONSTANTS.CLASS_NAMES.CONTROL_SELECTED);
  }

  elem.classList.add(CONSTANTS.CLASS_NAMES.CONTROL_SELECTED);
  setTrashActive(true);
  clearActiveListSelection();
}

function staticDivClickListener(e) {
  convertDivToEntry(e.target);
}

// HELPERS

function convertEntryToDiv({ entryElem, replaceExisting = true }) {
  if (!entryElem) {
    return;
  }
  const entryType = entryElem.dataset.entrytype;

  const divElem = document.createElement("div");

  const childDivArr = Array.from(entryElem.children).map((divElem) => {
    const inputElem = divElem.children.item(0);
    const inputType = inputElem.type;
    const childDiv = document.createElement("div");

    addEntryFieldClassNames({ elem: childDiv, inputType, isStatic: true });

    childDiv.dataset.entryVal = inputElem.value;

    if (inputType !== "date") {
      childDiv.textContent = inputElem.value;
    } else {
      const d = new Date(inputElem.value);
      childDiv.textContent = `${`${d.getDate()}`.padStart(2, 0)}-${`${
        d.getMonth() + 1
      }`.padStart(2, 0)}-${d.getFullYear()}`;
    }

    return childDiv;
  });

  for (let childDiv of childDivArr) {
    divElem.append(childDiv);
  }

  divElem.dataset.entrytype = entryType;

  addListEntryClassNames(divElem);
  addStaticDivClickListener(divElem);
  clearControlListeners(entryElem);

  if (replaceExisting) {
    const entryList = getListByEntryName(entryType);
    entryList.replaceChild(divElem, entryElem);
  }

  return divElem;
}

function convertDivToEntry(elem) {
  const childClicked = elem.classList.contains(
    CONSTANTS.CLASS_NAMES.LIST_ENTRY_CONTROL_STATIC
  );
  const divElem = childClicked ? elem.parentElement : elem;
  const entryType = divElem.dataset.entrytype;

  const fieldValues = Array.from(divElem.children).map(
    (child) => child.dataset.entryVal
  );

  const entryElem = getListEntry({ entryType, fieldValues });
  const entryList = getListByEntryName(entryType);

  clearControlListeners(divElem);
  entryList.replaceChild(entryElem, divElem);
  setItemActive(entryElem);
}

export {
  addDateListener,
  addActiveEntryListener,
  addSubmissionListener,
  clearControlListeners,
  convertDivToEntry,
  convertEntryToDiv,
  removeActiveEntryListener,
  removeDateListener,
  setItemActive,
};
