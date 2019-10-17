import { Controller, Get, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { getUsageStats, getFilesStats } from "../utils/stats";
import { authMiddleware } from "../middlewares";

@Controller("stats")
export class StatsController {
  @Middleware([authMiddleware])
  @Get("/")
  private async get(req: Request, res: Response): Promise<Response> {
    const stats = await getUsageStats();
    const filesStats = await getFilesStats();
    return res.json({ stats, filesStats });
  }
}
