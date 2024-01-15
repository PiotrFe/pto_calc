import { CONSTANTS } from "./constants.js";

const slashRegex = /\d\d\d\d\/\d\d\/\d\d/gi;
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

      const [fromDateStr, toDateStr, percentStr, ...otherProps] = row;
      let fromDate = parseDateStr(fromDateStr);
      let toDate = parseDateStr(toDateStr);

      console.log({
        fromDate,
        toDate,
      });

      if (!fromDate || !toDate) {
        contentIsValid = false;
        return null;
      }

      return {
        fromDate,
        toDate,
        percentStr: parseInt(percentStr),
        otherProps,
      };
    });

  if (contentIsValid) {
    console.log({ rowArr });
    return rowArr;
  } else {
    console.log("Invalid content");
    return null;
  }
};

const parseDateStr = (dateStr) => {
  console.log({
    dateStr,
    slashMatch: dateStr.match(slashRegex),
    dashMatch: dateStr.match(dashRegex),
  });
  if (dateStr.match(slashRegex)) {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  } else if (dateStr.match(dashRegex)) {
    return new Date(dateStr);
  } else {
    return null;
  }
};
