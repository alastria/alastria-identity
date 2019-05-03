var Eidas = artifacts.require("contracts/libs/Eidas.sol");
var AlastriaIdentityManager = artifacts.require("contracts/identityManager/AlastriaIdentityManager.sol");
var AlastriaIdentityServiceProvider = artifacts.require("contracts/identityManager/AlastriaIdentityServiceProvider.sol");
var AlastriaIdentityIssuer = artifacts.require("contracts/identityManager/AlastriaIdentityIssuer.sol");

module.exports = function(deployer) {

  if (AlastriaIdentityManager.network_id === '19535753591') {
    web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
  }

  deployer.deploy(Eidas);
  deployer.link(Eidas, AlastriaIdentityIssuer);
  deployer.link(Eidas, AlastriaIdentityManager);
  deployer.deploy(AlastriaIdentityServiceProvider);
  deployer.deploy(AlastriaIdentityIssuer);

  /*const USER_TIME_LOCK = 3600
  const ADMIN_TIME_LOCK = 129600
  const ADMIN_RATE = 1200

  deployer.deploy(AlastriaIdentityManager, USER_TIME_LOCK, ADMIN_TIME_LOCK, ADMIN_RATE);*/
  deployer.deploy(AlastriaIdentityManager, 0);
};
