'use client';

import { CALIBRATION_CHAIN_ID, CALIBRATION_CHAIN_ID_HEX, FILFOX_CALIBRATION_URL } from './filecoin';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isCalibration: boolean;
  balanceFIL: number | null;
}

export async function connectWeb3Wallet(): Promise<string | null> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    alert('Please install MetaMask or a compatible Web3 wallet to connect to Filecoin Calibration testnet.');
    return null;
  }

  const ethereum = (window as any).ethereum;

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) return null;

    const address = accounts[0];

    // Ensure user is on Filecoin Calibration Testnet (314159)
    await switchToFilecoinCalibration();

    return address;
  } catch (err: any) {
    console.error('Wallet connection failed:', err);
    return null;
  }
}

export async function switchToFilecoinCalibration(): Promise<boolean> {
  if (typeof window === 'undefined' || !(window as any).ethereum) return false;
  const ethereum = (window as any).ethereum;

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CALIBRATION_CHAIN_ID_HEX }],
    });
    return true;
  } catch (switchError: any) {
    // This error code 4902 indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CALIBRATION_CHAIN_ID_HEX,
              chainName: 'Filecoin - Calibration testnet',
              nativeCurrency: {
                name: 'Test Filecoin',
                symbol: 'tFIL',
                decimals: 18,
              },
              rpcUrls: ['https://api.calibration.node.glif.io/rpc/v1', 'https://filecoin-calibration.chainup.net/rpc/v1'],
              blockExplorerUrls: ['https://calibration.filfox.info/en'],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Filecoin Calibration to wallet:', addError);
        return false;
      }
    }
    return false;
  }
}

export async function sendRealOnchainTip(
  recipientAddress: string,
  amountFIL: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return { success: false, error: 'No Web3 wallet found.' };
  }

  const ethereum = (window as any).ethereum;

  try {
    await switchToFilecoinCalibration();

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const from = accounts[0];
    if (!from) throw new Error('Wallet not unlocked');

    // Convert FIL to Wei Hex
    const weiBigInt = BigInt(Math.floor(amountFIL * 1e18));
    const valueHex = '0x' + weiBigInt.toString(16);

    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: recipientAddress.startsWith('0x') ? recipientAddress : from, // fallback to self if address format is t1/f1
          value: valueHex,
        },
      ],
    });

    return { success: true, txHash };
  } catch (err: any) {
    console.error('Send onchain tip error:', err);
    return { success: false, error: err.message || 'Transaction rejected by user' };
  }
}
