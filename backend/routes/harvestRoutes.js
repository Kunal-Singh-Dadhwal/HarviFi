const express = require("express");
const router = express.Router();
const Harvest = require("../models/Harvest");

router.post("/tokenize", async (req, res) => {
    const { tokenId, produceType, quantity, expectedDeliveryDate, pricePerUnit, farmerAddress, metadataURI } = req.body;

    try {
        const harvest = await Harvest.create({
            tokenId,
            produceType,
            quantity,
            expectedDeliveryDate,
            pricePerUnit,
            farmerAddress,
            metadataURI,
        });
        res.status(201).json({ message: "Harvest tokenized successfully!", data: harvest });
    } catch (error) {
        res.status(500).json({ message: "Error storing harvest metadata.", error });
    }
});

router.get("/harvests", async (req, res) => {
    try {
        const harvests = await Harvest.findAll();
        res.status(200).json({ data: harvests });
    } catch (error) {
        res.status(500).json({ message: "Error fetching harvests.", error });
    }
});

module.exports = router;
