/// <reference types="vite/client" />

interface WalletAuth {
  request: () => Promise<{ address: string }>;
}

interface WorldInterface {
  walletAuth: WalletAuth;
}

// Define more specific types for ethereum provider
type EthereumRequestMethod = 'eth_requestAccounts' | 'personal_sign' | string;

interface EthereumRequestArguments {
  method: EthereumRequestMethod;
  params?: unknown[]; // Using unknown instead of any
}

// Extend Window interface to include ethereum provider
interface Window {
  ethereum?: {
    isWorldApp?: boolean;
    request: (args: EthereumRequestArguments) => Promise<unknown>; // Using unknown instead of any
  };
}

declare global {
  interface Window {
    world?: WorldInterface;
  }
}
