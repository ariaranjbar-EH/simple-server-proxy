import https from "https";
import axios, {
  AxiosError,
  AxiosResponse,
  CreateAxiosDefaults,
  AxiosInstance,
} from "axios";
import { logger } from "../services/logger";

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  // Use dev dependency
  dotenv.config();
}

export class TargetClient {
  private api: AxiosInstance;
  public constructor() {
    const apiConfig: CreateAxiosDefaults = {
      baseURL: process.env.TARGET_SERVER_API_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // TODO: REMOVE THE FOLLOWING HACK
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    this.api = axios.create(apiConfig);
    this.api.interceptors.request.use((config) => {
      logger.info(`request ready with URL[${config.baseURL! + config.url!}]`);
      return config;
    });
    this.api.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        const { data, status } = error.response!;
        switch (status) {
          case 400:
            logger.error(
              error.request.method +
                " request with path " +
                error.request.path +
                " failed: bad request"
            );
            break;

          case 401:
            logger.error(
              error.request.method +
                " request with path " +
                error.request.path +
                " failed: unauthorised"
            );
            break;

          case 404:
            logger.error(
              error.request.method +
                " request with path " +
                error.request.path +
                " failed: not found"
            );
            break;

          case 409:
            logger.error(
              error.request.method +
                " request with path " +
                error.request.path +
                " failed: conflict"
            );
            break;

          case 500:
            logger.error(
              error.request.method +
                " request with path " +
                error.request.path +
                " failed: server error"
            );
            break;
        }
        return Promise.reject(error);
      }
    );
  }
  public direct<T = any, R = AxiosResponse<T>>(
    query: string,
    headers: Record<string, string | string[] | undefined>
  ): Promise<R> {
    const aug_headers: Record<string, string | string[] | undefined> = {};
    aug_headers["Content-Type"] =
      headers["Content-Type"] || headers["content-type"] || "application/json";
    aug_headers["Accept"] = headers["Accept"] || headers["accept"] || "*/*";
    aug_headers["Authorization"] =
      process.env.TARGET_SERVER_AUTH_TOKEN ||
      "";
    return axios.get(query, {
      baseURL: process.env.TARGET_SERVER_API_URL,
      headers: aug_headers,
      responseType: "arraybuffer",
      // TODO: REMOVE THE FOLLOWING HACK
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }
}
