import * as Fs from "fs";
import { promisify } from "util";
import { Request } from "express";
import { increment } from "./stats";
const Jimp = require("jimp");

export const existsAsync = promisify(Fs.exists);
export const readDirAsync = promisify(Fs.readdir);

export const httpCacheOptions = {
  maxAge: "365d",
  immutable: true
};

export const deviceType = (req: Request): DeviceType => {
  return /mobile/i.test(<string>req.headers["user-agent"])
    ? "mobile"
    : "desktop";
};

const qualityByDevice = (deviceType: DeviceType): number => {
  if (deviceType === "mobile") {
    return parseInt(`${process.env.QUALITY_MOBILE}`);
  } else {
    return parseInt(`${process.env.QUALITY_DESKTOP}`);
  }
};

export const cacheName = (
  fileName: string,
  resizeOptions: ResizeOptions
): string => {
  return `${resizeOptions.device}/${resizeOptions.height}_${resizeOptions.width}_${fileName}`;
};

export const shouldCheckCache = (context: {
  [key: string]: string | number;
}) => {
  const contextKeys: string[] = Object.keys(context);
  return (
    contextKeys.length === 2 &&
    contextKeys.includes("width") &&
    contextKeys.includes("height")
  );
};

export const resize = async (
  fileName: string,
  resizeOptions: ResizeOptions
): Promise<string> => {
  const exists = await cacheFileExists(fileName, resizeOptions);
  const cachePath = cacheFilePath(cacheName(fileName, resizeOptions));
  if (!exists) {
    const image = await Jimp.read(originalFilePath(fileName));
    image.resize(resizeOptions.width, resizeOptions.height); // scaleToFit?
    image.quality(qualityByDevice(resizeOptions.device));
    await image.writeAsync(cachePath);
    increment("misses");
  } else {
    increment("hits");
  }
  return cachePath;
};

export const originalFileExists = async (
  fileName: string
): Promise<boolean> => {
  return existsAsync(originalFilePath(fileName));
};

const cacheFileExists = async (
  fileName: string,
  resizeOptions: ResizeOptions
): Promise<boolean> => {
  return existsAsync(cacheFilePath(cacheName(fileName, resizeOptions)));
};

export const originalFilePath = (fileName: string): string =>
  `${process.env.FILES_DIR}/${fileName}`;

export const cacheFilePath = (fileName: string): string =>
  `${process.env.CACHE_DIR}/${fileName}`;
