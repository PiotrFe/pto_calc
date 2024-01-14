import { CONSTANTS } from "./constants.js";

export const parseModalContent = () => {
  let content = document.getElementById(CONSTANTS.IDS.MODAL_TEXT_AREA).value;

  const rowArr = content.replaceAll("\t", " ").trim().split("\n");

  console.log(rowArr);
};
