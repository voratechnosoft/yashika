const { toTitleCase } = require("./response");

const getStatusTitle = (mainStatusObject, mainUserId) => {
  let title = mainStatusObject?.labels?.[mainUserId]?.title;
  if (!title) title = mainStatusObject?.title;
  return toTitleCase(title);
};

module.exports = getStatusTitle;
