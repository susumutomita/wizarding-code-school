/// <reference types="vite/client" />

interface WalletAuth {
  request: () => Promise<{ address: string }>;
}

interface WorldInterface {
  walletAuth: WalletAuth;
}

declare global {
  interface Window {
    world?: WorldInterface;
  }
}
