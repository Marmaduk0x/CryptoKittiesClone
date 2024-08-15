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

    Kitty[] kitties;

    mapping(uint256 => address) public kittyIndexToOwner;
    mapping(address => uint256) ownershipTokenCount;

    function createKittyGen0(uint256 _genes) external {
        _createKitty(0, 0, 0, _genes, msg.sender);
    }

    function breed(uint256 _dadId, uint256 _mumId) external {
        Kitty storage mum = kitties[_mumId];
        Kitty storage dad = kitties[_dadId];
        uint256 newGen = mum.generation + 1;
        _createKitty(_mumId, _dadId, newGen, _mixGenes(mum.genes, dad.genes), msg.sender);
    }

    function _createKitty(uint256 _mumId, uint256 _dadId, uint256 _generation, uint256 _genes, address _owner) internal returns (uint256) {
        Kitty memory _kitty = Kitty({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });
        kitties.push(_kitty);
        uint256 newKittenId = kitties.length - 1;
        emit Birth(_owner, newKittenId, _mumId, _dadId, _genes);
        kittyIndexToOwner[newKittenId] = _owner;
        ownershipTokenCount[_owner]++;
        return newKittenId;
    }

    function transfer(address _to, uint256 _kittyId) external {
        ownershipTokenCount[msg.sender]--;
        ownershipTokenCount[_to]++;
        kittyIndexToOwner[_kittyId] = _to;
    }

    function _mixGenes(uint256 _genes1, uint256 _genes2) internal pure returns (uint256) {
        return (_genes1 + _genes2) / 2;
    }
}