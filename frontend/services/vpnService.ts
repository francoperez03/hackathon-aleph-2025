import { CONTRACT_ABI, CONTRACT_ADDRESS, RPC_PROVIDER, VpnStatus } from "@/types";
import { Contract, JsonRpcProvider } from "ethers";

export class VpnService {
  private contract: Contract;

  constructor(
    provider: JsonRpcProvider = new JsonRpcProvider(RPC_PROVIDER)
  ) {
    this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }

  async getVpnStatus(userAddress: string, serviceId: bigint): Promise<VpnStatus> {
    const status: bigint = await this.contract.getStatus(userAddress, serviceId);
    console.log({userAddress, serviceId})
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
  }

  async getRemainingDays(userAddress: string): Promise<number> {
    const days: bigint = await this.contract.getRemainingDays(userAddress);
    return Number(days);
  }
}
