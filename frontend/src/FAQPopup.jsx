import React, { useState } from 'react';
import './FAQPopup.css';

function FAQPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-container">
      <button className="faq-button" onClick={togglePopup}>
        {isOpen ? 'Close FAQ' : 'FAQs'}
      </button>
      {isOpen && (
        <div className="faq-popup">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-content">
            <div className="faq-item">
              <h3>1. What is this platform about?</h3>
              <p>
                Our platform is a blockchain-based marketplace that connects farmers directly with buyers. It allows the tokenization of agricultural goods, enabling secure, transparent, and efficient transactions without intermediaries.
              </p>
            </div>
            <div className="faq-item">
              <h3>2. What does tokenization mean in this context?</h3>
              <p>
                Tokenization refers to representing a farmer's goods, such as crops or produce, as digital tokens on the blockchain. These tokens can be bought, sold, or traded, ensuring traceability and authenticity for every transaction.
              </p>
            </div>
            <div className="faq-item">
              <h3>3. How does blockchain benefit farmers and buyers?</h3>
              <p>
                Blockchain provides a decentralized ledger that ensures transparency, security, efficiency, and fair pricing by eliminating intermediaries.
              </p>
            </div>
            <div className="faq-item">
              <h3>4. How do I create an account?</h3>
              <p>
              You can log in or sign up by connecting your wallet using MetaMask. Simply click on the 'Connect Wallet' button, and follow the prompts in your MetaMask extension or app to get started.
              </p>
            </div>
            <div className="faq-item">
              <h3>5. How do I tokenize my goods?</h3>
              <p>
              To tokenize your goods, follow these steps: <br />1. Fill in the product type (e.g., rice, wheat, etc.).<br />2. Enter the quantity of your product in kilograms (kgs).<br />3. Provide your email address for easy communication with potential buyers.<br />4. Set the price of your goods in ETH (Ethereum).<br />5. Upload an image representing your product. This image will be used to generate a unique NFT (Non-Fungible Token) for your product on the blockchain.<br />Once these steps are completed, your goods will be tokenized and listed on the marketplace for buyers to view and purchase.
              </p>
            </div>
            <div className="faq-item">
              <h3>6. How do I make a purchase?</h3>
              <p>
              Browse the marketplace, select the goods you wish to buy, and complete the transaction using your connected wallet.
              </p>
            </div>
            <div className="faq-item">
              <h3>7. Is this platform secure?</h3>
              <p>
                Yes, security is our top priority. We use blockchain technology to ensure transactions are immutable and encrypted.
              </p>
            </div>
            {/* Add more FAQs as needed */}
          </div>
        </div>
      )}
    </div>
  );
}

export default FAQPopup;