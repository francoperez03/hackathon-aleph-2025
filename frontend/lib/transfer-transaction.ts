
import { MiniKit } from '@worldcoin/minikit-js'
import { Abi, formatGwei } from 'viem'

const ABI: Abi = {} as Abi

//Might be better to use Minikit.commands.pay

export const transfer = async (props: { to: `0x${string}`, amount: bigint }) => {
    if (!MiniKit.isInstalled()) {
        return;
    }

    const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString()

    const permitTransfer = {
        permitted: {
            token: "0x",
            // amount: formatGwei(props.amount),
            amount: "10000",
        },
        nonce: Date.now().toString(),
        deadline,
    }

    const permitTransferArgsForm = [
        [permitTransfer.permitted.token, permitTransfer.permitted.amount],
        permitTransfer.nonce,
        permitTransfer.deadline,
    ]

    const transferDetails = {
        to: '0x', // transfer receiver
        requestedAmount: formatGwei(props.amount),
    }

    const transferDetailsArgsForm = [transferDetails.to, transferDetails.requestedAmount]

    const payload = MiniKit.commands.sendTransaction({
        transaction: [
            {
                address: '0x34afd47fbdcc37344d1eb6a2ed53b253d4392a2f',
                abi: ABI,
                functionName: 'signatureTransfer',
                args: [permitTransferArgsForm, transferDetailsArgsForm, 'PERMIT2_SIGNATURE_PLACEHOLDER_0'],
            },
        ],
        permit2: [
            {
                ...permitTransfer,
                spender: '0x34afd47fbdcc37344d1eb6a2ed53b253d4392a2f',
            },
        ],
    })

    return payload;
}
