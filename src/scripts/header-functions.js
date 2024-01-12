import { CONSTANTS } from "./constants.js";

function addHeaderListeners() {
  document
    .querySelector("#employment-from")
    .addEventListener("click", () =>
      updateHeaderSort(
        CONSTANTS.ENTRY_TYPES.EMPLOYMENT,
        CONSTANTS.SORT_FIELDS.FROM
      )
    );

  document.querySelector("#employment-to").addEventListener("click", () => {
    updateHeaderSort(
      CONSTANTS.ENTRY_TYPES.EMPLOYMENT,
      CONSTANTS.SORT_FIELDS.TO
    );
  });

  document
    .querySelector("#employment-percent")
    .addEventListener("click", () => {
      updateHeaderSort(
        CONSTANTS.ENTRY_TYPES.EMPLOYMENT,
        CONSTANTS.SORT_FIELDS.PERCENT
      );
    });

  document.querySelector("#absence-from").addEventListener("click", () => {
    updateHeaderSort(CONSTANTS.ENTRY_TYPES.ABSENCE, CONSTANTS.SORT_FIELDS.FROM);
  });

  document.querySelector("#absence-to").addEventListener("click", () => {
    updateHeaderSort(CONSTANTS.ENTRY_TYPES.ABSENCE, CONSTANTS.SORT_FIELDS.TO);
  });

  document.querySelector("#absence-percent").addEventListener("click", () => {
    updateHeaderSort(
      CONSTANTS.ENTRY_TYPES.ABSENCE,
      CONSTANTS.SORT_FIELDS.PERCENT
    );
  });

  document.querySelector("#absence-reason").addEventListener("click", () => {
    updateHeaderSort(
      CONSTANTS.ENTRY_TYPES.ABSENCE,
      CONSTANTS.SORT_FIELDS.REASON
    );
  });
}

function updateHeaderSort(hName, fName) {
  if (!hName || !fName) {
    return;
  }

  const headerName = hName.toLowerCase();
  const fieldName = fName.toLowerCase();

  const parentHeaderElem = document.querySelector(`#${headerName}-list`);
  const newSortFieldElem = document.querySelector(
    `#${headerName}-${fieldName}`
  );

  if (
    !newSortFieldElem ||
    !newSortFieldElem.classList.contains(CONSTANTS.CLASS_NAMES.SORTABLE)
  ) {
    return;
  }

  const sortStatus = updateSortStatus(parentHeaderElem, newSortFieldElem);

  // if (sortStatus === CONSTANTS.SORT_STATUS.NONE) {
  //   return;
  // }

  // sortData({ byField: elem.textContent.toUpperCase(), dir: sortStatus });
}

function updateSortStatus(headerElem, elem) {
  if (!elem || !headerElem) {
    return;
  }

  const currentSortArr = Array.from(
    document.querySelectorAll(`.${CONSTANTS.CLASS_NAMES.SORTED}`)
  );

  const currentSort = currentSortArr.find((e) => {
    const parentListName = `${e.id}`.split("-")?.[0];

    return `${parentListName}-list` === headerElem.id;
  });

  if (currentSort && currentSort !== elem) {
    currentSort.classList.remove(CONSTANTS.CLASS_NAMES.SORTED);
    currentSort.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_ASC);
    currentSort.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnHeader({ elem: currentSort });
  }

  const isSorted = elem.classList.contains(CONSTANTS.CLASS_NAMES.SORTED);
  const isSortedDesc = elem.classList.contains(
    CONSTANTS.CLASS_NAMES.SORTED_DESC
  );

  if (!isSorted) {
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED);
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnHeader({ elem, dir: "desc" });

    return CONSTANTS.SORT_STATUS.DESC;
  } else if (isSortedDesc) {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_DESC);
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED_ASC);

    updateSortIconOnHeader({ elem });
    updateSortIconOnHeader({ elem, dir: "asc" });

    return CONSTANTS.SORT_STATUS.DESC;
  } else {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED);
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_ASC);

    updateSortIconOnHeader({ elem });

    return CONSTANTS.SORT_STATUS.NONE;
  }
}

function updateSortIconOnHeader({ elem, dir }) {
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

function sortData({ byField, dir }) {
  const entryList = document.getElementsByClassName(
    CONSTANTS.CLASS_NAMES.LIST_ENTRY
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
      sortByElem = CONSTANTS.CLASS_NAMES.LIST_ENTRY_DATE_FROM;
      break;
    case CONSTANTS.SORT_FIELDS.TO:
      sortByElem = CONSTANTS.CLASS_NAMES.LIST_ENTRY_DATE_TO;
      break;
    case CONSTANTS.SORT_FIELDS.PERCENT:
      sortByElem = CONSTANTS.CLASS_NAMES.LIST_ENTRY_PERCENT;
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

    const valA = sortFieldA.dataset.entryVal;
    const valB = sortFieldB.dataset.entryVal;

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

  const parentElem = document.getElementById(CONSTANTS.IDS.ABSENCE_ENTRIES);
  elemArr.forEach((e) => parentElem.appendChild(e));
}

export { addHeaderListeners };
