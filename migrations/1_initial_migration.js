const Migrations = artifacts.require("Migrations");
const CryptoKittiesCore = artifacts.require("CryptoKittiesCore");
const CryptoKittiesSales = artifacts.require("CryptoKittiesSales");

module.exports = function(deployer) {
  deployer.deploy(Migrations)
    .then(() => deployer.deploy(CryptoKittiesCore))
    .then(() => CryptoKittiesCore.deployed())
    .then((coreInstance) => {
        return deployer.deploy(CryptoKittiesSales, coreInstance.address);
    });
};