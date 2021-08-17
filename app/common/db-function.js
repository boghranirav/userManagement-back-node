/**
 *
 * @param {model} model -  table name
 * @param {*} request  - Table create data
 */
const create = (model, request) => {
  try {
    return new Promise(async (resolve, reject) => {
      const create = await model.create(request);
      if (create) {
        return resolve(create);
      } else {
        return resolve({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};
/**
 *
 * @param {*} model - table name
 * @param {*} query - condition
 */
const findOne = (model, query) => {
  try {
    return new Promise(async (resolve, reject) => {
      const getData = model.findOne(query);
      if (getData) {
        return resolve(getData);
      } else {
        return resolve({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};

/**
 *
 * @param {*} model - table name
 * @param {*} id  - id
 */
const findByPk = (model, id) => {
  try {
    return new Promise(async (resolve, reject) => {
      const getData = model.findByPk(id);
      if (getData) {
        return resolve(getData);
      } else {
        return reject({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};

/**
 *
 * @param {*} model - table name
 * @param {*} query - query condition for get All records.
 */
const findAll = (model, query) => {
  try {
    return new Promise(async (resolve, reject) => {
      const getData = model.findAll(query);
      if (getData) {
        return resolve(getData);
      } else {
        return resolve({ message: "Record(s) not found." });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};

/**
 *
 * @param {*} model - table name
 * @param {*} query - query condition for remove any record
 */
const remove = (model, query) => {
  try {
    return new Promise(async (resolve, reject) => {
      const getData = model.findOne(query);
      if (getData) {
        const deleteData = model.destroy(query);
        if (deleteData) {
          return resolve(deleteData);
        } else {
          return reject({ message: "Something went wrong" });
        }
      } else {
        return reject({ message: "Record(s) not found." });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};

/**
 *
 * @param {*} model - table name
 * @param {*} query - condition for update data
 * @param {*} updateData - field which are updating
 * @returns update MySQL object
 */
const update = (model, query, updateData) => {
  try {
    return new Promise(async (resolve, reject) => {
      const update = model.update(updateData, query);
      if (update) {
        return resolve(update);
      } else {
        return resolve({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};

/**
 *
 * @param {*} model - table name
 * @param {*} searchId - id which need to be updated
 * @param {*} requestData - fields which needs to be updated
 * @returns update MySQL object
 */
const findAndUpdate = (model, searchId, requestData) => {
  try {
    return new Promise(async (resolve) => {
      const getData = await model.findOne(searchId);

      if (getData) {
        const update = await getData.update(requestData);
        if (update) {
          return resolve(update);
        } else {
          return resolve({ message: "Something went wrong while updating." });
        }
      } else {
        return resolve({ message: "Data not found." });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};
/**
 *
 * @param {*} model - table name
 * @param {*} id  - id
 */
const bulkInsert = (model, data) => {
  try {
    return new Promise(async (resolve, reject) => {
      const bulkCreate = model.bulkCreate(data);
      if (bulkCreate) {
        return resolve(bulkCreate);
      } else {
        return reject({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};

/**
 *
 * @param {*} model - table name
 * @param {*} query - query condition for get All records.
 */
const findAndCountAll = (model, query, page, limit) => {
  try {
    return new Promise(async (resolve, reject) => {
      const getData = model.findAndCountAll(query);
      if (getData) {
        const response = getPagingData(getData, page, limit);
        return resolve(response);
      } else {
        return reject({ message: "Record(s) not found." });
      }
    });
  } catch (error) {
    return reject({
      message: "Something went wrong",
      error: true,
      error_mesage: error,
    });
  }
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: sport_center } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, data: data.rows, totalPages, currentPage };
};

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page : 0;

  return { limit, offset };
};

module.exports = {
  create: create,
  findOne: findOne,
  findByPk: findByPk,
  findAll: findAll,
  remove: remove,
  update: update,
  findAndUpdate: findAndUpdate,
  bulkInsert: bulkInsert,
  findAndCountAll: findAndCountAll,
  getPagingData: getPagingData,
  getPagination: getPagination,
};
