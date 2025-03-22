import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import NodeRSA from "encrypt-rsa";
import { generateGroupId } from "../lib/utils";

const nodeRSA = new NodeRSA();

describe("ServiceProvider", function () {
  async function deploymentFixture() {
    const [provider, customer] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("TestToken");
    const token = await Token.connect(customer).deploy(10000000000000000000000n);
    const tokenAddress = await token.getAddress();

    const ServiceProviderFactory = await hre.ethers.getContractFactory(
      "ServiceProvider"
    );
    const serviceProvider = await ServiceProviderFactory.deploy(
      hre.ethers.ZeroAddress,
      "0x000",
      "0x000",
      tokenAddress,
      1000000000000000000n,
      60 * 60 * 24 * 7 // 7 days in seconds
    );
    const serviceProviderAddress = await serviceProvider.getAddress();

    await token
      .connect(customer)
      .approve(serviceProviderAddress, hre.ethers.MaxUint256);

    return {
      provider,
      customer,
      token,
      serviceProvider,
    };
  }

  it("connect e2e", async () => {
    const { serviceProvider, customer } = await loadFixture(deploymentFixture);
    const { publicKey, privateKey } = nodeRSA.createPrivateAndPublicKeys();

    await serviceProvider
      .connect(customer)
      .requestService(1, Buffer.from(publicKey).toString("base64"));

    // provider get events
    const events = await serviceProvider.queryFilter(
      serviceProvider.filters.ServiceRequest()
    );
    const [user, serviceId, encryptionKey, timestamp] = events[0].args;

    // provider encrypts and fulfills
    const key =
      "ss://Y2hhaWV0Zi1wb2x5MTMwNTpZeGpsS0Z3dGltMWJhOXRvczByeDBO@3.91.104.137:35942/?outline=1";
    const encryptedConnectionDetails =
      await nodeRSA.encryptStringWithRsaPublicKey({
        text: key,
        publicKey: Buffer.from(encryptionKey, "base64").toString(),
      });
    const groupId = generateGroupId(key);

    await serviceProvider.fulfillOrder(
      customer,
      "0x" + groupId,
      encryptedConnectionDetails
    );

    // customer get events
    const events2 = await serviceProvider.queryFilter(
      serviceProvider.filters.ServiceFulfilled()
    );
    const [_user, rEncryptedConnectionDetails, _expiration] = events2[0].args;

    // customer decrypts
    const decrypted = nodeRSA.decryptStringWithRsaPrivateKey({
      text: rEncryptedConnectionDetails,
      privateKey,
    });
    console.log("Your connection details:", decrypted);
  });
});
