require('dotenv').config();
const KittyCore = artifacts.require("KittyCore");
const assert = require("chai").assert;

contract('KittyCore', accounts => {
  let contractInstance;

  before(async () => {
    contractInstance = await KittyCore.deployed();
  });

  it('should create a new virtual cat', async () => {
    const result = await contractInstance.createPromoKitty(
      123456789,
      accounts[0],
      { from: accounts[0] }
    );

    assert.exists(result.tx);
  });

  it('should allow breeding of two cats and emit a birth event', async () => {
    await contractInstance.createPromoKitty(123, accounts[0], { from: accounts[0] });
    await contractInstance.createPromoKitty(456, accounts[0], { from: accounts[0] });

    const kittyOneId = 1;
    const kittyTwoId = 2;

    const breed = await contractInstance.breed(kittyOneId, kittyTwoId, { from: accounts[0] });
    const birthEvent = breed.logs[0];

    assert.equal(birthEvent.event, 'Birth');
  });

  it('should transfer a cat to another owner', async () => {
    const sender = accounts[0];
    const receiver = accounts[1];

    await contractLike.createPromoKitty(789, sender, { from: sender });

    const kittyId = 3;

    await contractInstance.transfer(receiver, kittyId, { from: sender });
    
    const newOwner = await contractInstance.ownerOf(kittyId);
    
    assert.equal(newOwner, receiver);
  });
});