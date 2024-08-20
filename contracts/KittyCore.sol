pragma solidity ^0.8.0;

contract CryptoKittiesClone {
    event Birth(address owner, uint256 kittyId, uint256 mumId, uint256 dadId, uint256 genes);

    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    Kitty[] public kitties;

    mapping(uint256 => address) public kittyIndexToOwner;
    mapping(address => uint256) ownershipTokenCount;

    function createKittyGen0(uint256 _genes) external {
        _createKitty(0, 0, 0, _genes, msg.sender);
    }

    function breed(uint256 _dadId, uint256 _mumId) external {
        require(_dadId < kitties.length, "Dad does not exist");
        require(_mumId < kitties.length, "Mum does not exist");

        (uint256 mumGen, uint256 dadGen) = _getParentGenerations(_mumId, _dadId);
        uint256 newGen = _calculateNewGeneration(mumGen, dadGen);

        uint256 mixedGenes = _mixGenes(kitties[_mumId].genes, kitties[_dadId].genes);
        
        _createKitty(_mumId, _dadId, newGen, mixedGenes, msg.sender);
    }

    function _createKitty(
        uint256 mumId, 
        uint256 dadId, 
        uint256 generation, 
        uint256 genes, 
        address owner
    ) internal returns (uint256) {
        Kitty memory newKitty = Kitty({
            genes: genes,
            birthTime: uint64(block.timestamp),
            mumId: uint32(mumId),
            dadId: uint32(dadId),
            generation: uint16(generation)
        });
        
        kitties.push(newKitty);
        uint256 newKittyId = kitties.length - 1;

        _registerBirth(owner, newKittyId, mumId, dadId, genes);

        return newKittyId;
    }

    function transfer(address to, uint256 kittyId) external {
        require(msg.sender == kittyIndexToOwner[kittyId], "You do not own this kitty");
        require(to != address(0), "Cannot transfer to the zero address");
        require(kittyId < kitties.length, "Kitty does not exist");

        _transferOwnership(msg.sender, to, kittyId);
    }

    function _mixGenes(uint256 genes1, uint256 genes2) internal pure returns (uint256) {
        return (genes1 + genes2) / 2;
    }

    function _getParentGenerations(uint256 mumId, uint256 dadId) internal view returns (uint256, uint256) {
        return (kitties[mumId].generation, kitties[dadId].generation);
    }

    function _calculateNewGeneration(uint256 mumGen, uint256 dadGen) internal pure returns (uint256) {
        return 1 + (mumGen > dadGen ? mumGen : dadGen);
    }

    function _registerBirth(
        address owner,
        uint256 kittyId,
        uint256 mumId,
        uint256 dadId,
        uint256 genes
    ) internal {
        emit Birth(owner, kittyId, mumId, dadId, genes);

        kittyIndexToOwner[kittyId] = owner;
        ownershipTokenCount[owner]++;
    }

    function _transferOwnership(
        address from,
        address to,
        uint256 kittyId
    ) internal {
        ownershipTokenCount[from]--;
        ownershipTokenCount[to]++;
        kittyIndexToOwner[kittyId] = to;
    }
}