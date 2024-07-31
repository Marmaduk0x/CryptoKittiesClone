// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoKittiesBreeding is Ownable {
    address public cryptoKittiesCoreAddress;

    constructor(address _cryptoKittiesCoreAddress) {
        require(_cryptoKittiesCoreAddress != address(0), "CryptoKittiesCore address cannot be zero.");
        cryptoKittiesCoreAddress = _cryptoKittiesCoreAddress;
    }

    function breed(uint256 parent1, uint256 parent2) public {
        require(parent1 != 0 && parent2 != 0, "Parent IDs must be non-zero.");
        require(parent1 != parent2, "Parent IDs must be different.");

        emit BreedSuccess(parent1, parent2);
    }

    event BreedSuccess(uint256 parent1, uint256 parent2);
}
```
```javascript
const Migrations = artifacts.require("Migrations");
const CryptoKittiesCore = artifacts.require("CryptoKittiesCore");
const CryptoKittiesSales = artifacts.require("CryptoKittiesSales");
const CryptoKittiesBreeding = artifacts.require("CryptoKittiesBreeding");

module.exports = async function(deployer) {
    try {
        await deployer.deploy(Migrations);
        await deployer.deploy(CryptoKittiesCore);
        
        const coreInstance = await CryptoKittiesCore.deployed();
        
        await deployer.deploy(CryptoKittiesSales, coreInstance.address);
        
        await deployer.deploy(CryptoKittiesBreeding, coreInstance.address);

        console.log("Deployments successful.");
    } catch (error) {
        console.error("Deployments failed:", error);
    }
};