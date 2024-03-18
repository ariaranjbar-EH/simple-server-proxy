import { Request, Response, NextFunction } from "express";
import target from "../agents/target_server_agent";
import { logger } from "../services/logger";

async function passthrough(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await target.passthrough(
      req.url.split("/passthrough")[1],
      req.headers
    );
    if (
      result.headers &&
      (result.headers["Content-Type"] || result.headers["content-type"])
    ) {
      res.writeHead(200, "", result.headers as any);
      res.end(result.raw, "binary");
    } else {
      res.status(result.status).json(result.json);
    }
  } catch (error: any) {
    logger.error(`passthrough failed [query: ` + req.query + `]: ${error}`);
    const resp = error.response || { status: 500, data: {} };
    res.status(resp.status).json(res.json);
  }
}

export default {
  passthrough,
};
