// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoKittiesClone {
    event NewBirth(address owner, uint256 kittyId, uint256 motherId, uint256 fatherId, uint256 genes);

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 motherId;
        uint32 fatherId;
        uint16 generation;
    }

    Kitty[] public kitties;

    mapping(uint256 => address) public kittyOwner;
    mapping(address => uint256) ownerKittyCount;

    function createGen0Kitty(uint256 _genes) external {
        _createKitty(0, 0, 0, _genes, msg.sender);
    }

    function breedKitties(uint256 _fatherId, uint256 _motherId) external {
        require(_fatherId < kitties.length, "Father does not exist");
        require(_motherId < kitties.length, "Mother does not exist");

        (uint256 motherGeneration, uint256 fatherGeneration) = _getParentGenerations(_motherId, _fatherId);
        uint256 newGeneration = _calculateNewGeneration(motherGeneration, fatherGeneration);

        uint256 mixedGenes = _mixGenes(kitties[_motherId].genes, kitties[_fatherId].genes);
        
        _createKitty(_motherId, _fatherId, newGeneration, mixedGenes, msg.sender);
    }

    function _createKitty(
        uint256 motherId, 
        uint256 fatherId, 
        uint256 generation, 
        uint256 genes, 
        address owner
    ) internal returns (uint256) {
        Kitty memory _newKitty = Kitty({
            genes: genes,
            birthTime: uint64(block.timestamp),
            motherId: uint32(motherId),
            fatherId: uint32(fatherId),
            generation: uint16(generation)
        });
        
        kitties.push(_newKitty);
        uint256 newKittyId = kitties.length - 1;

        _logNewBirth(owner, newKittyId, motherId, fatherId, genes);

        return newKittyId;
    }

    function transferKitty(address to, uint256 kittyId) external {
        require(msg.sender == kittyOwner[kittyId], "You do not own this kitty");
        require(to != address(0), "Cannot transfer to the zero address");
        require(kittyId < kitties.length, "Kitty does not exist");

        _changeKittyOwnership(msg.sender, to, kittyId);
    }

    function _mixGenes(uint256 gene1, uint256 gene2) internal pure returns (uint256) {
        return (gene1 + gene2) / 2;
    }

    function _getParentGenerations(uint256 motherId, uint256 fatherId) internal view returns (uint256, uint256) {
        return (kitties[motherId].generation, kitties[fatherId].generation);
    }

    function _calculateNewGeneration(uint256 motherGen, uint256 fatherGen) internal pure returns (uint256) {
        return 1 + (motherGen > fatherGen ? motherGen : fatherGen);
    }

    function _logNewBirth(
        address owner,
        uint256 kittyId,
        uint256 motherId,
        uint256 fatherId,
        uint256 genes
    ) internal {
        emit NewBirth(owner, kittyId, motherId, fatherId, genes);

        kittyOwner[kittyId] = owner;
        ownerKittyCount[owner]++;
    }

    function _changeKittyOwnership(
        address previousOwner,
        address newOwner,
        uint256 kittyId
    ) internal {
        ownerKittyCount[previousOwner]--;
        ownerKittyCount[newOwner]++;
        kittyOwner[kittyId] = newOwner;
    }
}