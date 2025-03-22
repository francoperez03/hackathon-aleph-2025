import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import crypto from "crypto";
import NodeRSA from "encrypt-rsa";

const nodeRSA = new NodeRSA();

const poolOfKeys = [
  {
    ip: "IP_ADDRESS",
    key: "1234567890",
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

      //  wait for provider to fulfill request
      console.log("waiting for request fulfill...");
      const eventPromise: Promise<{
        user: string;
        expiresAt: bigint;
        encryptedConnectionDetails: string;
      }> = new Promise((resolve, reject) => {
        serviceProvider.once(
          serviceProvider.filters.ServiceFulfilled(userAddress),
          (user, encryptedConnectionDetails, expiresAt) => {
            if (expiresAt > Date.now() / 1000) {
              resolve({ user, encryptedConnectionDetails, expiresAt });
            }
          }
        );

        setTimeout(() => reject(new Error("Event timeout")), 60000);
      });
      const { encryptedConnectionDetails } = await eventPromise;

      // decrypt with private key
      const decrypted = nodeRSA.decryptStringWithRsaPrivateKey({
        text: encryptedConnectionDetails,
        privateKey,
      });
      console.log("Your connection details:", decrypted);
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
      // listen for new orders and fulfill them right away
      const filter = serviceProvider.filters.ServiceRequest();
      console.log("OK");
      const events = await serviceProvider.queryFilter(filter, 3537400);
      for (const event of events) {
        const [user, serviceId, encryptionKey, timestamp] = event.args;
        console.log("Service Request Received:", {
          user,
          serviceId,
          encryptionKey,
          timestamp,
        });

        const key = poolOfKeys.find(
          (key) => key.countryId === serviceId.toString()
        );
        if (!key) {
          console.error("No matching key found for country ID:", serviceId);
          continue;
        }

        const groupId = generateGroupId(key.ip);
        console.log("groupId", groupId);
        const encryptedConnectionDetails =
          await nodeRSA.encryptStringWithRsaPublicKey({
            text: key.key,
            publicKey: Buffer.from(encryptionKey, "base64").toString(),
          });
        console.log(
          "encryptedDetails",
          encryptedConnectionDetails,
          "0x" + groupId
        );

        // Call the fulfillOrder function
        // const tx = await serviceProvider.fulfillOrder(
        //   user,
        //   groupId,
        //   encryptedConnectionDetails
        // );
        // const receipt = await tx.wait();

        // Wait for the transaction to be mined
        // console.log(`Transaction successful with hash: ${receipt?.hash}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
);

task("report", "Report a corrupted group").setAction(async (_, hre) => {});

task("recommend", "Recommend a user").setAction(async (_, hre) => {});

task("withdraw", "Withdraw funds from the contract").setAction(
  async (_, hre) => {}
);

task("balance", "Get the balance of the contract").setAction(
  async (_, hre) => {}
);

async function readContractAddressFromIgnition(chainId: bigint, id: string) {
  const deployed_addresses = require(`../ignition/deployments/chain-${chainId}/deployed_addresses.json`);
  return deployed_addresses[id];
}

function generateGroupId(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}
