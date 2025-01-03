import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

async function connectToRedis() {
  try {
    const redis = new Redis(process.env.REDIS_URL);

    console.log("connected to redis");
    // await redis.set("foo", "bar");
    // const data = await redis.get("foo");

    return redis;
  } catch (e) {
    console.log(`Error connecting to redis database ${e.message}`);
  }
}
export default connectToRedis;
