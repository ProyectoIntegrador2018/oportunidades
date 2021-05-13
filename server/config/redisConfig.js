const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  db: process.env.REDIS_DB,
  url: process.env.REDIS_URL,
};

module.exports = redisConfig;
