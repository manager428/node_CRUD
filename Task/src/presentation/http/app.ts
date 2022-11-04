import http from "http";
import express from "express";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";
import logger from "morgan";
import helmet from "helmet";
import path from "path";
import jwt from "express-jwt";
import { authRouter } from "./routes/auth/routes";
import { usersRouter } from "./routes/users/routes";
import { errorHandler } from "./routes/errors/routes";
import { IServices } from "../../common/interfaces/IServices";
import swaggerUi from "swagger-ui-express";
import config from "../../configuration";
import fs from "fs";
import swaggerDocument from "../../swagger";
const compress = compression();
const app = express();

const privateKey = fs.readFileSync("src/configuration/private.pem", "utf-8");

app.disable("x-powered-by");
app.enable("x-xss-protection");
app.use(helmet()), app.use(helmet.xssFilter());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(compress);
app.use(logger("dev"));
app.use(cors());

export const appServerFactory = {
  init(services: IServices): http.Server {
    app.use(express.static(path.join(__dirname, "public")));
    app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        explorer: true,
      }),
    );
    app.use(
      jwt({
        secret: privateKey,
        algorithms: ["RS512"],
      }).unless({
        path: ["/admin/register", "/admin/login"],
      }),
    );

    app.use("/admin", authRouter.init(services));
    app.use("/users", usersRouter.init(services));
    app.use(errorHandler);
    return http.createServer(app);
  },
};
