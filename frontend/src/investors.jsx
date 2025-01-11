import React, { useEffect, useState } from "react";
import getAvailableTokens from "./api/blockchain";
import './investors.css';

const InvestorViewTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        const availableTokens = await getAvailableTokens();
        setTokens(availableTokens);
        console.log("Fetched tokens:", availableTokens);
      } catch (err) {
        console.error("Error fetching tokens:", err);
        setError(err.message || "Failed to fetch tokens");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1>Available Tokens</h1>
        <p>Loading tokens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Available Tokens</h1>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Available Tokens</h1>
      <div className="tokens-list">
        {tokens.length > 0 ? (
          tokens.map((token) => (
            <div key={token.id} className="token-card">
              <h3>Harvest Token #{token.id}</h3>
              <div className="token-details">
                <p><strong>Produce Type:</strong> {token.produceType}</p>
                <p><strong>Quantity:</strong> {token.quantity}</p>
                <p><strong>Expected Delivery:</strong> {token.expectedDeliveryDate}</p>
                <p><strong>Price Per Unit:</strong> {token.pricePerUnit} ETH</p>
                <p><strong>Total Price:</strong> {token.totalPrice} ETH</p>
                <p><strong>Farmer:</strong> {token.farmer}</p>
                <p><strong>Status:</strong> {token.isDelivered ? 'Delivered' : 'Pending'}</p>
                {token.buyer !== ethers.ZeroAddress && (
                  <p><strong>Buyer:</strong> {token.buyer}</p>
                )}
                <p>
                  <strong>Metadata:</strong>{' '}
                  <a 
                    href={token.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="metadata-link"
                  >
                    View
                  </a>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No tokens available.</p>
        )}
      </div>
    </div>
  );
};

export default InvestorViewTokens;