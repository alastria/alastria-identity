var Eidas = artifacts.require("./contracts/Eidas.sol");
var AlastriaIdentityManager = artifacts.require("./contracts/AlastriaIdentityManager.sol");
var AlastriaIdentityProvider = artifacts.require("./contracts/AlastriaIdentityProvider.sol");
var AlastriaIdentityAttestator = artifacts.require("./contracts/AlastriaIdentityAttestator.sol");

module.exports = function(deployer) {

  if (AlastriaIdentityManager.network_id === '19535753591') {
    web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
  }

  deployer.deploy(Eidas);
  deployer.link(Eidas, AlastriaIdentityAttestator);
  deployer.link(Eidas, AlastriaIdentityManager);
  deployer.deploy(AlastriaIdentityProvider);
  deployer.deploy(AlastriaIdentityAttestator);

  const USER_TIME_LOCK = 3600
  const ADMIN_TIME_LOCK = 129600
  const ADMIN_RATE = 1200

  deployer.deploy(AlastriaIdentityManager, USER_TIME_LOCK, ADMIN_TIME_LOCK, ADMIN_RATE);
};
