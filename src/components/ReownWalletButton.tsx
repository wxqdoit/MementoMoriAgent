'use client';

import React, { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useSendTransaction, useBalance } from 'wagmi';
import { parseEther } from 'viem';
import { Wallet, Coins } from 'lucide-react';

interface ReownWalletButtonProps {
  onTipFIL: (amount: number, txHash?: string) => void;
}

export const ReownWalletButton: React.FC<ReownWalletButtonProps> = ({ onTipFIL }) => {
  const [mounted, setMounted] = useState(false);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [isSendingTip, setIsSendingTip] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
        Connect Wallet
      </button>
    );
  }

  const handleOpenReown = () => {
    open();
  };

  const handleRealOnchainTip = async () => {
    if (!isConnected || !address) {
      open();
      return;
    }

    try {
      setIsSendingTip(true);
      const hash = await sendTransactionAsync({
        to: address as `0x${string}`,
        value: parseEther('0.05'),
      });

      if (hash) {
        onTipFIL(0.05, hash);
      }
    } catch (err: any) {
      console.warn('Onchain tip cancelled or failed:', err);
    } finally {
      setIsSendingTip(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 font-mono">
      <button
        onClick={handleOpenReown}
        className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all shadow-sm whitespace-nowrap shrink-0 ${
          isConnected
            ? 'bg-slate-900 hover:bg-slate-800 border-cyan-500/40 text-cyan-300'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-transparent shadow-[0_0_12px_rgba(6,182,212,0.25)]'
        }`}
        title="Reown AppKit Multi-Wallet Modal"
      >
        <Wallet className="w-3.5 h-3.5" />
        <span>
          {isConnected && address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : 'Connect Wallet'}
        </span>
      </button>

      {isConnected && (
        <button
          onClick={handleRealOnchainTip}
          disabled={isSendingTip}
          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-600/50 text-xs flex items-center gap-1 transition-all whitespace-nowrap shrink-0"
          title="Send real 0.05 tFIL via Reown Wallet"
        >
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="hidden md:inline">{isSendingTip ? 'Broadcasting...' : 'Tip 0.05 tFIL'}</span>
        </button>
      )}
    </div>
  );
};
