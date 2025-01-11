import React, { useEffect, useState } from "react";
import { getAvailableTokens } from "./api/blockchain";
import './investors.css';
import { ethers } from 'ethers';

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
      <h1 className="atokens">Available Tokens</h1>
      
      {/* Tokens List */}
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

      {/* Dashboards Section - Outside of the tokens mapping */}
      <div className="dashboards-section">
        <div className="dashboard-container">
          <iframe 
            title="Defy'25_Harvify_INVESTOR" 
            width="1140" 
            height="541.25" 
            src="https://app.powerbi.com/reportEmbed?reportId=e73ca7de-d0d8-4ac7-afb9-e3b0f545d4e8&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d" 
            frameBorder="0" 
            allowFullScreen={true}
          />
        </div>
        
        <div className="dashboard-container">
          <iframe 
            title="Defy'25_Harvifi" 
            width="1140" 
            height="541.25" 
            src="https://app.powerbi.com/reportEmbed?reportId=ed990e8e-d7d6-48b1-95ca-30c7ef32a709&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d" 
            frameBorder="0" 
            allowFullScreen={true}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestorViewTokens;