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
      const recommendationCount = await this.contract.recommendationsCount(userAddress);
      if(recommendationCount === 0n) {
        return "missing-recommendations";
      } else if(recommendationCount >= 1n) {
        const serviceRequest = await this.contract.getServiceRequestForUser(userAddress);
        console.log({serviceRequest})
        return "active";
      }
    } catch (err) {
      console.error("❌ Error fetching VPN status:", err);
    }

    return "checking";
  }

  async getRemainingDays(userAddress: string): Promise<number> {
    const days: bigint = await this.contract.getRemainingDays(userAddress);
    return Number(days);
  }
}
