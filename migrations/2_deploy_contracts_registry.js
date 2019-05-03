var AlastriaPublicKeyRegistry = artifacts.require('contracts/registry/AlastriaPublicKeyRegistry.sol');
var AlastriaCredentialRegistry = artifacts.require('contracts/registry/AlastriaCredentialRegistry.sol');
var AlastriaPresentationRegistry = artifacts.require('contracts/registry/AlastriaPresentationRegistry.sol');


module.exports = function(deployer, network, accounts) {
  deployer.deploy(AlastriaPublicKeyRegistry, accounts[0]);
  deployer.deploy(AlastriaCredentialRegistry, accounts[0]);
  deployer.deploy(AlastriaPresentationRegistry, accounts[0]);
};
