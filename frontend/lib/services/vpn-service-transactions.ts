"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import {
  SERVICE_PROVIDER_ABI,
  SERVICE_PROVIDER_ADDRESS,
} from "@/constants/service-provider";


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

