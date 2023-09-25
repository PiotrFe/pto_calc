import { CONSTANTS } from "./constants.js";

function updateHeaderSort(e) {
  const elem = e.target;

  if (!elem) {
    return;
  }

  const isSortable = elem.classList.contains(CONSTANTS.CLASS_NAMES.SORTABLE);

  if (!isSortable) {
    return;
  }

  const sortStatus = updateSortStatus(elem);

  if (sortStatus === CONSTANTS.SORT_STATUS.NONE) {
    return;
  }

  sortData({ byField: elem.textContent.toUpperCase(), dir: sortStatus });
}

function updateSortStatus(elem) {
  const isClickable = elem.classList.contains(CONSTANTS.CLASS_NAMES.CLICKABLE);

  if (!isClickable) {
    return;
  }

  const currentSort = document.querySelector(
    `.${CONSTANTS.CLASS_NAMES.SORTED}`
  );

  if (currentSort && currentSort !== elem) {
    currentSort.classList.remove(CONSTANTS.CLASS_NAMES.SORTED);
    currentSort.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_ASC);
    currentSort.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnParent({ elem: currentSort, shouldAdd: false });
  }

  const isSorted = elem.classList.contains(CONSTANTS.CLASS_NAMES.SORTED);

  if (!isSorted) {
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED);
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED_ASC);

    updateSortIconOnParent({ elem, shouldAdd: true, dir: "asc" });

    return CONSTANTS.SORT_STATUS.ASC;
  }

  const isSortedDesc = elem.classList.contains(
    CONSTANTS.CLASS_NAMES.SORTED_DESC
  );

  if (isSortedDesc) {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED);
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnParent({ elem, shouldAdd: false });

    return CONSTANTS.SORT_STATUS.NONE;
  } else {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_ASC);
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnParent({ elem, shouldAdd: false });
    updateSortIconOnParent({ elem, shouldAdd: true, dir: "desc" });

    return CONSTANTS.SORT_STATUS.DESC;
  }
}

function updateSortIconOnParent({ elem, shouldAdd = false, dir = "asc" }) {
  if (!elem) {
    return;
  }
  const parent = elem.parentElement;

  if (!shouldAdd) {
    const icon = parent.querySelector(`.${CONSTANTS.CLASS_NAMES.SORT_ICON}`);
    icon.remove();

    return;
  }

  const icon = document.createElement("i");
  icon.classList.add("bi");
  icon.classList.add(dir === "asc" ? "bi-sort-up-alt" : "bi-sort-down");
  icon.classList.add(CONSTANTS.CLASS_NAMES.SORT_ICON);
  parent.append(icon);
}

function sortData({ byField, dir }) {
  const entryList = document.getElementsByClassName(
    CONSTANTS.CLASS_NAMES.ABSENCE_ENTRY
  );

  if (
    entryList.length < 2 ||
    !dir ||
    ![CONSTANTS.SORT_STATUS.ASC, CONSTANTS.SORT_STATUS.DESC].includes(dir)
  ) {
    return;
  }

  const elemArr = [...entryList];

  let sortByElem;

  switch (byField) {
    case CONSTANTS.SORT_FIELDS.FROM:
      sortByElem = CONSTANTS.CLASS_NAMES.ABSENCE_DATE_FROM;
      break;
    case CONSTANTS.SORT_FIELDS.TO:
      sortByElem = CONSTANTS.CLASS_NAMES.ABSENCE_DATE_TO;
      break;
    case CONSTANTS.SORT_FIELDS.PERCENT:
      sortByElem = CONSTANTS.CLASS_NAMES.ABSENCE_PERCENT;
      break;
    case CONSTANTS.SORT_FIELDS.REASON:
      sortByElem = CONSTANTS.CLASS_NAMES.REASON;
      break;
    default:
      break;
  }

  if (!sortByElem) {
    return;
  }

  elemArr.sort((elemA, elemB) => {
    const sortFieldA = elemA.querySelector(`.${sortByElem}`);
    const sortFieldB = elemB.querySelector(`.${sortByElem}`);

    const valA = sortFieldA.value;
    const valB = sortFieldB.value;

    let parsedValA;
    let parsedValB;

    switch (sortFieldA.type) {
      case "number":
        parsedValA = parseInt(valA);
        parsedValB = parseInt(valB);
        break;
      case "date":
        parsedValA = new Date(valA);
        parsedValB = new Date(valB);
        break;
      default:
        parsedValA = valA;
        parsedValB = valB;
        break;
    }

    return dir === CONSTANTS.SORT_STATUS.ASC
      ? parsedValA - parsedValB
      : parsedValB - parsedValA;
  });

  const parentElem = document.getElementById(CONSTANTS.IDS.ABSENCE_ENTRY_LIST);
  elemArr.forEach((e) => parentElem.appendChild(e));
}

export { updateHeaderSort };
