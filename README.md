# Secure Assignment - Blockchain Project

A full-stack application for secure assignment submission and verification using blockchain technology and smart contracts.


## 🎯 Project Overview

This project provides a secure platform for:
- **Students**: Submit assignments with blockchain-verified timestamps
- **Teachers**: Verify assignment authenticity and timestamps on the blockchain


All submissions are logged to the blockchain for immutable verification.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Web3**: ethers.js
- **Routing**: React Router v6
- **Testing**: Vitest

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **CORS Support**: Enabled for frontend communication
- **Blockchain**: Hardhat (local Ethereum network)
- **Smart Contracts**: Solidity

### Blockchain
- **Network**: Hardhat Node / Ganache
- **Contract Language**: Solidity
- **Development Framework**: Hardhat with TypeChain

---

## 📁 Project Structure

```
Blockchain-Project/
├── backend/                          # Express server & blockchain contracts
│   ├── contracts/
│   │   └── AssignmentTimestamp.sol   # Smart contract for assignment verification
│   ├── scripts/
│   │   └── deploy.js                 # Contract deployment script
│   ├── src/
│   │   └── server.ts                 # Express API server
│   ├── hardhat.config.js             # Hardhat configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                          # Backend environment variables
│
├── frontend/                         # React + Vite application
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   ├── ui/                   # ShadCN UI components
│   │   │   ├── Layout.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   └── NavLink.tsx
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── StudentPortal.tsx
│   │   │   ├── TeacherPortal.tsx
│   │   │   ├── VerificationPage.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useWallet.ts          # Wallet connection logic
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   ├── api.ts                # Backend API client
│   │   │   ├── blockchain.ts         # Smart contract interaction
│   │   │   └── utils.ts
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css / App.css        # Styling
│   ├── public/
│   │   ├── assignment.png            # Favicon
│   │   └── robots.txt
│   ├── index.html                    # HTML template with favicon
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env                          # Frontend environment variables
│   └── vitest.config.ts
│
└── README.md                         # This file
```

---

## 📦 Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** or **yarn** or **bun**
- **Git**
- **MetaMask** or compatible Web3 wallet (for frontend interaction)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Blockchain-Project
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
# or
yarn install
# or
bun install
```

---

## ⚙️ Setup & Configuration

### Backend Environment Variables

Create `backend/.env`:
```env
# Add any backend-specific variables here (optional for local development)
```

### Smart Contract Deployment

Deploy the smart contract to your local Hardhat network:

```bash
cd backend
npx hardhat run scripts/deploy.js --network localhost
```

This will output the deployed contract address — update `VITE_CONTRACT_ADDRESS` in `frontend/.env` if different.

---

## 🦊 MetaMask & Ganache Configuration Guide

This section explains how to connect **Ganache GUI**, **MetaMask**, and your dApp together.

---

## 1️⃣ Start Ganache (GUI)

1. Open **Ganache GUI**
2. Click **Quickstart Ethereum**
3. Ganache will start a local blockchain:
   - RPC Server:
     ```
     http://127.0.0.1:7545
     ```
   - Chain ID:
     ```
     1337
     ```
4. Ganache will generate multiple accounts with private keys and test ETH.

---

## 2️⃣ Add Ganache Network to MetaMask

1. Open **MetaMask**
2. Go to **Network dropdown → Add network → Add network manually**
3. Enter the following details:

Network Name: Ganache Local
New RPC URL: http://127.0.0.1:7545

Chain ID: 1337
Currency Symbol: ETH


4. Click **Save**
5. Switch MetaMask to **Ganache Local** network

---

## 3️⃣ Import Ganache Account into MetaMask

1. In Ganache, click on any account
2. Copy the **Private Key**
3. Open MetaMask → Click account icon → **Import Account**
4. Paste the private key and import

✅ This MetaMask account now has test ETH  
✅ Use this account for all transactions

---

## 4️⃣ Configure Backend Environment Variables

Create or update `backend/.env`:

```env
GANACHE_RPC=http://127.0.0.1:7545
PRIVATE_KEY=your_ganache_account_private_key



## ▶️ Running the Application

### Option 1: Run All Services (Recommended for Development)

**Terminal 1 — Start Hardhat local blockchain:**
```bash
cd backend
npx hardhat node
```
This starts an Ethereum test network on `http://127.0.0.1:8545`

**Terminal 2 — Start Backend Express Server:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 3 — Start Frontend Dev Server:**
```bash
cd frontend
npm run dev
# or
yarn dev
```
Frontend runs on `http://localhost:5173` (Vite default)

### Option 2: Run Only Backend + Frontend (with existing network)

If you already have a blockchain network running (Ganache, Alchemy, etc.):

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled JavaScript
```

**Frontend:**
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run test         # Run Vitest once
npm run test:watch   # Run Vitest in watch mode
```

**Blockchain (Backend):**
```bash
npx hardhat node                              # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost  # Deploy contracts
npx hardhat test                              # Run contract tests
```

---

## 📝 Smart Contract

**File**: `backend/contracts/AssignmentTimestamp.sol`

### Contract Features
- Record assignment submissions with timestamps
- Verify assignment authenticity
- Store student and assignment metadata on-chain
- Emit events for submission tracking

### Deployment
The contract is deployed to the Hardhat network on startup. Contract address is logged in the console.

---

## 🔌 API Documentation

### Backend Endpoints

#### POST `/log-submission`
Logs a submission to the backend audit trail.

**Request Body:**
```json
{
  "student": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
  "assignmentId": "CS101-A1",
  "txHash": "0xabcd1234..."
}
```

**Response:**
```json
{
  "success": true
}
```

---

