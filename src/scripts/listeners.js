import { parseTsFromId } from "./utils.js";
import { CONSTANTS } from "./constants.js";
import { clearActiveListSelection, setTrashActive } from "./comp-functions.js";

// ADDING
function addDateListener(elem) {
  elem.addEventListener("change", dateChangeListener);
}

function addActiveEntryListener(elem) {
  elem.addEventListener("click", activeEntryListener);
}

function addSubmissionListener(elem) {
  console.log({ elem });
  elem.addEventListener("submit", submissionListener);
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
  elem.removeSubmissionListener("submit", submissionListener);
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
  console.log("Running");
  e.preventDefault();
}

function setItemActive(elem) {
  const currSelectedElem = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.CONTROL_SELECTED}`
  );

  if (currSelectedElem) {
    currSelectedElem.submit && currSelectedElem.submit();
    currSelectedElem.classList.remove(CONSTANTS.CLASS_NAMES.CONTROL_SELECTED);
  }

  elem.classList.add(CONSTANTS.CLASS_NAMES.CONTROL_SELECTED);
  setTrashActive(true);
  clearActiveListSelection();
}

export {
  addDateListener,
  addActiveEntryListener,
  addSubmissionListener,
  clearControlListeners,
  removeActiveEntryListener,
  removeDateListener,
  setItemActive,
};
