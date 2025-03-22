import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import NodeRSA from "encrypt-rsa";
import { generateGroupId } from "../lib/utils";
import { assert } from "console";

const nodeRSA = new NodeRSA();

describe("ServiceProvider", function () {
  async function deploymentFixture() {
    const [provider, customer, other] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("TestToken");
    const token = await Token.connect(customer).deploy(
      10000000000000000000000n
    );
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
      60 * 60 * 24 * 7, // 7 days in seconds
      1n
    );
    const serviceProviderAddress = await serviceProvider.getAddress();

    await token
      .connect(customer)
      .approve(serviceProviderAddress, hre.ethers.MaxUint256);

    return {
      provider,
      customer,
      other,
      token,
      serviceProvider,
    };
  }

  it("connect e2e", async () => {
    const { serviceProvider, other, customer } = await loadFixture(
      deploymentFixture
    );

    // recommend customer
    await serviceProvider
      .connect(other)
      .recommend(customer.address, 0n, 0n, [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]);

    // customer creates encryption keys and requests service
    const { publicKey, privateKey } = nodeRSA.createPrivateAndPublicKeys();
    await serviceProvider
      .connect(customer)
      .requestService(1, Buffer.from(publicKey).toString("base64"));

    // provider get pending orders
    const requests = await serviceProvider.getUnfulfilledRequests();

    const response = await Promise.all(
      requests.map(async (r) => {
        const key =
          "ss://Y2hhaWV0Zi1wb2x5MTMwNTpZeGpsS0Z3dGltMWJhOXRvczByeDBO@3.91.104.137:35942/?outline=1";

        return {
          id: r.id,
          groupId: generateGroupId(key),
          encryptedConnectionDetails:
            await nodeRSA.encryptStringWithRsaPublicKey({
              text: key,
              publicKey: Buffer.from(r.encryptionKey, "base64").toString(),
            }),
        };
      })
    );

    assert((await serviceProvider.getUnfulfilledRequests()).length === 1);

    await serviceProvider.batchFulfill(
      response.map((r) => r.id),
      response.map((r) => r.groupId),
      response.map((r) => r.encryptedConnectionDetails)
    );

    assert((await serviceProvider.getUnfulfilledRequests()).length === 0);

    // customer get events
    const serviceRequest = await serviceProvider.getServiceRequestForUser(
      customer
    );

    // customer decrypts
    const decrypted = nodeRSA.decryptStringWithRsaPrivateKey({
      text: serviceRequest.encryptedConnectionDetails,
      privateKey,
    });
    console.log("Your connection details:", decrypted);
  });

  it("recommend e2e", async () => {
    const { serviceProvider, customer, other } = await loadFixture(
      deploymentFixture
    );

    await serviceProvider
      .connect(customer)
      .recommend(other.address, 0n, 0n, [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]);

    assert((await serviceProvider.recommendationsCount(other.address)) == 1n);
  });

  it("report e2e", async () => {
    const { serviceProvider, customer, other, provider } = await loadFixture(
      deploymentFixture
    );

    await serviceProvider
      .connect(other)
      .recommend(customer.address, 0n, 0n, [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]);

    assert((await serviceProvider.recommendationsCount(other.address)) == 1n);

    await serviceProvider
      .connect(customer)
      .requestService(1, Buffer.from("publicKey").toString("base64"));

    const groupId = generateGroupId("abc");
    await serviceProvider.batchFulfill([0n], [groupId], ["abc"]);

    await serviceProvider.connect(provider).reportGroupId(groupId);

    assert((await serviceProvider.recommendationsCount(other.address)) == 0n);
  });
});
