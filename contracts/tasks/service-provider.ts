import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import crypto from "crypto";

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
        await readContractAddressFromIgnition(chainId, "ServiceProvider#ServiceProvider")
      );
      const paymentToken = await hre.ethers.getContractAt(
        "TestToken",
        await readContractAddressFromIgnition(chainId, "TestToken#TestToken")
      );

      // create keypair
      const userAddress = (await hre.ethers.provider.getSigner()).address;
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "der" },
        privateKeyEncoding: { type: "pkcs8", format: "der" },
      });

      // approve tokens
      console.log("approving tokens...")
      const approve = await paymentToken.approve(await serviceProvider.getAddress(), hre.ethers.MaxUint256);
      await approve.wait()

      // create requests
      console.log("creating request...")
      const tx = await serviceProvider.requestService(
        taskArguments.countryId,
        publicKey.toString("hex")
      );
      await tx.wait();

      //  wait for provider to fulfill request
      console.log("waiting for request fulfill...")
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
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          passphrase: "",
        },
        Buffer.from(encryptedConnectionDetails, "hex")
      );

      console.log("Your connection details:", decrypted.toString("utf8"));
    }
  );

task("fulfill", "List all service providers").setAction(
  async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
    const { chainId } = await hre.ethers.provider.getNetwork();
    const serviceProviderAddress = await readContractAddressFromIgnition(
      chainId,
      "ServiceProvider"
    );
    const serviceProvider = await hre.ethers.getContractAt(
      "ServiceProvider",
      serviceProviderAddress
    );

    // listen for new orders and fulfill them right away
    serviceProvider.once(
      serviceProvider.filters.ServiceRequest(),
      async (user, serviceId, encryptionKey, timestamp, event) => {
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
          return;
        }

        const groupId = generateGroupId(key.ip);
        const encryptedConnectionDetails = await crypto.publicEncrypt(
          {
            key: encryptionKey,
            passphrase: "",
          },
          Buffer.from(key.key)
        );

        // Call the fulfillOrder function
        const tx = await serviceProvider.fulfillOrder(
          user,
          groupId,
          encryptedConnectionDetails
        );

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log(`Transaction successful with hash: ${receipt?.hash}`);
      }
    );
  }
);

task("report", "Report a corrupted group")
  .setAction(async (_, hre) => {});

task("recommend", "Recommend a user").setAction(async (_, hre) => {});

task("withdraw", "Withdraw funds from the contract").setAction(async (_, hre) => {});

task("balance", "Get the balance of the contract").setAction(async (_, hre) => {});

async function readContractAddressFromIgnition(chainId: bigint, id: string) {
  const deployed_addresses = require(`../ignition/deployments/chain-${chainId}/deployed_addresses.json`);
  return deployed_addresses[id];
}

function generateGroupId(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}
