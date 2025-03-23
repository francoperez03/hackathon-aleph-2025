import { RPC_PROVIDER, SERVICE_PROVIDER_ABI, SERVICE_PROVIDER_ADDRESS } from "@/constants/service-provider";
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

  constructor(provider: JsonRpcProvider = new JsonRpcProvider(RPC_PROVIDER)) {
    this.contract = new Contract(SERVICE_PROVIDER_ADDRESS, SERVICE_PROVIDER_ABI, provider);
  }

  async getServiceRequestForUser(user: string): Promise<ServiceRequest> {
    try {
      const rawRequest = await this.contract.getServiceRequestForUser(user);
      const [
        id,
        _user,
        requestServiceId,
        encryptionKey,
        encryptedConnectionDetails,
        timestamp,
        fulfilled,
        expiresAt,
      ] = rawRequest;

      const serviceRequest: ServiceRequest = {
        id,
        user,
        serviceId: requestServiceId,
        encryptionKey,
        encryptedConnectionDetails,
        timestamp,
        fulfilled,
        expiresAt,
      };
      return serviceRequest;
    } catch (err) {
      console.error("Error fetching VPN status:", err);
      throw err;
    }
  }

  async getRecommendationsCount(userAddress: string): Promise<bigint> {
    const recommendationCount = await this.contract.recommendationsCount(
      userAddress
    );
    return recommendationCount;
  }
}

export const vpnService = new VpnService();
