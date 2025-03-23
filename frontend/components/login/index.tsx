"use client";

import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement:
      "This is my statement and here is a link https://worldcoin.com/apps",
  };
};


export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      setLoading(true);


      const { finalPayload } = await MiniKit.commandsAsync.walletAuth(
        walletAuthInput("SomeNonceToOperate")
      );

      if (finalPayload.status === "error") {
        setLoading(false);
        setIsError(true);
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!MiniKit.user ? (
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Connecting..." : "Login"}
        </Button>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="text-green-600 font-medium">✓ Connected</div>
          <div className="flex items-center space-x-2">
            {MiniKit.user?.profilePictureUrl && (
              <img
                src={MiniKit.user.profilePictureUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-medium">
              {MiniKit.user?.username ||
                MiniKit.user?.walletAddress.slice(0, 6) +
                  "..." +
                  MiniKit.user?.walletAddress.slice(-4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
