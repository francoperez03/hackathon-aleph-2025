import { ethers } from "ethers";
import NodeRSA from "encrypt-rsa";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { SERVICE_PROVIDER_ABI } from "@/constants/service-provider";

const nodeRSA = new NodeRSA();
const SERVICE_PROVIDER_ADDRESS = "0xeaf070617f52EC79Aad178DeECa7860658dd7506";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
const serviceProvider = new ethers.Contract(
  SERVICE_PROVIDER_ADDRESS,
  SERVICE_PROVIDER_ABI,
  provider
);

function generateGroupId(key: string) {
  return "0x" + crypto.createHash("sha256").update(key).digest("hex");
}

const KEYS_POOL = [
  {
    ip: "3.91.104.137",
    key: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpZeGpsS0Z3dGltMWJhOXRvczByeDBO@3.91.104.137:35942/?outline=1",
    countryId: "1",
  },
];

export default async function handler() {
  try {
    const requests = await serviceProvider.getUnfulfilledRequests();
    if (!requests.length) {
      console.log("No pending requests...");
      return { status: "ok", message: "No pending requests" };
    }

    console.log("Found pending requests:", requests.length);

    const response = (
      await Promise.allSettled(
        requests.map(async (r: any) => {
          const keys = KEYS_POOL.filter(
            (k) => k.countryId === r.serviceId.toString()
          );
          const key = keys[Math.floor(Math.random() * keys.length)];

          return {
            id: r.id,
            groupId: generateGroupId(key.ip),
            encryptedConnectionDetails:
              await nodeRSA.encryptStringWithRsaPublicKey({
                text: key.key,
                publicKey: Buffer.from(r.encryptionKey, "base64").toString(),
              }),
          };
        })
      )
    )
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    const batch = await serviceProvider.batchFulfill(
      response.map((r) => r.id),
      response.map((r) => r.groupId),
      response.map((r) => r.encryptedConnectionDetails),
      { signer }
    );
    return NextResponse.json({
      data: "OK",
    });
  } catch (e) {
    return NextResponse.json({
      data: "Error",
    });
  }
}
