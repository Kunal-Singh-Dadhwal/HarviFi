import { ethers } from 'ethers';

export const connectWallet = async () => {
    try {
        if (!window.ethereum) {
            alert("MetaMask is required!");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        return signer;
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Error connecting wallet. Please try again.");
    }
};