import { CONSTANTS } from "./constants.js";
import {
  addActiveEntryListener,
  addSubmissionListener,
  clearControlListeners,
  convertDivToEntry,
  convertEntryToDiv,
  setItemActive,
} from "./listeners.js";
import { addListEntryClassNames } from "./styling.js";
import { createEntryControl } from "./elem.factory.js";
import {
  clearModalContent,
  closeModal,
  getActiveEntry,
  getActiveEntryList,
  getEntryDatValues,
  getListByEntryName,
  makeSelectable,
  toggleCalcView,
  toggleModalLaunchPropOnBtn,
  updateErrorHighlight,
} from "./utils.js";

import { sortListOnElemAdded } from "./sorting.js";

import { parseModalContent } from "./modal-parser.js";

const baseEntryControls = [
  { type: CONSTANTS.CONTROL_TYPES.LIST_ENTRY_DATE_FROM, inputType: "date" },
  { type: CONSTANTS.CONTROL_TYPES.LIST_ENTRY_DATE_TO, inputType: "date" },
  { type: CONSTANTS.CONTROL_TYPES.LIST_ENTRY_NUMBER, inputType: "number" },
];

const absenceEntryControls = [
  { type: CONSTANTS.IDS.ABSENCE_REASON, inputType: "select" },
];

function addListEntry({ entryType }) {
  const newEntry = getListEntry({ entryType });

  const entryList = getListByEntryName(entryType);

  entryList.append(newEntry);
}

function getListEntry({ entryType, fieldValues = [] }) {
  const newEntry = document.createElement("form");
  const elemIdx = Date.now();

  newEntry.method = "POST";
  newEntry.dataset.entrytype = entryType;

  addListEntryClassNames(newEntry);

  const entryControls = [
    ...baseEntryControls,
    ...(entryType === CONSTANTS.ENTRY_TYPES.ABSENCE
      ? absenceEntryControls
      : []),
  ];

  for (let i = 0; i < entryControls.length; i++) {
    const control = entryControls[i];

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
      ...(fieldValues.length && {
        value: fieldValues[i],
      }),
    });

    newEntry.append(absenceControl);
  }

  addActiveEntryListener(newEntry);
  addSubmissionListener(newEntry);
  makeSelectable(newEntry);

  return newEntry;
}

function addAbsenceEntry() {
  addListEntry({ entryType: CONSTANTS.ENTRY_TYPES.ABSENCE });
}

function addEmploymentEntry() {
  addListEntry({ entryType: CONSTANTS.ENTRY_TYPES.EMPLOYMENT });
}

function addListEntryOnClick() {
  const activeList = getActiveEntryList();
  const activeEntry = getActiveEntry();

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
  const prevSibling = activeEntry.previousElementSibling;

  activeEntry.remove();

  if (nextSibling) {
    setItemActive(nextSibling);
    if (nextSibling.tagName.toLocaleLowerCase() === "div") {
      convertDivToEntry(nextSibling);
    }
  } else if (prevSibling) {
    setItemActive(prevSibling);
    if (prevSibling.tagName.toLocaleLowerCase() === "div") {
      convertDivToEntry(prevSibling);
    }
  } else {
    setTrashActive(false);
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

  if ((e.target.id = CONSTANTS.IDS.PAGE_CONTENT)) {
    clearActiveListSelection();
    setAddMultipleActive(false);
  }
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

  setBtnActive(trashElem, active);
}

function setAddMultipleActive(active = false) {
  const btn = document.querySelector(
    `#${CONSTANTS.IDS.BTN_ADD_LIST_ENTRY_MULTIPLE}`
  );

  if (!btn) {
    return;
  }

  toggleModalLaunchPropOnBtn(active);
  setBtnActive(btn, active);
}

function setBtnActive(btnElem, active) {
  const isDisabled = btnElem.classList.contains(
    CONSTANTS.CLASS_NAMES.ICON_DISABLED
  );

  const skip = (isDisabled && !active) || (!isDisabled && active);

  if (skip) {
    return;
  }

  if (active) {
    btnElem.classList.remove(CONSTANTS.CLASS_NAMES.ICON_DISABLED);
  } else {
    btnElem.classList.add(CONSTANTS.CLASS_NAMES.ICON_DISABLED);
  }
}

function clearActiveListSelection() {
  const activeList = getActiveEntryList();

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
  const activeList = getActiveEntryList();

  if (activeList) {
    activeList.classList.remove(CONSTANTS.CLASS_NAMES.LIST_ACTIVE);
  }

  if (isActive) {
    listElem.classList.remove(CONSTANTS.CLASS_NAMES.LIST_ACTIVE);
  } else {
    listElem.classList.add(CONSTANTS.CLASS_NAMES.LIST_ACTIVE);
  }

  setAddMultipleActive(true);
}

// MODAL FUNCTIONS

function saveModalContent() {
  const modalContentArr = parseModalContent();

  if (!modalContentArr?.length) {
    // append error message
    return;
  }

  const activeEntryList = getActiveEntryList();
  const activeEntryListType = activeEntryList.id.split("-")[0];
  const entryType =
    activeEntryListType === "employment"
      ? CONSTANTS.ENTRY_TYPES.EMPLOYMENT
      : activeEntryListType === "absence"
      ? CONSTANTS.ENTRY_TYPES.ABSENCE
      : null;

  if (!entryType) {
    return;
  }

  const elemArr = modalContentArr.map((fieldValuesArr) => {
    const entryForm = getListEntry({
      entryType,
      fieldValues: fieldValuesArr.filter((v) => v),
    });

    return convertEntryToDiv({ entryElem: entryForm, replaceExisting: false });
  });

  elemArr.forEach((entryDiv) => activeEntryList.append(entryDiv));
  clearModalContent();
  closeModal();
  sortListOnElemAdded(activeEntryList);
  highlightOverlappingEntries({ listElem: getListByEntryName(entryType) });
}

function highlightOverlappingEntries({ listElem }) {
  if (!listElem || !listElem.children) {
    return;
  }

  const entryList = Array.from(listElem.children);

  if (entryList?.length < 2) {
    return;
  }

  entryList.forEach((entry, currIdx, arr) => {
    if (currIdx + 1 === arr.length) {
      return;
    }

    const [dateFrom, dateTo] = getEntryDatValues(entry);
    const duplicateEntry = arr.slice(currIdx + 1).find((otherEntry) => {
      const [otherDateFrom, otherDateTo] = getEntryDatValues(otherEntry);

      return (
        (dateFrom >= otherDateFrom && dateFrom <= otherDateTo) ||
        (dateTo >= otherDateFrom && dateTo <= otherDateTo)
      );
    });

    console.log({ duplicateEntry });

    if (duplicateEntry) {
      updateErrorHighlight(entry, true);
      updateErrorHighlight(duplicateEntry, true);
    } else {
      updateErrorHighlight(entry, false);
    }
  });
}

function runCalculation() {
  toggleCalcView();
}

export {
  addListEntry,
  addListEntryOnClick,
  addAbsenceEntry,
  addEmploymentEntry,
  clearActiveListSelection,
  deleteActiveEntry,
  getListEntry,
  highlightOverlappingEntries,
  runCalculation,
  saveModalContent,
  setTrashActive,
  submitActiveFormEntry,
  toggleActiveListOnClick,
  updateEntrySelectionOnPage,
};
