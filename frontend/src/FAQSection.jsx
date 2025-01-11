import React, { useState } from 'react';
import './FAQSection.css';


const FAQSection = () => {
  const [expandedId, setExpandedId] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "What is this platform about?",
      answer: "Our platform is a blockchain-based marketplace that connects farmers directly with buyers. It allows the tokenization of agricultural goods, enabling secure, transparent, and efficient transactions without intermediaries."
    },
    {
      id: 2,
      question: "What does tokenization mean in this context?",
      answer: "Tokenization refers to representing a farmer's goods, such as crops or produce, as digital tokens on the blockchain. These tokens can be bought, sold, or traded, ensuring traceability and authenticity for every transaction."
    },
    {
      id: 3,
      question: "How does blockchain benefit farmers and buyers?",
      answer: "Blockchain provides a decentralized ledger that ensures transparency, security, efficiency, and fair pricing by eliminating intermediaries."
    },
    {
      id: 4,
      question: "How do I create an account?",
      answer: "You can log in or sign up by connecting your wallet using MetaMask. Simply click on the 'Connect Wallet' button, and follow the prompts in your MetaMask extension or app to get started."
    },
    {
      id: 5,
      question: "How do I tokenize my goods?",
      answer: "To tokenize your goods, follow these steps:\n1. Fill in the product type (e.g., rice, wheat, etc.)\n2. Enter the quantity of your product in kilograms (kgs)\n3. Provide your email address for easy communication with potential buyers\n4. Set the price of your goods in ETH (Ethereum)\n5. Upload an image representing your product\nOnce these steps are completed, your goods will be tokenized and listed on the marketplace for buyers to view and purchase."
    },
    {
      id: 6,
      question: "How do I make a purchase?",
      answer: "Browse the marketplace, select the goods you wish to buy, and complete the transaction using your connected wallet."
    },
    {
      id: 7,
      question: "Is this platform secure?",
      answer: "Yes, security is our top priority. We use blockchain technology to ensure transactions are immutable and encrypted."
    }
  ];

  const toggleQuestion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqData.map((faq) => (
          <div key={faq.id} className="faq-item">
            <button
              className={`faq-question ${expandedId === faq.id ? 'active' : ''}`}
              onClick={() => toggleQuestion(faq.id)}
            >
              {faq.question}
              <span className="faq-icon"></span>
            </button>
            <div className={`faq-answer ${expandedId === faq.id ? 'active' : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
