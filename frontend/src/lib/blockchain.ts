import { BrowserProvider, Contract, EventLog } from 'ethers';

// Smart Contract ABI matching AssignmentHashing.sol
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_assignmentId", "type": "string" },
      { "internalType": "string", "name": "_fileHash", "type": "string" }
    ],
    "name": "submitAssignment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_student", "type": "address" },
      { "internalType": "string", "name": "_assignmentId", "type": "string" }
    ],
    "name": "getSubmission",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "student", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "assignmentId", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "fileHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "AssignmentSubmitted",
    "type": "event"
  }
];

// Contract address - update this after deploying the contract
// For local Hardhat: usually 0x5FbDB2315678afecb367f032d93F642f64180aa3
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export interface Submission {
  studentAddress: string;
  assignmentId: string;
  fileHash: string;
  timestamp: Date;
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

// Get read-only contract (for querying)
export const getReadOnlyContract = async (): Promise<Contract> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  const provider = new BrowserProvider(window.ethereum);
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Submit assignment to blockchain
export const submitAssignmentToBlockchain = async (
  assignmentId: string,
  fileHash: string
): Promise<{ txHash: string }> => {
  const contract = await getContract();
  const tx = await contract.submitAssignment(assignmentId, fileHash);
  const receipt = await tx.wait();
  return { txHash: receipt.hash };
};

// Get submission from blockchain
export const getSubmissionFromBlockchain = async (
  studentAddress: string,
  assignmentId: string
): Promise<{ fileHash: string; timestamp: Date } | null> => {
  try {
    const contract = await getReadOnlyContract();
    const [fileHash, timestamp] = await contract.getSubmission(studentAddress, assignmentId);
    if (!fileHash || timestamp === 0n) {
      return null;
    }
    return {
      fileHash,
      timestamp: formatTimestamp(timestamp)
    };
  } catch {
    return null;
  }
};

// Get all submissions from blockchain events
export const getAllSubmissions = async (): Promise<Submission[]> => {
  try {
    const contract = await getReadOnlyContract();
    const filter = contract.filters.AssignmentSubmitted();
    const events = await contract.queryFilter(filter, -10000) as EventLog[];
    
    return events.map(event => ({
      studentAddress: event.args[0],
      assignmentId: event.args[1],
      fileHash: event.args[2],
      timestamp: formatTimestamp(event.args[3])
    }));
  } catch {
    return [];
  }
};

// Verify submission on blockchain
export const verifySubmissionOnBlockchain = async (
  studentAddress: string,
  assignmentId: string,
  fileHash: string
): Promise<{ verified: boolean; timestamp?: Date }> => {
  try {
    const submission = await getSubmissionFromBlockchain(studentAddress, assignmentId);
    if (!submission) {
      return { verified: false };
    }
    const verified = submission.fileHash.toLowerCase() === fileHash.toLowerCase();
    return { verified, timestamp: submission.timestamp };
  } catch {
    return { verified: false };
  }
};

// Demo submissions for fallback when blockchain is not available
export const DEMO_SUBMISSIONS: Submission[] = [
  {
    studentAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8aB21',
    assignmentId: 'ASN001',
    fileHash: '0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730',
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    studentAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    assignmentId: 'ASN001',
    fileHash: '0x3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
    timestamp: new Date('2024-01-15T11:45:00')
  },
  {
    studentAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    assignmentId: 'ASN002',
    fileHash: '0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    timestamp: new Date('2024-01-16T09:15:00')
  }
];

// Declare ethereum on window
declare global {
  interface Window {
    ethereum?: any;
  }
}
