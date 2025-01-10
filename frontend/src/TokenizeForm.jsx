import React, { useState } from "react";
import Web3 from "web3";
// import AgriTokenABI from "../abi/AgriToken.json";
import './TokenizeForm.css';

const TokenizeForm = () => {
    const [produceType, setProduceType] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState(0);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadToIPFS = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer <Your_Pinata_JWT>`,
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
            const contractAddress = "<Your_Contract_Address>";
            const agriToken = new web3.eth.Contract(AgriTokenABI, contractAddress);

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
                    Authorization: `Bearer <Your_Pinata_JWT>`,
                },
                body: JSON.stringify(metadata),
            });

            const metadataData = await metadataResponse.json();
            const metadataURI = `ipfs://${metadataData.IpfsHash}`;

            // Interact with the smart contract
            await agriToken.methods
                .tokenizeHarvest(produceType, quantity, new Date(expectedDeliveryDate).getTime(), pricePerUnit, metadataURI)
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
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                    />
                </div>
                <div>
                    <label>Expected Delivery Date:</label>
                    <input
                        type="date"
                        value={expectedDeliveryDate}
                        onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price Per Unit (in ETH):</label>
                    <input
                        type="number"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(Number(e.target.value))}
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