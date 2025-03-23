"use client";

import { useState, useEffect, useCallback } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { ServiceRequest, vpnService } from "@/services/vpn-service";
import { useRouter } from "next/navigation";
import {
  SERVICE_PROVIDER_ABI,
  SERVICE_PROVIDER_ADDRESS,
} from "@/constants/service-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import sodium from "libsodium-wrappers";

export default function Connection() {
  const router = useRouter();
  const [recommendationsCount, setRecommendationsCount] = useState(0);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [decrypted, setDecrypted] = useState("");

  const onBuy = useCallback(async () => {
    const user = MiniKit.user?.walletAddress;
    console.log({ user });

    if (!user) {
      return;
    }

    setLoading(true);

    try {
      await sodium.ready;
      const keypair = await sodium.crypto_box_keypair();
      const privateKey =sodium.to_base64(keypair.privateKey)
      const publicKey = sodium.to_base64(keypair.publicKey)
      console.log({
        publicKey,
        privateKey,
      });
      localStorage.setItem("publicKey", publicKey);
      localStorage.setItem("privateKey", privateKey);

      const res = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: SERVICE_PROVIDER_ADDRESS,
            abi: SERVICE_PROVIDER_ABI,
            functionName: "requestService",
            args: [1, sodium.to_base64(keypair.publicKey)],
          },
        ],
      });
      console.log({ res });

      while (true) {
        const serviceRequest = await vpnService.getServiceRequestForUser(user);

        if (
          serviceRequest.fulfilled &&
          serviceRequest.expiresAt > Date.now() / 1000
        ) {
          setServiceRequest(serviceRequest);
        }

        console.log("waiting for request fulfill...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (e) {
      console.error(e);
      window.alert("Error: " + e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchVpnStatus = async () => {
      const user = MiniKit.user;
      console.log({ user });

      let address = MiniKit.user?.walletAddress;
      if (!address) {
        return;
      }

      try {
        const service = await vpnService.getServiceRequestForUser(address);
        const count = await vpnService.getRecommendationsCount(address);

        setRecommendationsCount(Number(count));
        setServiceRequest(service);
      } catch (err) {
        console.error("Error fetching VPN status:", err);
      }
    };

    setLoading(true);
    fetchVpnStatus().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    sodium.ready.then(() => {
      console.log({
        a: sodium.from_base64(localStorage.getItem("publicKey") || ""),
        b: sodium.from_base64(localStorage.getItem("privateKey") || "")
      })

      if (!serviceRequest) {
        return;
      }

      const decrypted = sodium.crypto_box_seal_open(
        serviceRequest.encryptedConnectionDetails,
        sodium.from_base64(localStorage.getItem("publicKey") || ""),
        sodium.from_base64(localStorage.getItem("privateKey") || "")
      );
      setDecrypted(sodium.to_string(decrypted));
    })

  }, [serviceRequest]);

  if (loading) {
    return (
      <div className="text-center px-4 py-10 flex flex-col h-screen">
        <div className="flex-1">
          <h1 className="text-lg font-medium">Loading...</h1>
        </div>
      </div>
    );
  }

  if (recommendationsCount < 1) {
    return (
      <div className="text-center px-4 py-10 flex flex-col h-screen">
        <div className="flex-1">
          <h1 className="text-lg font-medium">
            {"You don't have enough recommendations"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
            You need at least one recomendation to access the VPN access details
          </p>
        </div>

        <div className="flex flex-col">
          <Button className="mt-4" onClick={() => router.push("/recommend")}>
            Get recommended
          </Button>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (
    serviceRequest?.fulfilled &&
    serviceRequest.expiresAt > Date.now() / 1000
  ) {
    // const decrypted = nodeRSA.decryptStringWithRsaPrivateKey({
    //   text: serviceRequest.encryptedConnectionDetails,
    //   privateKey: localStorage.getItem("privateKey") as string,
    // });

    return (
      <div className="text-center px-4 py-10 flex flex-col h-screen">
        <div className="flex-1">
          <h1 className="text-lg font-medium">Access VPN</h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
            Your VPN is ready to be used. Copy the key in the outline app or
            follow the connect link.
          </p>

          <div className="mt-6 border rounded-md bg-muted text-muted-foreground p-4">
            {decrypted}
          </div>
        </div>

        <div className="flex flex-col">
          <a
            href={decrypted}
            className={cn(buttonVariants({}), "mt-4")}
            onClick={() => router.push("/recommended")}
          >
            Connect
          </a>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (serviceRequest?.fulfilled === false && serviceRequest?.expiresAt === 0n) {
    <div className="text-center px-4 py-10 flex flex-col h-screen">
      <div className="flex-1">
        <h1 className="text-lg font-medium">Pending order</h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
          You have a pending order. Please wait a few seconds.
        </p>
      </div>

      <div className="flex flex-col">
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/")}
        >
          Back
        </Button>
      </div>
    </div>;
  }

  return (
    <div className="text-center px-4 py-10 flex flex-col h-screen">
      <div className="flex-1">
        <h1 className="text-lg font-medium">Buy VPN</h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
          You have enough recommendations but no active access. Buy VPN access
          for 3 USD.
        </p>
      </div>

      <div className="flex flex-col">
        <Button
          className={cn(buttonVariants({}), "mt-4")}
          onClick={() => onBuy()}
        >
          Connect
        </Button>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/")}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
