require('dotenv').config();
const KittyCore = artifacts.require("KittyCore");
const assert = require("chai").assert;

contract('KittyCore', accounts => {
  let contractInstance;

  before(async () => {
    contractInstance = await KittyCore.deployed();
    
    // Pre-create promo kitties to be used in multiple tests
    await contractInstance.createPromoKitty(123, accounts[0], { from: accounts[0] });
    await contractInstance.createPromoKitty(456, accounts[0], { from: accounts[0] });
    await contractInstance.createPromoKitty(789, accounts[0], { from: accounts[0] });
  });

  it('should create a new virtual cat', async () => {
    const result = await contractInstance.createPromoKitty(
      123456789,
      accounts[0],
      { from: accounts[0] }
    );

    assert.exists(result.tx);
  });
  
  // This test now utilizes pre-created kitties
  it('should allow breeding of two cats and emit a birth event', async () => {
    const kittyOneId = 1;
    const kittyTwoId = 2;

    const canBreed = await contractInstance.canBreedWith(kittyOneId, kittyTwoId);
    assert.isTrue(canBreed, 'These kitties should be able to breed.');

    const breed = await contractInstance.breed(kittyOneId, kittyTwoId, { from: accounts[0] });
    const birthEvent = breed.logs[0];

    assert.equal(birthEvent.event, 'Birth');
  });

  // Utilizes a kitty created in the `before` hook, minimizing the test setup actions
  it('should transfer a cat to another owner', async () => {
    const sender = accounts[0];
    const receiver = accounts[1];
    const kittyId = 3; // Assuming this kitty is already created from the before hook

    await contractInstance.transfer(receiver, kittyId, { from: sender });

    const newOwner = await contractInstance.ownerOf(kittyId);

    assert.equal(newOwner, receiver);
  });

  // Test for breeding capability relies on pre-created kitties
  it('should check if two kitties can breed', async () => {
    const kittyOneId = 1;
    const kittyTwoParId = 2;

    const canBreed = await contractInstance.canBreedWith(kittyOneId, kittyTwoParId);

    assert.isTrue(canBreed, 'Kitties should be able to breed based on implemented logic');
  });
});