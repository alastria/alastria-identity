var AlastriaPublicKeyRegistry = artifacts.require('./AlastriaPublicKeyRegistry.sol');
var AlastriaAttestationRegistry = artifacts.require('./AlastriaAttestationRegistry.sol');
var AlastriaClaimRegistry = artifacts.require('./AlastriaClaimRegistry.sol');


module.exports = function(deployer, network, accounts) {
  deployer.deploy(AlastriaPublicKeyRegistry, accounts[0]);
  deployer.deploy(AlastriaAttestationRegistry, accounts[0]);
  deployer.deploy(AlastriaClaimRegistry, accounts[0]);
};
