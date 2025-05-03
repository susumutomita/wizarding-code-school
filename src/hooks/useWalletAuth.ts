import { useState, useEffect, useCallback } from 'react';

// Define the interface for wallet auth
interface WalletAuth {
  request: () => Promise<{ address: string }>;
}

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    world?: {
      walletAuth: WalletAuth;
    };
  }
}

const mockWalletAuth: WalletAuth = {
  request: async (): Promise<{ address: string }> => {
    return { address: '0x1234567890abcdef1234567890abcdef12345678' };
  },
};

// Safely access window.world.walletAuth with type safety
const walletAuth: WalletAuth =
  typeof window !== 'undefined' && window.world?.walletAuth
    ? window.world.walletAuth
    : mockWalletAuth;

/**
 * Hook for handling wallet authentication
 * Returns the wallet address and a function to request authentication
 */
export const useWalletAuth = (): {
  address: string | null;
  error: Error | null;
  requestAuth: () => Promise<{ address: string }>;
} => {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const requestAuth = useCallback(async (): Promise<{ address: string }> => {
    try {
      const result = await walletAuth.request();
      setAddress(result.address);
      setError(null);
      return result;
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const result = await walletAuth.request();
        if (result.address) {
          setAddress(result.address);
        }
      } catch {
        // Initial auth check failed, user can authenticate later
      }
    };

    checkAuth();
  }, []);

  return {
    address,
    error,
    requestAuth,
  };
};
