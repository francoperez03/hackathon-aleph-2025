import { CONTRACT_ABI, CONTRACT_ADDRESS, RPC_PROVIDER, VpnStatus } from "@/types";
import { Contract, JsonRpcProvider } from "ethers";
export interface ServiceRequest {
  id: bigint;
  user: string;
  serviceId: bigint;
  encryptionKey: string;
  encryptedConnectionDetails: string;
  timestamp: bigint;
  fulfilled: boolean;
  expiresAt: bigint;
}

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
      alert(`recomendationCount ${recommendationCount}`);
      if (recommendationCount === 0n) {
        return "missing-recommendations";
      } else if (recommendationCount >= 1n) {
        const rawRequest = await this.contract.getServiceRequestForUser(userAddress);
        const [
          id,
          user,
          requestServiceId,
          encryptionKey,
          encryptedConnectionDetails,
          timestamp,
          fulfilled,
          expiresAt
        ] = rawRequest;

        const serviceRequest: ServiceRequest = {
          id,
          user,
          serviceId: requestServiceId,
          encryptionKey,
          encryptedConnectionDetails,
          timestamp,
          fulfilled,
          expiresAt
        };
        const currentTimestampInSeconds = BigInt(Math.floor(Date.now() / 1000));
        if (currentTimestampInSeconds > serviceRequest.expiresAt) {
          return "active";
        }
        return "expired";
      }
    } catch (err) {
      console.error("Error fetching VPN status:", err);
    }
    return "checking";
  }

  async getRemainingDays(userAddress: string): Promise<number> {
    const days: bigint = await this.contract.getRemainingDays(userAddress);
    return Number(days);
  }
}
