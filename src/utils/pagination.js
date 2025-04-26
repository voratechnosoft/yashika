const defaultLimit = 10;

const paginationFn = (
  { sort = null, iPage = 1, iLimit = defaultLimit, holdingSort },
  defaultSortOn = "createdAt"
) => {
  const skip = (iPage - 1) * iLimit;
  iLimit = parseInt(iLimit);

  const sortBy = holdingSort ? { _id: 1 } : { _id: -1 };

  return {
    sortBy,
    docLimit: iLimit,
    noOfDocSkip: skip,
  };
};
module.exports = paginationFn;
