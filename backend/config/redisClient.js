const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: process.env.REDIS_URL.startsWith("rediss://"),
    rejectUnauthorized: false, // This is often needed with Upstash
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;