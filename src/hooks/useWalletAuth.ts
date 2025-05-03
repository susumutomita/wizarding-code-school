import { useState, useEffect, useCallback } from 'react';


const mockWalletAuth = {
  request: async () => {
    return { address: '0x1234567890abcdef1234567890abcdef12345678' };
  }
};

const walletAuth = typeof window !== 'undefined' && 
  window.world?.walletAuth ? 
  window.world.walletAuth : 
  mockWalletAuth;

/**
 * Hook for handling wallet authentication
 * Returns the wallet address and a function to request authentication
 */
export const useWalletAuth = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const requestAuth = useCallback(async () => {
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
    const checkAuth = async () => {
      try {
        const result = await walletAuth.request();
        if (result.address) {
          setAddress(result.address);
        }
      } catch (e) {
        console.log('Initial auth check failed, user can authenticate later');
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
