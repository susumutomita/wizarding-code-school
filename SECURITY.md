# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Wallet Authentication Implementation (SIWE/EIP-4361)

The Wizarding Code School mini-app uses Wallet Authentication via Sign-In with Ethereum
(SIWE/EIP-4361) to identify users and store their progress. This section outlines the
implementation details and security considerations.

### How Wallet Auth Works

1. When a user first accesses the app, we request wallet authentication via the World
   platform's wallet auth module
2. The user sees a signature request in their wallet (MetaMask, etc.) with a structured
   message following EIP-4361 format
3. The signature allows us to verify the user controls the wallet address without
   exposing private keys
4. The address is used as a unique identifier for storing user progress in localStorage

### Threat Model

| Threat                               | Mitigation                             |
| ------------------------------------ | -------------------------------------- |
| Unauthorized access to user progress | Data is keyed by wallet address; only  |
|                                      | users with wallet control can access   |
|                                      | their data                             |
| Session hijacking                    | We validate wallet signatures on every |
|                                      | session start                          |
| Replay attacks                       | SIWE messages contain timestamps and   |
|                                      | nonces to prevent reuse                |
| localStorage tampering               | We don't store sensitive data; only    |
|                                      | level completion status                |
| Lack of wallet                       | Authentication is optional; users can  |
|                                      | still play without progress tracking   |

### Security Limitations

- This integration relies on the security of World's wallet-auth implementation
- We only use the user's address for identification, not for any blockchain transactions
- Progress data stored in localStorage is not synchronized across devices
- We do not handle or store any private keys or sensitive wallet information

## Reporting a Vulnerability

If you discover a security vulnerability in the Wizarding Code School project, please
follow these steps:

1. **Do not disclose the vulnerability publicly**
2. Email details to security with
   "SECURITY VULNERABILITY" in the subject line
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (if known)
4. You will receive an acknowledgment within 48 hours
5. We will work with you to understand, validate, and address the issue
6. After resolution, you will be credited (unless you request anonymity)

## Dependencies Security Policy

We maintain the security of our dependencies using these practices:

1. **Regular Audits**: Monthly automated audit of all dependencies using `pnpm audit`
2. **Automated Updates**: Non-breaking security updates are automatically merged via
   Dependabot
3. **Major Updates**: Major version updates are reviewed and tested before merging
4. **Minimized Dependencies**: We carefully evaluate each dependency before adding it
   to the project

### Security Tools

The following tools are used to ensure security in our CI/CD pipeline:

- `pnpm audit` - For scanning known vulnerabilities in dependencies
- Static analysis for code quality
- Dependabot alerts and automatic updates

## Browser and Device Support

We focus our security testing on:

- Latest 2 versions of major browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers on iOS 14+ and Android 10+
- World App's embedded browser environment
