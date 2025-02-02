// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counters.sol";

contract Lock is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    constructor(address initialOwner) ERC721("Agricultural Harvest Token", "AHT") Ownable(initialOwner) {}
    struct Harvest {
        string produceType;
        uint256 quantity;
        uint256 expectedDeliveryDate;
        uint256 pricePerUnit;
        bool isDelivered;
        address farmer;
        address buyer;
    }
    
    mapping(uint256 => Harvest) public harvests;
    mapping(address => bool) public verifiedFarmers;
    
    event HarvestTokenized(uint256 tokenId, address farmer, string produceType, uint256 quantity);
    event HarvestPurchased(uint256 tokenId, address buyer, uint256 amount);
    event HarvestDelivered(uint256 tokenId);
    
    
    function tokenizeHarvest(
        string memory produceType,
        uint256 quantity,
        uint256 expectedDeliveryDate,
        uint256 pricePerUnit,
        string memory tokenURI
    ) external returns (uint256) {
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        harvests[newTokenId] = Harvest({
            produceType: produceType,
            quantity: quantity,
            expectedDeliveryDate: expectedDeliveryDate,
            pricePerUnit: pricePerUnit,
            isDelivered: false,
            farmer: msg.sender,
            buyer: address(0)
        });
        
        emit HarvestTokenized(newTokenId, msg.sender, produceType, quantity);
        return newTokenId;
    }
    
    function purchaseHarvest(uint256 tokenId) external payable {
        Harvest storage harvest = harvests[tokenId];
        require(harvest.buyer == address(0), "Harvest already purchased");
        require(msg.value == harvest.quantity * harvest.pricePerUnit, "Incorrect payment amount");
        
        harvest.buyer = msg.sender;
        payable(harvest.farmer).transfer(msg.value);
        
        _transfer(harvest.farmer, msg.sender, tokenId);
        emit HarvestPurchased(tokenId, msg.sender, msg.value);
    }
    
    function confirmDelivery(uint256 tokenId) external {
        require(msg.sender == harvests[tokenId].buyer, "Only buyer can confirm delivery");
        harvests[tokenId].isDelivered = true;
        emit HarvestDelivered(tokenId);
    }
    function getAvailableTokens() public view returns (Harvest[] memory) {
        uint256 totalTokens = _tokenIds.current();
        Harvest[] memory availableTokens = new Harvest[](totalTokens);
        uint256 index = 0;

        for (uint256 i = 1; i <= totalTokens; i++) {
            if (harvests[i].isDelivered == false) {
                availableTokens[index] = harvests[i];
                index++;
            }
        }

        return availableTokens;
    }
}
