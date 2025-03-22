import crypto from "crypto";

export function generateGroupId(key: string) {
  return "0x" + crypto.createHash("sha256").update(key).digest("hex");
}
