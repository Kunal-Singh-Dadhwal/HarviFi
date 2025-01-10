import React from "react";
import './header.css';
import { useState, useEffect } from "react";
import { connectWallet } from "./utils/wallet";

function Header() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [signer, setSigner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");

    const handleConnect = async () => {
        try {
            setLoading(true);
            const walletSigner = await connectWallet();
            setSigner(walletSigner);
            
            if (walletSigner) {
                const address = await walletSigner.getAddress();
                // Truncate the address for display
                const truncatedAddress = address.slice(0, 6) + "..." + address.slice(-4);
                setWalletAddress(truncatedAddress);
                console.log("Connected wallet address:", address);
            }
        } catch (error) {
            console.error("Error in handleConnect:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="header">
                <img src="./public/logo.png" alt="logo" height="100%"/>
                <div className="nav">
                    <button>Explore</button>|
                    <button>Farmer</button>|
                    <button>Investors</button>|
                    <button>Create</button>
                    <button 
                        id="login"
                        onClick={handleConnect}
                        disabled={loading}
                    >
                        {loading ? "Connecting..." : 
                         walletAddress ? walletAddress : 
                         "Connect Wallet"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Header;