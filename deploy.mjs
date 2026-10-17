/* eslint-disable no-console */
// Optional deployment helper. SSH keys stay outside the repository.
import { execFileSync } from "node:child_process";
const { DEPLOY_HOST, DEPLOY_USER, DEPLOY_TARGET, DEPLOY_PORT = "22" } = process.env;
if (!DEPLOY_HOST || !DEPLOY_USER || !DEPLOY_TARGET) {
  throw new Error("Set DEPLOY_HOST, DEPLOY_USER and DEPLOY_TARGET explicitly; no default destination.");
}
if (!/^[a-zA-Z0-9.-]+$/.test(DEPLOY_HOST) || !/^[a-zA-Z0-9_-]+$/.test(DEPLOY_USER)
    || !/^\d+$/.test(DEPLOY_PORT) || !/^\/[a-zA-Z0-9_./-]+$/.test(DEPLOY_TARGET)) {
  throw new Error("Invalid deployment destination.");
}
// Run the build separately so this helper only performs an explicitly requested copy.
execFileSync("scp", ["-P", DEPLOY_PORT, "-r", "dist/.", `${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_TARGET}/`], {
  stdio: "inherit",
});
