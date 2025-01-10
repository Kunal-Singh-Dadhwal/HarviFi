import React, { useState } from "react";
import './header.css';
import TokenizeForm from './TokenizeForm';
import { connectWallet } from "./utils/wallet";
import { Link } from 'react-router-dom';
import InvestorPage from "./investors";
import WebsiteTranslator from "./websitetranslater";

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

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            <div className="header">
                <img src="./public/logo.png" alt="logo" height="100%" />
                <div className="nav">
                    <button>Explore</button>|
                    <button onClick={handlePopupOpen}>Farmer</button>|
                    <Link to="/investor">
                        <button style={{ padding: '10px 20px', fontSize: '16px' }}>Investor</button>
                    </Link>|
                    <button 
                        id="login"
                        onClick={handleConnect}
                        disabled={loading}
                        className="wallet-button"
                    >
                        {loading ? "Connecting..." : 
                        walletAddress ? walletAddress : 
                        "Connect Wallet"}
                    </button>
                </div>

            </div>

            {isPopupOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handlePopupClose}>&times;</span>
                        <TokenizeForm />
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;