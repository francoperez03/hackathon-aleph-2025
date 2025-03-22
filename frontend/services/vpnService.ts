import { CONTRACT_ABI, CONTRACT_ADDRESS, RPC_PROVIDER, VpnStatus } from "@/types";
import { Contract, JsonRpcProvider } from "ethers";

export class VpnService {
  private contract: Contract;
  private provider: JsonRpcProvider;

  constructor(provider: JsonRpcProvider = new JsonRpcProvider(RPC_PROVIDER)) {
    this.provider = provider;
    this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }

  async getVpnStatus(userAddress: string, serviceId: bigint): Promise<VpnStatus> {
    try {
      console.log({ userAddress, serviceId });
      const filter = this.contract.filters.Verified();
      const events = await this.contract.queryFilter(filter, 0, "latest");

      console.log(`📦 Found ${events.length} Verified events`);
      console.log(events);

      const status: bigint = await this.contract.getStatus(userAddress, serviceId);
      console.log({ status });

      switch (status) {
        case 0n:
          return "active";
        case 1n:
          return "expired";
        case 2n:
          return "missing-recommendations";
        default:
          throw new Error("Unknown VPN status");
      }
    } catch (err) {
      console.error("❌ Error fetching VPN status:", err);
    }

    // Valor fallback
    return "checking";
  }

  async getRemainingDays(userAddress: string): Promise<number> {
    const days: bigint = await this.contract.getRemainingDays(userAddress);
    return Number(days);
  }
}
