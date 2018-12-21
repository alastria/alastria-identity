var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  
  if (Migrations.network_id === '19535753591') {
    web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
  }

  deployer.deploy(Migrations);
};
