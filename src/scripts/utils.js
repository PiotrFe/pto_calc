export const parseTsFromId = (id = "") => {
  const idElems = id.split("-");

  return idElems?.[2] || null;
};
