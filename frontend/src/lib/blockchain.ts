import { BrowserProvider, Contract, formatUnits } from 'ethers';

// Smart Contract ABI (simplified for demonstration)
export const CONTRACT_ABI = [
  "function setDeadline(string assignmentId, uint256 deadline) external",
  "function submitAssignment(string studentId, string assignmentId, string fileHash) external",
  "function getSubmission(string studentId, string assignmentId) external view returns (string fileHash, uint256 timestamp, address submitter)",
  "function verifySubmission(string studentId, string assignmentId, string fileHash) external view returns (bool)",
  "function getSubmissionHistory(string assignmentId) external view returns (tuple(string studentId, string fileHash, uint256 timestamp, address submitter)[])",
  "function getDeadline(string assignmentId) external view returns (uint256)",
  "event AssignmentSubmitted(string indexed studentId, string indexed assignmentId, string fileHash, uint256 timestamp)",
  "event DeadlineSet(string indexed assignmentId, uint256 deadline)"
];

// Demo contract address (replace with actual deployed contract)
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

export interface Submission {
  studentId: string;
  assignmentId: string;
  fileHash: string;
  timestamp: Date;
  submitter: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  error: string | null;
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Connect to MetaMask
export const connectWallet = async (): Promise<{ address: string; chainId: number }> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    const network = await provider.getNetwork();
    
    return {
      address: accounts[0],
      chainId: Number(network.chainId)
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Connection rejected. Please approve the connection request in MetaMask.');
    }
    throw new Error('Failed to connect wallet: ' + error.message);
  }
};

// Get contract instance
export const getContract = async (): Promise<Contract> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Generate SHA-256 hash from file
export const generateFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
};

// Format timestamp from blockchain
export const formatTimestamp = (timestamp: bigint): Date => {
  return new Date(Number(timestamp) * 1000);
};

// Shorten address for display
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Demo mode functions (for when no blockchain is connected)
export const DEMO_SUBMISSIONS: Submission[] = [
  {
    studentId: 'STU001',
    assignmentId: 'ASN001',
    fileHash: '0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730',
    timestamp: new Date('2024-01-15T10:30:00'),
    submitter: '0x742d35Cc6634C0532925a3b844Bc9e7595f8aB21'
  },
  {
    studentId: 'STU002',
    assignmentId: 'ASN001',
    fileHash: '0x3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
    timestamp: new Date('2024-01-15T11:45:00'),
    submitter: '0x8ba1f109551bD432803012645Ac136ddd64DBA72'
  },
  {
    studentId: 'STU003',
    assignmentId: 'ASN002',
    fileHash: '0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    timestamp: new Date('2024-01-16T09:15:00'),
    submitter: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0'
  }
];

// Declare ethereum on window
declare global {
  interface Window {
    ethereum?: any;
  }
}
