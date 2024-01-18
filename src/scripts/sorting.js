import { CONSTANTS, entryOrder } from "./constants.js";
import { getActiveEntryList, getListByEntryName } from "./utils.js";

const currSortRegex = /sorted-\w{3,4}/gi;

function getCurrentSort(headerElem) {
  const currentSortArr = Array.from(
    document.querySelectorAll(`.${CONSTANTS.CLASS_NAMES.SORTED}`)
  );

  const currentSort = currentSortArr.find((e) => {
    const parentListName = `${e.id}`.split("-")?.[0];

    return `${parentListName}-list` === headerElem.id;
  });

  return currentSort;
}

function getCurrentSortName(elem) {
  if (!elem || !elem.classList) {
    return null;
  }

  const sortClass = Array.from(elem.classList).find((className) => {
    const regexMatch = className.match(currSortRegex);

    return regexMatch?.[0];
  });

  if (sortClass) {
    return sortClass.split("-")?.[1];
  }

  return null;
}

function getNextSortName(elem, newElemClicked) {
  if (!elem || newElemClicked) {
    return CONSTANTS.SORT_STATUS.DESC;
  }

  const isSorted = elem.classList.contains(CONSTANTS.CLASS_NAMES.SORTED);
  const isSortedDesc = elem.classList.contains(
    CONSTANTS.CLASS_NAMES.SORTED_DESC
  );

  if (!isSorted) {
    return CONSTANTS.SORT_STATUS.DESC;
  } else if (isSortedDesc) {
    return CONSTANTS.SORT_STATUS.ASC;
  } else {
    return CONSTANTS.SORT_STATUS.NONE;
  }
}

export function updateHeaderSort(hName, fName, keepCurrent = false) {
  if (!hName || (!fName && !keepCurrent)) {
    return;
  }

  const headerName = hName.toLowerCase();
  const parentHeaderElem = document.querySelector(`#${headerName}-list`);
  const currentSort = getCurrentSort(parentHeaderElem);

  if (keepCurrent && !currentSort) {
    return;
  }

  const fieldName = !keepCurrent
    ? fName.toLowerCase()
    : currentSort.id.split("-")[1];

  const newSortFieldElem = document.querySelector(
    `#${headerName}-${fieldName}`
  );

  if (
    !newSortFieldElem ||
    !newSortFieldElem.classList.contains(CONSTANTS.CLASS_NAMES.SORTABLE)
  ) {
    return;
  }
  const nextSortStatus = keepCurrent
    ? getCurrentSortName(currentSort)
    : updateSortStatus(parentHeaderElem, newSortFieldElem);

  if (nextSortStatus === CONSTANTS.SORT_STATUS.NONE) {
    return;
  }

  sortData({ listName: hName, fieldName, order: nextSortStatus });
}

export function updateSortStatus(headerElem, elem) {
  if (!elem || !headerElem) {
    return;
  }

  const currentSortedElem = getCurrentSort(headerElem);
  const newElemClicked = currentSortedElem && currentSortedElem !== elem;

  if (newElemClicked) {
    currentSortedElem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED);
    currentSortedElem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_ASC);
    currentSortedElem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnHeader({ elem: currentSortedElem });
  }

  const nextSortOrder = getNextSortName(currentSortedElem, newElemClicked);

  if (nextSortOrder === CONSTANTS.SORT_STATUS.DESC) {
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED);
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnHeader({ elem, dir: "desc" });
  } else if (nextSortOrder === CONSTANTS.SORT_STATUS.ASC) {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_DESC);
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED_ASC);

    updateSortIconOnHeader({ elem });
    updateSortIconOnHeader({ elem, dir: "asc" });
  } else {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED);
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_ASC);

    updateSortIconOnHeader({ elem });
  }

  return nextSortOrder;
}

export function updateSortIconOnHeader({ elem, dir }) {
  if (!elem) {
    return;
  }

  if (!dir) {
    const icon = elem.querySelector(`.${CONSTANTS.CLASS_NAMES.SORT_ICON}`);
    icon.remove();

    return;
  }

  const icon = document.createElement("i");
  icon.classList.add("bi");
  icon.classList.add(dir === "asc" ? "bi-sort-up-alt" : "bi-sort-down");
  icon.classList.add(CONSTANTS.CLASS_NAMES.SORT_ICON);
  elem.append(icon);
}

export function sortData({ listName, fieldName, order }) {
  const entryDiv = getListByEntryName(listName);

  if (!entryDiv) {
    return;
  }

  const entryList = Array.from(entryDiv.children);

  if (entryList?.length < 2) {
    return;
  }

  const fieldNameUpper = fieldName.toUpperCase();

  const controlIdxInParent = entryOrder.findIndex(
    (n) => n === fieldNameUpper.toUpperCase()
  );

  if (controlIdxInParent < 0) {
    return;
  }

  // CONTINUE FROM HERE
  entryList.sort((elemA, elemB) => {
    const controlA = Array.from(elemA.children)[controlIdxInParent];
    const controlB = Array.from(elemB.children)[controlIdxInParent];
    const controlAVal =
      controlA.tagName.toLowerCase() === "div"
        ? controlA.dataset.entryVal
        : controlA.value;
    const controlBVal =
      controlB.tagName.toLowerCase() === "div"
        ? controlB.dataset.entryVal
        : controlB.value;

    let controlAValParsed, controlBValParsed;

    if (
      fieldNameUpper === CONSTANTS.SORT_FIELDS.FROM ||
      fieldNameUpper === CONSTANTS.SORT_FIELDS.TO
    ) {
      controlAValParsed = new Date(controlAVal);
      controlBValParsed = new Date(controlBVal);
    } else if (fieldNameUpper === CONSTANTS.SORT_FIELDS.PERCENT) {
      controlAValParsed = parseInt(controlAVal);
      controlBValParsed = parseInt(controlBVal);
    } else {
      controlAValParsed = controlAVal;
      controlBValParsed = controlBVal;
    }

    return order === CONSTANTS.SORT_STATUS.ASC
      ? controlAValParsed - controlBValParsed
      : controlBValParsed - controlAValParsed;
  });

  entryList.forEach((elem) => {
    entryDiv.appendChild(elem);
  });
}

export function sortListOnElemAdded(listElem) {
  if (!listElem || !listElem.parentElement) {
    return;
  }
  const listName = listElem.parentElement.id.split("-")[0];

  updateHeaderSort(listName, null, true);
}
