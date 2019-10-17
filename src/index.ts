import * as DotEnv from "dotenv";
import Server from "./server";

DotEnv.config({
  path: `${process.cwd()}/.env`
});

new Server().start(parseInt(<string>process.env.HTTP_PORT));
