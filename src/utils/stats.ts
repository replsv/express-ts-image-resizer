import * as Redis from "redis";
import { promisify } from "util";
import * as Fs from "fs";
import { existsAsync, readDirAsync } from "./resizer";

let redisClient: Redis.RedisClient;

// stats keys
const keys: string[] = [
  `serve_desktop`,
  "serve_mobile",
  "serve_cached",
  "serve_original",
  "serve_404",
  "hits",
  "misses"
];

export const initStatsStorage = (): void => {
  const redisDsn = process.env.REDIS_DSN;
  redisClient = Redis.createClient({ url: redisDsn });
};

export const increment = (key: string): void => {
  redisClient.incr(key);
};

export const getUsageStats = async () => {
  const getAsync = promisify(redisClient.get).bind(redisClient);
  const stats: { [key: string]: any } = {};
  for (const key of keys) {
    stats[key] = parseInt(await getAsync(key)) || 0;
  }
  return stats;
};

export const getFilesStats = async () => {
  const stats: { [key: string]: any } = {};
  const dirs: { [key: string]: string | any } = {
    original_files: process.env.FILES_DIR,
    cached_files_desktop: `${process.env.CACHE_DIR}/desktop/`,
    cached_files_mobile: `${process.env.CACHE_DIR}/mobile/`
  };
  for (const dirKey of Object.keys(dirs)) {
    if (!(await existsAsync(dirs[dirKey]))) {
      stats[dirKey] = 0;
    } else {
      stats[dirKey] = (await readDirAsync(dirs[dirKey])).length;
    }
  }
  return stats;
};
