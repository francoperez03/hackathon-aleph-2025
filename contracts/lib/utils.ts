import crypto from "crypto";

export function generateGroupId(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}
