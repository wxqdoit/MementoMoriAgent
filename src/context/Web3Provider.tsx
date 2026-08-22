'use client';

import React, { ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { filecoinCalibration, filecoin } from '@reown/appkit/networks';
import { projectId, metadata, wagmiAdapter } from '@/config/reown';

const queryClient = new QueryClient();

// Initialize Reown AppKit
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [filecoinCalibration, filecoin],
  defaultNetwork: filecoinCalibration,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord'],
    emailShowWallets: true,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#06b6d4',
    '--w3m-color-mix': '#070a0f',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '12px',
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
