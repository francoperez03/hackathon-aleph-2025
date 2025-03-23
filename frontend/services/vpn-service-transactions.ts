"use client";

import NodeRSA from "encrypt-rsa";
import { MiniKit } from "@worldcoin/minikit-js";
import { vpnService } from "./vpn-service";
import {
  SERVICE_PROVIDER_ABI,
  SERVICE_PROVIDER_ADDRESS,
} from "@/constants/service-provider";

const nodeRSA = new NodeRSA();

export const recommend = async (props: {
  addressToRecommend: `0x${string}`;
}) => {
  if (!MiniKit.isInstalled()) {
    return;
  }

  const payload = await MiniKit.commandsAsync.sendTransaction({
    transaction: [
      {
        address: SERVICE_PROVIDER_ADDRESS,
        abi: SERVICE_PROVIDER_ABI,
        functionName: "recommend",
        args: [props.addressToRecommend, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0]],
      },
    ],
  });

  return payload;
};

export const requestService = async function (props: { countryId: number }) {
  if (!MiniKit.isInstalled()) {
    return;
  }

  const { publicKey, privateKey } = nodeRSA.createPrivateAndPublicKeys();

  const base64PublicKey = Buffer.from(publicKey).toString("base64");
  await MiniKit.commandsAsync.sendTransaction({
    transaction: [
      {
        address: SERVICE_PROVIDER_ADDRESS,
        abi: SERVICE_PROVIDER_ABI,
        functionName: "requestService",
        args: [props.countryId, base64PublicKey],
      },
    ],
  });

  while (true) {
    const serviceRequest = await vpnService.getServiceRequestForUser(
      SERVICE_PROVIDER_ADDRESS
    );

    if (
      serviceRequest.fulfilled &&
      serviceRequest.expiresAt > Date.now() / 1000
    ) {
      const decrypted = nodeRSA.decryptStringWithRsaPrivateKey({
        text: serviceRequest.encryptedConnectionDetails,
        privateKey,
      });
      console.log("Your connection details:", decrypted);

      return decrypted;
    }

    console.log("waiting for request fulfill...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
