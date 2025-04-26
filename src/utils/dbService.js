const collections = require("../collections");
const paginationFn = require("./pagination");
const createOneRecord = async (modelName, data) => {
  try {
    return await collections[modelName](data).save();
  } catch (error) {
    console.error("<<<<<<<<<<<<createOneRecord>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const createManyRecords = async (modelName, data) => {
  try {
    return await collections[modelName].insertMany(data);
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<createManyRecords>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};

const updateManyRecords = async (modelName, query, data, options = {}) => {
  try {
    return await collections[modelName].updateMany(query, data, options);
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<updateManyRecords>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};

const findOneRecord = async (
  modelName,
  query,
  options = {},
  isCollation = false
) => {
  try {
    if (isCollation)
      return await collections[modelName]
        .findOne(query, options)
        .collation({ locale: "en", strength: 2 });
    return await collections[modelName].findOne(query, options);
  } catch (error) {
    console.error("<<<<<<<<<<<<findOneRecord>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const findAllRecords = async (
  modelName,
  query,
  options = {},
  sort = { _id: -1 }
) => {
  try {
    return await collections[modelName].find(query, options).sort(sort);
  } catch (error) {
    console.error("<<<<<<<<<<<<findAllRecords>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const findDistinctKey = async (modelName, key, query) => {
  try {
    return await collections[modelName].distinct(key, query);
  } catch (error) {
    console.error("<<<<<<<<<<<<findDistinctKey>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const recordsCount = async (modelName, query, options = {}) => {
  try {
    return await collections[modelName].countDocuments(query);
  } catch (error) {
    console.error("<<<<<<<<<<<<recordsCount>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const findOneAndUpdateRecord = async (
  modelName,
  query,
  payload,
  options = {}
) => {
  try {
    return await collections[modelName].findOneAndUpdate(
      query,
      payload,
      options
    );
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<findOneAndUpdateRecord>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};

const findOneAndReplaceRecord = async (
  modelName,
  query,
  payload,
  options = {}
) => {
  try {
    return await collections[modelName].replaceOne(query, payload, options);
  } catch (error) {
    console.error("<<<<<<<<<<<<replaceOne>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const aggregateData = async (modelName, query, isCollation = false) => {
  try {
    if (isCollation)
      return await collections[modelName]
        .aggregate(query)
        .collation({ locale: "en" });
    return await collections[modelName].aggregate(query);
  } catch (error) {
    console.error("<<<<<<<<<<<<aggregateData>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const findManyRecordsWithPagination = async (
  modelName,
  query,
  { sort, page = 1, limit },
  options = {}
) => {
  try {
    const { docLimit, noOfDocSkip } = paginationFn({
      page,
      limit,
    });

    return {
      items: await collections[modelName]
        .find(query, options)
        .sort(sort)
        .skip(noOfDocSkip)
        .limit(docLimit),
      count: await collections[modelName].countDocuments(query),
      page,
      limit: docLimit,
    };
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<findManyRecordsWithPagination>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};

const findAllRecordsWithPopulate = async (
  modelName,
  query,
  options = {},
  populateOptions = {}
) => {
  try {
    return await collections[modelName]
      .find(query, options)
      .populate(populateOptions);
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<findAllRecordsWithPopulate>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};
const findLastRecord = async (
  modelName,
  query,
  options = {},
  sort = { _id: -1 }
) => {
  try {
    return await collections[modelName]
      .find(query, options)
      .sort(sort)
      .limit(1);
  } catch (error) {
    console.error("<<<<<<<<<<<<findLastRecord>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const findManyRecordsWithPaginationAndPopulate = async (
  modelName,
  query,
  { sort, page = 1, limit },
  options = {},
  populateOptions = {}
) => {
  try {
    const { docLimit, noOfDocSkip } = paginationFn({
      page,
      limit,
    });

    return {
      items: await collections[modelName]
        .find(query, options)
        .sort(sort)
        .skip(noOfDocSkip)
        .limit(docLimit)
        .populate(populateOptions),
      count: await collections[modelName].countDocuments(query),
      page,
      limit: docLimit,
    };
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<findManyRecordsWithPaginationAndPopulate>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};

const findOneRecordsWithPopulate = async (
  modelName,
  query,
  options = {},
  populateOptions = {}
) => {
  try {
    return await collections[modelName]
      .findOne(query, options)
      .populate(populateOptions);
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<findOneRecordsWithPopulate>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};

const findAllRecordsWithPopulateSort = async (
  modelName,
  query,
  { sort },
  options = {},
  populateOptions = {}
) => {
  try {
    return await collections[modelName]
      .find(query, options)
      .sort(sort)
      .populate(populateOptions);
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<findAllRecordsWithPopulateSort>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};

const updateOneRecords = async (modelName, query, data, options = {}) => {
  try {
    return await collections[modelName].updateOne(query, data, options);
  } catch (error) {
    console.error(
      "<<<<<<<<<<<<updateOneRecords>>>>>>>>>>>>>",
      modelName,
      error
    );
    throw new Error(error);
  }
};

const removeRecords = async (modelName, query) => {
  try {
    return await collections[modelName].remove(query);
  } catch (error) {
    console.error("<<<<<<<<<<<<removeRecords>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

const replaceRecords = async (modelName, where, payload, options) => {
  try {
    return await collections[modelName].replaceOne(where, payload, options);
  } catch (error) {
    console.error("<<<<<<<<<<<<removeRecords>>>>>>>>>>>>>", modelName, error);
    throw new Error(error);
  }
};

module.exports = {
  findOneRecord,
  findAllRecords,
  aggregateData,
  findOneAndUpdateRecord,
  recordsCount,
  updateManyRecords,
  createManyRecords,
  createOneRecord,
  findManyRecordsWithPagination,
  findDistinctKey,
  findLastRecord,
  findAllRecordsWithPopulate,
  findManyRecordsWithPaginationAndPopulate,
  findOneRecordsWithPopulate,
  findAllRecordsWithPopulateSort,
  updateOneRecords,
  removeRecords,
  replaceRecords,
  findOneAndReplaceRecord,
};
