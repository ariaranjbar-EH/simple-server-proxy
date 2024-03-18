import { logger } from "../services/logger";
import { TargetClient } from "../clients/target_server_api";

const targetServerClient = new TargetClient();

export async function passthrough(
  q: string,
  h: Record<string, string | string[] | undefined>
) {
  try {
    const resp = await targetServerClient.direct(q, h);
    const result = await resp.data;
    return { status: resp.status, headers: resp.headers, raw: result };
  } catch (error: any) {
    logger.error(`passthrough failed [query: ` + q + `]: ${error}`);
    const resp = error.response || { status: 500, data: {} };
    return {
      status: resp.status,
      json: {
        message: "Failed to pass [" + q + "] through to target server",
        error: error.response.data.toString("utf8"),
      },
    };
  }
}

export default {
  passthrough,
};
