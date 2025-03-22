
import { MiniKit } from '@worldcoin/minikit-js'
import { Abi } from 'viem'

const ABI: Abi = {} as Abi

const userWalletAddress = MiniKit.user?.walletAddress

export const executeTransaction = (props: {}) => {
    if (!MiniKit.isInstalled()) {
        return;
    }
    const payload = MiniKit.commands.sendTransaction({
        transaction: [
            {
                address: '0x34afd47fbdcc37344d1eb6a2ed53b253d4392a2f',
                abi: ABI,
                functionName: 'signatureTransfer',
                args: [],
            },
        ],
    })

    return payload;
}
