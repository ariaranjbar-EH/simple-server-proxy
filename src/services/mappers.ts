if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  // Use dev dependency
  dotenv.config();
}

export function server_root_address(): string {
  return (
    process.env.SERVER_URL +
    (process.env.NODE_ENV !== "production" ? ":" + process.env.PORT : "") +
    "/" +
    process.env.SERVER_API_VERSION
  );
}
