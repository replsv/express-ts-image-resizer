import { Server } from "@overnightjs/core";
import { loggerMiddleware } from "./middlewares";
import { StatsController } from "./controllers/stats";
import { ImagesController } from "./controllers/images";
import { initStatsStorage } from "./utils/stats";
// import { static as staticMiddleware } from "express";

export default class EXTSImageResizerServer extends Server {
  private setup(): void {
    super.addControllers([new StatsController(), new ImagesController()]);
    initStatsStorage();
  }

  public start(port: number): void {
    this.app.use(loggerMiddleware);
    // this.app.use("/images", staticMiddleware(<string>process.env.FILES_DIR));

    this.setup();
    this.app.listen(port, () => {
      console.info(`Started app on ${port}`);
    });
  }
}
