var AlastriaPublicKeyRegistry = artifacts.require('./AlastriaPublicKeyRegistry.sol');
var AlastriaAttestationRegistry = artifacts.require('./AlastriaAttestationRegistry.sol');
var AlastriaPresentationRegistry = artifacts.require('./AlastriaPresentationRegistry.sol');


module.exports = function(deployer, network, accounts) {
  deployer.deploy(AlastriaPublicKeyRegistry, accounts[0]);
  deployer.deploy(AlastriaAttestationRegistry, accounts[0]);
  deployer.deploy(AlastriaPresentationRegistry, accounts[0]);
};
