import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  address: string | null;
  isAuthenticated: boolean;
  isVerified: boolean; // For World ID verification
  loading: boolean;
  error: string | null;
}

/**
 * Hook for Ethereum wallet-based authentication (SIWE)
 * Compatible with World App's wallet integration
 *
 * @returns Object with auth state and methods for wallet connection/disconnection
 */
export const useWalletAuth = (): {
  address: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  loading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  verifyWithWorldId: () => Promise<void>;
  isInWorldApp: () => boolean;
} => {
  const [auth, setAuth] = useState<AuthState>({
    address: null,
    isAuthenticated: false,
    isVerified: false,
    loading: true,
    error: null,
  });

  // Check if we have a wallet address stored
  useEffect(() => {
    const savedAddress = localStorage.getItem('wizarding-wallet-address');
    if (savedAddress) {
      setAuth({
        address: savedAddress,
        isAuthenticated: true,
        isVerified: !!localStorage.getItem('wizarding-world-id-verified'),
        loading: false,
        error: null,
      });
    } else {
      setAuth(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Check if the app is running inside World App
  const isInWorldApp = useCallback((): boolean => {
    return (
      typeof window !== 'undefined' &&
      // Look for World App specific environment variables or injected provider
      (window.ethereum?.isWorldApp || false)
    );
  }, []);

  // Connect wallet
  const connect = useCallback(async (): Promise<void> => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));

      // Check if ethereum provider is available
      if (!window.ethereum) {
        throw new Error(
          'No Ethereum wallet detected. Please install a wallet or open in World App.'
        );
      }

      // Request accounts
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];
      const address = accounts[0];

      if (!address) {
        throw new Error('No accounts found or user rejected the request.');
      }

      // For SIWE (Sign-In with Ethereum), we would generate a message for the user to sign
      // This is a simplified example - in production you'd use a dedicated SIWE library
      const message = `Sign in to Wizarding Code School\n\nThis signature proves you own this wallet address.\n\nNo gas fees or blockchain transactions will occur.\n\nTimestamp: ${Date.now()}`;

      // Request signature (SIWE)
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      if (!signature) {
        throw new Error('Signature request was cancelled.');
      }

      // In a real app, you might verify the signature on a server
      // For this MVP, we'll just store the successful authentication
      localStorage.setItem('wizarding-wallet-address', address);

      setAuth({
        address,
        isAuthenticated: true,
        isVerified: false,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuth({
        address: null,
        isAuthenticated: false,
        isVerified: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet.',
      });
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback((): void => {
    localStorage.removeItem('wizarding-wallet-address');
    localStorage.removeItem('wizarding-world-id-verified');
    setAuth({
      address: null,
      isAuthenticated: false,
      isVerified: false,
      loading: false,
      error: null,
    });
  }, []);

  // Verify identity with World ID (stub for now)
  const verifyWithWorldId = useCallback(async (): Promise<void> => {
    try {
      setAuth(prev => ({ ...prev, loading: true, error: null }));

      // In a real implementation, this would interact with World ID SDK
      // For MVP, we'll simulate a successful verification

      // Mock a verification process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, we would receive and validate a proof from World ID
      localStorage.setItem('wizarding-world-id-verified', 'true');

      setAuth(prev => ({
        ...prev,
        isVerified: true,
        loading: false,
      }));
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to verify with World ID.',
      }));
    }
  }, []);

  return {
    ...auth,
    connect,
    disconnect,
    verifyWithWorldId,
    isInWorldApp,
  };
};
