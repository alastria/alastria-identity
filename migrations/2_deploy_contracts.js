var AlastriaPublicKeyRegistry = artifacts.require('./AlastriaPublicKeyRegistry.sol');
var AlastriaCredentialRegistry = artifacts.require('./AlastriaCredentialRegistry.sol');
var AlastriaPresentationRegistry = artifacts.require('./AlastriaPresentationRegistry.sol');


module.exports = function(deployer, network, accounts) {
  deployer.deploy(AlastriaPublicKeyRegistry, accounts[0]);
  deployer.deploy(AlastriaCredentialRegistry, accounts[0]);
  deployer.deploy(AlastriaPresentationRegistry, accounts[0]);
};
