import {
  shouldCheckCache,
  originalFileExists,
  originalFilePath,
  deviceType,
  cacheFilePath
} from "../utils/resizer";

import * as DotEnv from "dotenv";
import { mockRequest } from "mock-req-res";

DotEnv.config({
  path: `${process.cwd()}/.env`
});

test("check should cache", () => {
  expect(shouldCheckCache({ width: 100, height: 100 })).toBe(true);
  expect(shouldCheckCache({ width: 100 })).toBe(false);
  expect(shouldCheckCache({ width: 100, height: 100, extra: "a" })).toBe(false);
});

test("check original file", async () => {
  expect(await originalFileExists("whatever.jpg")).toBe(false);
  expect(
    await originalFileExists("brady-bellini-_hpk_92Crhs-unsplash.jpg")
  ).toBe(true);
});

test("check original file format", () => {
  expect(originalFilePath("something.jpg").length).toBeGreaterThan(0);
});

test("check cache path", () => {
  expect(cacheFilePath("something.jpg").length).toBeGreaterThan(0);
});

test("determine device type", () => {
  expect(
    deviceType(
      mockRequest({ headers: { "user-agent": "mobile device 1.3.4" } })
    )
  ).toBe("mobile");
  expect(
    deviceType(mockRequest({ headers: { "user-agent": "firefox 2.3.4" } }))
  ).toBe("desktop");
  // no user agent sent which could be considered strange
  expect(deviceType(mockRequest())).toBe("desktop");
});
