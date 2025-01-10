import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './investors.css';

const InvestorPage = () => {
  const [harvests, setHarvests] = useState([]);

  const fetchHarvests = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      const contractAddress = "<Your_Contract_Address>";
      const agriToken = new web3.eth.Contract(AgriTokenABI, contractAddress);
      
      const totalSupply = await agriToken.methods.totalSupply().call();
      
      const harvestData = [];
      for (let i = 1; i <= totalSupply; i++) {
        const harvest = await agriToken.methods.harvests(i).call();
        const tokenURI = await agriToken.methods.tokenURI(i).call();
        
        const metadata = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'))
          .then(res => res.json());
          
        harvestData.push({
          id: i,
          ...harvest,
          metadata
        });
      }
      
      setHarvests(harvestData);
    } catch (error) {
      console.error("Error fetching harvests:", error);
    }
  };

  useEffect(() => {
    fetchHarvests();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* PowerBI Dashboard */}
      <div className="mb-12">
      <div className="test-container">
    <div className='test'>
      <iframe
        title="Defy'25_Harvifi"
        width="1000"
        height="541.25"
        marginTop = "100"
        margin
        src="https://app.powerbi.com/reportEmbed?reportId=ed990e8e-d7d6-48b1-95ca-30c7ef32a709&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d"
        frameBorder="0"
        allowFullScreen = "true"
      ></iframe>
      <iframe
        title="Defy'25_Harvifi"
        width="1000"
        height="541.25"
        marginTop = "100"
        margin
        src="https://app.powerbi.com/reportEmbed?reportId=ed990e8e-d7d6-48b1-95ca-30c7ef32a709&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d"
        frameBorder="0"
        allowFullScreen = "true"
      ></iframe>
    </div>
    <div className="test">
      <iframe
        title="Defy'25_Harvifi"
        width="1000"
        height="541.25"
        marginTop = "100"
        margin
        src="https://app.powerbi.com/reportEmbed?reportId=ed990e8e-d7d6-48b1-95ca-30c7ef32a709&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d"
        frameBorder="0"
        allowFullScreen = "true"
      ></iframe>
      <iframe
        title="Defy'25_Harvifi"
        width="1000"
        height="541.25"
        marginTop = "100"
        margin
        src="https://app.powerbi.com/reportEmbed?reportId=ed990e8e-d7d6-48b1-95ca-30c7ef32a709&autoAuth=true&ctid=d4963ce2-af94-4122-95a9-644e8b01624d"
        frameBorder="0"
        allowFullScreen = "true"
      ></iframe>
    </div>
    </div>
    </div>

      {/* Available Harvests Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Available Harvests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {harvests.map((harvest) => (
            <div key={harvest.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Card Image */}
              <div className="h-48 bg-gray-200">
                <img
                  src={harvest.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                  alt={harvest.produceType}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{harvest.produceType}</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Quantity:</span> {harvest.quantity} units
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price:</span> {harvest.pricePerUnit} ETH per unit
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Delivery:</span> {new Date(parseInt(harvest.expectedDeliveryDate)).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span> {harvest.isDelivered ? 'Delivered' : 'Pending'}
                  </p>
                </div>
                
                {!harvest.buyer && (
                  <button 
                    onClick={() => handlePurchase(harvest.id, harvest.quantity * harvest.pricePerUnit)}
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                  >
                    Purchase
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorPage;