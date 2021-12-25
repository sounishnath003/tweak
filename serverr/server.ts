import cookieParser from "cookie-parser";
import cors from "cors";
import Express, {
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import { NotFound } from "http-errors";
import morgan from "morgan";
import apiController from "./controllers/api.controller";

export class Server {
  private readonly PORT = 1337;
  private server;
  constructor() {
    this.server = Express();
  }

  /**
   * run
   */
  public run() {
    try {
      this.serverConfig();
      this.server.listen(this.PORT, () =>
        console.log(`Server already started localhost:${this.PORT}`)
      );
      this.server.use('/api', apiController);
      this.errorHandler();
    } catch (error) {
      console.error({ error });
    }
  }

  private serverConfig() {
    this.server.use(cors());
    this.server.use(cookieParser())
    this.server.use(json());
    this.server.use(urlencoded({ extended: false }));
    this.server.use(morgan("dev"));
  }

  private errorHandler() {
    this.server.use((req: Request, res: Response, next: NextFunction) =>
      next(new NotFound())
    );
    this.server.use(
      (
        err: { status: number; message: string },
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        console.error(err.message);
        return res.status(err.status || 500).send({
          error: {
            status: err.status || 500,
            message: err.message,
          },
        });
      }
    );
  }
}