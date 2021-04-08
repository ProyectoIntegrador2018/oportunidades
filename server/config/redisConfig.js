const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  db: process.env.REDIS_DB,
};

module.exports = redisConfig;
