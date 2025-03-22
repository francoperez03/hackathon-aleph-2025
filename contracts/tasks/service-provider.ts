import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import crypto from "crypto";
import NodeRSA from "encrypt-rsa";
import { generateGroupId } from "../lib/utils";

const nodeRSA = new NodeRSA();

const poolOfKeys = [
  {
    ip: "3.91.104.137",
    key: "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpZeGpsS0Z3dGltMWJhOXRvczByeDBO@3.91.104.137:35942/?outline=1",
    countryId: "1",
  },
];

task("connect", "Connect to the vpn")
  .addParam("countryId", "The country id")
  .setAction(
    async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
      const { chainId } = await hre.ethers.provider.getNetwork();
      const serviceProvider = await hre.ethers.getContractAt(
        "ServiceProvider",
        await readContractAddressFromIgnition(
          chainId,
          "ServiceProvider#ServiceProvider"
        )
      );
      const paymentToken = await hre.ethers.getContractAt(
        "TestToken",
        await readContractAddressFromIgnition(chainId, "TestToken#TestToken")
      );

      // create keypair
      const userAddress = (await hre.ethers.provider.getSigner()).address;
      const { publicKey, privateKey } = nodeRSA.createPrivateAndPublicKeys();

      // approve tokens
      console.log("approving tokens...");
      const approve = await paymentToken.approve(
        await serviceProvider.getAddress(),
        hre.ethers.MaxUint256
      );
      console.log("approve tx: ", approve.hash);

      // create requests
      console.log("creating request...");
      const request = await serviceProvider.requestService(
        taskArguments.countryId,
        Buffer.from(publicKey).toString("base64")
      );
      console.log("request tx: ", request.hash);

      // wait for provider to fulfill request
      console.log("waiting for request fulfill...");
      while (true) {
        const events = await serviceProvider.queryFilter(
          serviceProvider.filters.ServiceFulfilled()
        );

        for (const event of events) {
          const [user, encryptedConnectionDetails, _expiration] = event.args;
          if (user !== userAddress) {
            continue;
          }

          // decrypt connection details
          const decrypted = nodeRSA.decryptStringWithRsaPrivateKey({
            text: encryptedConnectionDetails,
            privateKey,
          });
          console.log("Your connection details:", decrypted);

          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  );

task("fulfill", "List all service providers").setAction(
  async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { chainId } = await hre.ethers.provider.getNetwork();
    const serviceProvider = await hre.ethers.getContractAt(
      "ServiceProvider",
      await readContractAddressFromIgnition(
        chainId,
        "ServiceProvider#ServiceProvider"
      )
    );

    while (true) {
      const events = await serviceProvider.queryFilter(
        serviceProvider.filters.ServiceRequest()
      );

      for (const event of events) {
        const [user, serviceId, encryptionKey, timestamp] = event.args;
        console.log("Service request: ", event.args);

        const key = poolOfKeys.find(
          (k) => k.countryId === serviceId.toString()
        );
        if (!key) {
          console.log("No key found for service id: ", serviceId);
          continue;
        }

        const encryptedConnectionDetails =
          await nodeRSA.encryptStringWithRsaPublicKey({
            text: key.key,
            publicKey: Buffer.from(encryptionKey, "base64").toString(),
          });

        await serviceProvider.fulfillOrder(
          user,
          generateGroupId(key.ip),
          encryptedConnectionDetails
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
);

task("report", "Report a corrupted group")
  .addParam("ip", "The ip address that has been compromised")
  .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { chainId } = await hre.ethers.provider.getNetwork();
    const serviceProvider = await hre.ethers.getContractAt(
      "ServiceProvider",
      await readContractAddressFromIgnition(
        chainId,
        "ServiceProvider#ServiceProvider"
      )
    );

    const reportTx = await serviceProvider.reportGroupId(
      generateGroupId(args.ip)
    );
    console.log(`Report tx: ${reportTx.hash}`);
  });

task("recommend", "Recommend a user").setAction(async (_, hre) => {});

task("withdraw", "Withdraw funds from the contract")
  .addParam("amount", "The amount of tokens to withdraw")
  .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { chainId } = await hre.ethers.provider.getNetwork();
    const serviceProvider = await hre.ethers.getContractAt(
      "ServiceProvider",
      await readContractAddressFromIgnition(
        chainId,
        "ServiceProvider#ServiceProvider"
      )
    );

    const withdrawTx = await serviceProvider.withdraw(args.amount);
    console.log(`Withdraw tx: ${withdrawTx.hash}`);
  });

task("balance", "Get the balance of the contract").setAction(async (_, hre) => {
  const { chainId } = await hre.ethers.provider.getNetwork();
  const serviceProvider = await hre.ethers.getContractAt(
    "ServiceProvider",
    await readContractAddressFromIgnition(
      chainId,
      "ServiceProvider#ServiceProvider"
    )
  );

  const balance = await serviceProvider.balance();
  console.log(`Balance: ${balance}`);
});

async function readContractAddressFromIgnition(chainId: bigint, id: string) {
  const deployed_addresses = require(`../ignition/deployments/chain-${chainId}/deployed_addresses.json`);
  return deployed_addresses[id];
}
