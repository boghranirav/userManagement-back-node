const SequelizeRedis = require("sequelize-redis");
const redis = require("redis");
const bluebird = require("bluebird");

const redisUrl = "redis://127.0.0.1:6379";
const redisClient = redis.createClient(redisUrl);
bluebird.promisifyAll(redisClient);

const sequelizeRedis = new SequelizeRedis(redisClient);

const cacheFind = async function (uniqueId, tableName, model, condition) {
  const key = tableName + "_" + uniqueId;

  const value = sequelizeRedis.getModel(model, { ttl: 60 * 60 * 24 });
  //const [resUser, cacheHit] = await value.findByPkCached(key, uniqueId);
  const [resUser, cacheHit] = await value.findOneCached(key, condition);
  console.log(cacheHit);
  if (resUser) {
    return resUser.toJSON();
  } else {
    return {};
  }
};

const deleteCached = (uniqueId, tableName) => {
  const key = tableName + "_" + uniqueId;
  redisClient.del(key);
};

module.exports = { cacheFind: cacheFind, deleteCached: deleteCached };
