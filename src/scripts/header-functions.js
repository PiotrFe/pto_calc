import { CONSTANTS } from "./constants.js";

function updateHeaderSort(e) {
  const elem = e.target;
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

    return;
  }

  const isSortedDesc = elem.classList.contains(
    CONSTANTS.CLASS_NAMES.SORTED_DESC
  );

  console.log({ isSorted, isSortedDesc });

  if (isSortedDesc) {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED);
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnParent({ elem, shouldAdd: false });
  } else {
    elem.classList.remove(CONSTANTS.CLASS_NAMES.SORTED_ASC);
    elem.classList.add(CONSTANTS.CLASS_NAMES.SORTED_DESC);

    updateSortIconOnParent({ elem, shouldAdd: false });
    updateSortIconOnParent({ elem, shouldAdd: true, dir: "desc" });
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

export { updateHeaderSort };
