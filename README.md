# Tokenized Agricultural Produce Financing

## **Problem Statement**
Farmers face delayed payments and exploitation from intermediaries in agricultural supply chains. This project aims to provide a platform where farmers can tokenize their future harvests as NFTs, enabling direct investment and secure transactions.

---

## **Solution**
- **Tokenization**: Farmers tokenize future harvests as NFTs, representing their crop value.
- **Investors**: Buyers or investors purchase these tokens, providing farmers with immediate capital.
- **Smart Contracts**: Automate payments upon harvest delivery, eliminating intermediaries.
- **IPFS Integration**: Store metadata and images securely in a decentralized manner.

---

## **Installation**
```
git clone https://github.com/Kunal-Singh-Dadhwal/HarviFi
cd frontend/
npm install
```
Hardhat compile

```
npx hardhat compile
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js --network localhost
```
You are all set

---

## **Technologies Used**
1. **Frontend**: React.js
2. **Backend**: Node.js with Express.js
3. **Database**: PostgreSQL
4. **Blockchain**: Solidity (Smart Contracts)
5. **Decentralized Storage**: IPFS (via Pinata API)
6. **Web3**: Interaction with Ethereum blockchain

---

## **File Structure**

---
```
HarviFi/
├── frontend/                # React Frontend
│   ├── public/
|   ├── contracts/
|   |    ├── Lock.Sol      # Smart Contracts
|   ├──ignition/
|   |    ├── modules
|   |    |    ├── Lock.js  # Ignition module to deploy 
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # App pages (Home, Tokenize, Dashboard)
│       ├── utils/         # Utility functions (e.g., wallet integration)
│       ├── App.js
│       ├── index.js
│       └── styles/        # CSS or Tailwind configurations
├── Backend/                # Node.js Backend
│   ├── routes/            # API routes
│   ├── models/            # Postgres models
│   ├── app.js             # Main server file
|   ├── package.json
│   ├── config/            # Configuration (e.g., MongoDB, environment variables)
|   └── index.js           # Index File 
├── package.json
└── README.md
```

