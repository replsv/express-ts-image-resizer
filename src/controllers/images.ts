import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";

import {
  shouldCheckCache,
  originalFileExists,
  originalFilePath,
  resize,
  deviceType,
  httpCacheOptions,
  cacheFilePath
} from "../utils/resizer";
import { increment } from "../utils/stats";

@Controller("images")
export class ImagesController {
  private servedImages: string[] = [];
  @Get(":name")
  private async get(req: Request, res: Response) {
    const fileName: string = req.params.name;
    const queryParams: { [key: string]: any } = req.query;

    // prevent IO ops
    if (shouldCheckCache(queryParams)) {
      if (this.servedImages.includes(cacheFilePath(fileName))) {
        increment("hits");
        return res.sendFile(cacheFilePath(fileName), httpCacheOptions);
      }
    } else if (this.servedImages.includes(originalFilePath(fileName))) {
      increment("hits");
      return res.sendFile(originalFilePath(fileName), httpCacheOptions);
    }

    try {
      const exists: boolean = await originalFileExists(fileName);
      if (exists) {
        const dT: DeviceType = deviceType(req);
        increment(`serve_${dT}`);
        if (shouldCheckCache(queryParams)) {
          // check query params
          const cacheFilePath = await resize(fileName, {
            width: parseInt(queryParams.width),
            height: parseInt(queryParams.height),
            device: dT
          });
          increment("serve_cached");
          this.servedImages.push(cacheFilePath);
          return res.sendFile(cacheFilePath, httpCacheOptions);
        } else {
          // serve original image
          increment("serve_original");
          this.servedImages.push(originalFilePath(fileName));
          return res.sendFile(originalFilePath(fileName), httpCacheOptions);
        }
      } else {
        increment("serve_404");
        return res.status(404).json({ error: "Unknown file." });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: "Something went pretty bad. :(" });
    }
  }
}
