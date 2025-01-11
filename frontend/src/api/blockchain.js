import { ethers } from "ethers";
import AgriTokenABI from "../abi/AgriToken.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getAvailableTokens = async () => {
  try {
    console.log("Starting token fetch process...");

    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask or another Web3 provider is not installed.");
    }

    console.log("Provider initialized");
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      AgriTokenABI.abi,
      provider
    );
    console.log("Contract instance created");

    try {
      // await provider.send("eth_requestAccounts", []);
      console.log("Wallet connection successful");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw new Error("User denied account access");
    }

    const signer = await provider.getSigner();
    console.log("Signer obtained:", await signer.getAddress());

    // First, let's check if the contract address is correct
    const name = await contract.name();
    console.log("Contract name:", name);

    // Get all minting events (Transfer from zero address)
    const filter = contract.filters.Transfer(ethers.ZeroAddress);
    console.log("Transfer filter created");

    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log("Latest block number:", latestBlock);

    // Query events from a reasonable starting block (e.g., last 1000 blocks or from contract deployment)
    const fromBlock = Math.max(0, latestBlock - 1000);
    const events = await contract.queryFilter(filter, fromBlock, latestBlock);
    console.log("Transfer events found:", events.length);

    if (events.length === 0) {
      // Try getting token balance of connected address
      const userAddress = await signer.getAddress();
      const balance = await contract.balanceOf(userAddress);
      console.log("Connected address token balance:", balance.toString());
    }

    // Extract unique token IDs from transfer events
    const tokenIds = [
      ...new Set(events.map((event) => event.args[2].toString())),
    ];
    console.log("Unique token IDs found:", tokenIds);

    if (!tokenIds || tokenIds.length === 0) {
      console.log("No tokens found in events");
      return [];
    }

    const tokenDetails = await Promise.all(
      tokenIds.map(async (id) => {
        try {
          // Check if token exists
          const owner = await contract.ownerOf(id);
          console.log(`Token ${id} owner:`, owner);

          // Get harvest details
          const harvest = await contract.harvests(id);
          console.log(`Token ${id} harvest details:`, harvest);

          const uri = await contract.tokenURI(id);

          return {
            id: id,
            uri,
            owner,
            produceType: harvest.produceType,
            quantity: harvest.quantity.toString(),
            expectedDeliveryDate: harvest.expectedDeliveryDate,
            pricePerUnit: ethers.formatEther(harvest.pricePerUnit),
            isDelivered: harvest.isDelivered,
            farmer: harvest.farmer,
            buyer: harvest.buyer,
          };
        } catch (error) {
          console.error(`Error fetching details for token ${id}:`, error);
          return null;
        }
      })
    );

    const validTokens = tokenDetails.filter((token) => token !== null);
    console.log("Final valid tokens:", validTokens);

    return validTokens;
  } catch (error) {
    console.error("Error in getAvailableTokens:", error);
    throw error;
  }
};
