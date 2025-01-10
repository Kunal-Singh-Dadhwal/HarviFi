import React, { useState } from "react";
import Web3 from "web3";
import AgriTokenABI from "./abi/AgriToken.json";
import './TokenizeForm.css';

const TokenizeForm = () => {
    const [produceType, setProduceType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const uploadToIPFS = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxOGU4Y2ZjZS03YzdhLTQ0YzctOWUwZi00YjY2MDJlYjA3ZDMiLCJlbWFpbCI6Im1pdHJhcHJhbmphbDIwMDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImVkYmM4MGM4YjdiZGUwMTBmNmU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiNjgyZGYyNjNjNDliNzRlMTI0YmE2ZWQyMzI5YTZlMDdhZmRkODE0MWZhZTA4NGRkZDAxMzRmNzRmYjM2YjY5NCIsImV4cCI6MTc2ODA2MTk0Nn0.xaJ8M-VzA6LUJM-Cz8QTCflHR8YrXsrCrIR-4vXfHdg`,
            },
            body: formData,
        });

        const data = await response.json();
        return `ipfs://${data.IpfsHash}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!window.ethereum) {
                alert("Please install MetaMask to use this feature.");
                setLoading(false);
                return;
            }

            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.requestAccounts();
            const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
            const agriToken = new web3.eth.Contract(AgriTokenABI.abi, contractAddress);

            // Upload image to IPFS
            const imageCID = await uploadToIPFS(image);

            // Create metadata JSON
            const metadata = {
                name: `Harvest Token - ${produceType}`,
                description: `Token representing ${quantity} units of ${produceType}.`,
                image: imageCID,
                attributes: [
                    { trait_type: "Produce Type", value: produceType },
                    { trait_type: "Quantity", value: quantity },
                    { trait_type: "Price Per Unit", value: pricePerUnit },
                    { trait_type: "Expected Delivery Date", value: expectedDeliveryDate },
                ],
            };

            // Upload metadata to IPFS
            const metadataResponse = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxOGU4Y2ZjZS03YzdhLTQ0YzctOWUwZi00YjY2MDJlYjA3ZDMiLCJlbWFpbCI6Im1pdHJhcHJhbmphbDIwMDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImVkYmM4MGM4YjdiZGUwMTBmNmU4Iiwic2NvcGVkS2V5U2VjcmV0IjoiNjgyZGYyNjNjNDliNzRlMTI0YmE2ZWQyMzI5YTZlMDdhZmRkODE0MWZhZTA4NGRkZDAxMzRmNzRmYjM2YjY5NCIsImV4cCI6MTc2ODA2MTk0Nn0.xaJ8M-VzA6LUJM-Cz8QTCflHR8YrXsrCrIR-4vXfHdg`,
                },
                body: JSON.stringify(metadata),
            });

            const metadataData = await metadataResponse.json();
            const metadataURI = `ipfs://${metadataData.IpfsHash}`;

            // Interact with the smart contract
            await agriToken.methods
                .tokenizeHarvest(produceType, quantity, expectedDeliveryDate, pricePerUnit, metadataURI)
                .send({ from: accounts[0] });

            alert("Harvest tokenized successfully!");
        } catch (error) {
            console.error("Error tokenizing harvest:", error);
            alert("An error occurred while tokenizing the harvest.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Tokenize Your Harvest</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Produce Type:</label>
                    <input
                        type="text"
                        value={produceType}
                        onChange={(e) => setProduceType(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Quantity:</label>
                    <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(String(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label>Expected Delivery Date:</label>
                    <input
                        type="text"
                        value={expectedDeliveryDate}
                        onChange={(e) => setExpectedDeliveryDate(String(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label>Price Per Unit (in ETH):</label>
                    <input
                        type="text"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(String(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label>Upload Image:</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>
                <button className="th" type="submit" disabled={loading}>
                    {loading ? "Tokenizing..." : "Tokenize Harvest"}
                </button>
            </form>
        </div>
    );
};

export default TokenizeForm;
