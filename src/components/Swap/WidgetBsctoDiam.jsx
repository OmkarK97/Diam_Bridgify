import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { diam } from '../../assets';
import { useNavigate } from 'react-router-dom';
import { BackgroundGradient } from '../ui/background-gradient';
import { Asset, Keypair } from 'diamante-sdk-js';
import erc20Abi from '../../abi/erc20.json';
import bridgeAbi from '../../abi/bridge.json';
import { useWallet } from '../../WalletContext';
import { toast, ToastContainer } from 'react-toastify';
import { changeTrust, transferAssets } from '../../utils/utils';


//brdgetoDiam

// -create 3 assest
// -approve(bridgeAddress, parseEth(amount))
// -funtion brdgetoDiam call
// -changeTrust(userpair, asset, limit)
// -transferAssets(senderKepair, reciverPublicKey, asset, amount)

const protocolPair = Keypair.fromSecret('SBW4LVK5V7IQEBAHASVIIO6C7B5B7L3WKDDFTRANMGWAX3Q2J26UVSGR');

const eth = new Asset(
    "ETH",
    protocolPair.publicKey()
);

const usdc = new Asset(
    "USDC",
    protocolPair.publicKey()
);

const usdt = new Asset(
    "USDT",
    protocolPair.publicKey()
);

const WidgetBsctoDiam = () => {
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const {data: approveData, writeContract: writeContractApprove, isPending } = useWriteContract();
    const { writeContract: writeContractFuntion } = useWriteContract();
    const [amount, setAmount] = useState('');
    const [parseValue, setParseValue] = useState('');
    const { data } = useWallet();

    const userPair = Keypair.fromSecret(data?.secret_key);

    const Balance = useBalance({
        address: address
    })

    console.log(isPending, approveData)

    const parseAmount = parseEther(amount);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            writeContractApprove({
                abi: erc20Abi,
                address: '0x729b949D3ffA75036FFB1cEd8Ea85b085D684F8a',
                functionName: 'approve',
                args: [address, parseAmount]
            })

            writeContractFuntion({
                abi: bridgeAbi,
                address: '0xC5C0D675aF278064D3212FC308139C9e7F8576F5',
                functionName: 'bridgeToDiam',
                args: ['0x729b949D3ffA75036FFB1cEd8Ea85b085D684F8a', parseAmount, data?.public_key]
            })

            await changeTrust(userPair, usdc, '1000000000');
            await transferAssets(protocolPair, userPair.publicKey(), usdc, amount)
            toast.success(`Bridge was successfully!`, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });

        } catch (error) {
            console.error(error);
        }
    }



    return (
        <div className="text-white font-mono h-full w-full flex justify-center items-center relative">
            <ToastContainer />
            <div className="max-w-lg mx-auto ">
                <BackgroundGradient className="rounded-[22px] w-full p-10 bg-white dark:bg-zinc-900">
                    <div className="flex justify-between text-sm mb-4">
                        <button className="bg-transparent py-1 px-3 rounded hover:bg-zinc-800" onClick={() => {
                            navigate('/diam_BSC')
                        }}>DEPOSIT</button>
                        <button className="bg-zinc-800 py-1 px-3 rounded ">WITHDRAW</button>
                        <button className="bg-transparent py-1 px-3 rounded hover:bg-zinc-800">HISTORY</button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-zinc-400 mb-1">FROM</label>
                        <div className="flex items-center justify-between bg-zinc-800 p-2 rounded">
                            <span className="flex items-center">
                                <img src="https://testnet.bscscan.com/assets/bsc/images/svg/logos/chain-light.svg?v=24.7.2.0" width='30px' alt="Ethereum" className="mr-2" />
                                BSC Chain
                            </span>
                        </div>

                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between bg-zinc-800 p-2 rounded">
                            <input type="text" placeholder="0.0" className="bg-transparent text-lg w-full h-full p-2" onChange={(e) => { setAmount(e.target.value) }} />
                            <span className="flex items-center pr-2">
                                <img src="https://blast.io/icons/eth-color.svg" width='20px' alt="ETH" className="mx-2" />
                                ETH
                            </span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                            <span>
                                Balance: 0.00
                            </span>
                            <button className="text-yellow-300 pl-2 cursor-pointer">MAX</button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-zinc-400 mb-1">TO</label>
                        <div className="flex items-center justify-between bg-zinc-800 p-2 rounded">
                            <span className="flex items-center">
                                <img src={diam} width='30px' alt="Botanix" className="mr-2" />
                                Diamante
                            </span>
                        </div>
                    </div>
                    {isConnected ? (
                        <button className="w-full bg-yellow-300 text-black my-3 py-2 rounded" onClick={handleSubmit}>SUBMIT</button>
                    ) : (
                        <div className='flex justify-center items-center'>
                            <ConnectButton />
                        </div>
                    )}
                </BackgroundGradient>
            </div>
        </div>
    )
}

export default WidgetBsctoDiam