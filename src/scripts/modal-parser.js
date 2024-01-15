import { CONSTANTS } from "./constants.js";
import { dateToString } from "./utils.js";

const slashRegex = /\d\d\/\d\d\/\d\d\d\d/gi;
const dashRegex = /\d\d\d\d-\d\d-\d\d/gi;

export const parseModalContent = () => {
  let content = document.getElementById(CONSTANTS.IDS.MODAL_TEXT_AREA).value;
  let contentIsValid = true;

  const rowArr = content
    .replaceAll("\t", " ")
    .trim()
    .split("\n")
    .map((row) => {
      if (!contentIsValid) {
        return null;
      }

      const [fromDateStr, toDateStr, percentStr, absenceType] = row.split(" ");

      let fromDate = parseDateStr(fromDateStr);
      let toDate = parseDateStr(toDateStr);

      if (!fromDate || !toDate || fromDate > toDate) {
        contentIsValid = false;
        return null;
      }

      return [
        dateToString(fromDate, "-"),
        dateToString(toDate, "-"),
        parseInt(percentStr),
        absenceType,
      ];
    });

  if (contentIsValid) {
    return rowArr;
  } else {
    return null;
  }
};

const parseDateStr = (dateStr) => {
  if (dateStr.match(slashRegex)) {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  } else if (dateStr.match(dashRegex)) {
    return new Date(dateStr);
  } else {
    return null;
  }
};
