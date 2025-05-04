import React from 'react';
import { useWalletAuth } from '../hooks/useWalletAuth';

interface AuthenticationProps {
  onLogin?: (address: string) => void;
  onLogout?: () => void;
}

export const Authentication: React.FC<AuthenticationProps> = ({ onLogin, onLogout }) => {
  const {
    address,
    isAuthenticated,
    isVerified,
    loading,
    error,
    connect,
    disconnect,
    verifyWithWorldId,
    isInWorldApp,
  } = useWalletAuth();

  const handleConnect = async (): Promise<void> => {
    await connect();
    if (onLogin && address) {
      onLogin(address);
    }
  };

  const handleDisconnect = (): void => {
    disconnect();
    if (onLogout) {
      onLogout();
    }
  };

  const displayAddress = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : '';

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  return (
    <div className="authentication">
      {!isAuthenticated ? (
        <div className="auth-connect">
          <button onClick={handleConnect} className="connect-button" disabled={loading}>
            {isInWorldApp() ? 'Connect World App Wallet' : 'Connect Wallet'}
          </button>
          {error && <div className="auth-error">{error}</div>}
        </div>
      ) : (
        <div className="auth-connected">
          <div className="address-display">
            <span className="address-label">Connected:</span>
            <span className="address-value">{displayAddress}</span>
            {isVerified && (
              <span className="verified-badge" title="Verified with World ID">
                ✓
              </span>
            )}
          </div>
          <div className="auth-actions">
            {!isVerified && (
              <button onClick={verifyWithWorldId} className="verify-button" disabled={loading}>
                Verify with World ID
              </button>
            )}
            <button onClick={handleDisconnect} className="disconnect-button" disabled={loading}>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
