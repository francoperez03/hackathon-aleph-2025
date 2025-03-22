import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import NodeRSA from "encrypt-rsa";
import { generateGroupId } from "../lib/utils";

const nodeRSA = new NodeRSA();

const KEYS_POOL = [
  {
    ip: "3.91.104.137",
    key: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpZeGpsS0Z3dGltMWJhOXRvczByeDBO@3.91.104.137:35942/?outline=1",
    countryId: "1",
  },
];

task("approve", "Approve a tokens for the service provider")
  .addParam("amount", "The amount of tokens to approve")
  .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const paymentToken = await hre.ethers.getContractAt(
      "TestToken",
      await CONTRACT_ADDRESSES(hre, "TestToken")
    );

    console.log("approving tokens...");
    const approve = await paymentToken.approve(
      await CONTRACT_ADDRESSES(hre, "ServiceProvider"),
      hre.ethers.MaxUint256
    );
    console.log("approve tx: ", approve.hash);
  });

task("connect", "Connect to the vpn")
  .addParam("countryId", "The country id")
  .setAction(
    async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
      const serviceProvider = await hre.ethers.getContractAt(
        "ServiceProvider",
        await CONTRACT_ADDRESSES(hre, "ServiceProvider")
      );

      // create requests
      console.log("creating request...");
      const customer = (await hre.ethers.provider.getSigner()).address;
      const { publicKey, privateKey } = nodeRSA.createPrivateAndPublicKeys();
      const request = await serviceProvider.requestService(
        1,
        Buffer.from(publicKey).toString("base64")
      );
      await request.wait();
      console.log("request tx: ", request.hash);

      // wait for provider to fulfill request
      console.log("waiting for request fulfill...");
      while (true) {
        const serviceRequest = await serviceProvider.getServiceRequestForUser(
          customer
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

          return;
        }

        console.log("waiting for request fulfill...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  );

task("fulfill", "List all service providers").setAction(
  async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { chainId } = await hre.ethers.provider.getNetwork();
    const serviceProvider = await hre.ethers.getContractAt(
      "ServiceProvider",
      await CONTRACT_ADDRESSES(hre, "ServiceProvider")
    );

    do {
      // provider get pending orders
      const requests = await serviceProvider.getUnfulfilledRequests();
      if (requests.length === 0) {
        console.log("No pending requests...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      console.log("Found pending requests:", requests.length);

      const response = (
        await Promise.allSettled(
          requests.map(async (r) => {
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

      // provider fulfills
      const batch = await serviceProvider.batchFulfill(
        response.map((r) => r.id),
        response.map((r) => r.groupId),
        response.map((r) => r.encryptedConnectionDetails)
      );
      await batch.wait();
      console.log("Batch fulfill tx: ", batch.hash);
    } while (true);
  }
);

task("report", "Report a corrupted group")
  .addParam("ip", "The ip address that has been compromised")
  .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { chainId } = await hre.ethers.provider.getNetwork();
    const serviceProvider = await hre.ethers.getContractAt(
      "ServiceProvider",
      await CONTRACT_ADDRESSES(hre, "ServiceProvider")
    );

    const reportTx = await serviceProvider.reportGroupId(
      generateGroupId(args.ip)
    );
    console.log(`Report tx: ${reportTx.hash}`);
  });

task("recommend", "Recommend a user")
  .addParam("user", "The user to recommend", undefined, types.string)
  .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { chainId } = await hre.ethers.provider.getNetwork();
    const serviceProvider = await hre.ethers.getContractAt(
      "ServiceProvider",
      await readContractAddressFromIgnition(
        chainId,
        "ServiceProvider#ServiceProvider"
      )
    );

    const recommendTx = await serviceProvider.recommend(args.user, 0n, 0n, [
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
    ]);
    console.log(`Recommend tx: ${recommendTx.hash}`);
  });

task("withdraw", "Withdraw funds from the contract")
  .addParam("amount", "The amount of tokens to withdraw")
  .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { chainId } = await hre.ethers.provider.getNetwork();
    const serviceProvider = await hre.ethers.getContractAt(
      "ServiceProvider",
      await CONTRACT_ADDRESSES(hre, "ServiceProvider")
    );

    const withdrawTx = await serviceProvider.withdraw(args.amount);
    console.log(`Withdraw tx: ${withdrawTx.hash}`);
  });

task("balance", "Get the balance of the contract").setAction(async (_, hre) => {
  const { chainId } = await hre.ethers.provider.getNetwork();
  const serviceProvider = await hre.ethers.getContractAt(
    "ServiceProvider",
    await CONTRACT_ADDRESSES(hre, "ServiceProvider")
  );

  const balance = await serviceProvider.balance();
  console.log(`Balance: ${balance}`);
});

async function readContractAddressFromIgnition(chainId: bigint, id: string) {
  const deployed_addresses = require(`../ignition/deployments/chain-${chainId}/deployed_addresses.json`);
  return deployed_addresses[id];
}

async function CONTRACT_ADDRESSES(
  hre: HardhatRuntimeEnvironment,
  contract: "ServiceProvider" | "TestToken"
): Promise<`0x${string}`> {
  const { chainId } = await hre.ethers.provider.getNetwork();
  const deployed_addresses = require(`../ignition/deployments/chain-${chainId}/deployed_addresses.json`);

  return deployed_addresses[`${contract}#${contract}`];
}
