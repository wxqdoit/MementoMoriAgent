import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { filecoinCalibration, filecoin } from '@reown/appkit/networks';

// Reown Project ID (WalletConnect Cloud Project ID)
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694';

export const networks = [filecoinCalibration, filecoin];

export const metadata = {
  name: 'Memento Mori Agent',
  description: 'Autonomous Filecoin Storage Runway Sentinel',
  url: 'https://memento-mori.agent',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
