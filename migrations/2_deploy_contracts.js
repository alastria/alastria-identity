var aim = artifacts.require("./contracts/AlastriaIdentityManager.sol");
var bim = artifacts.require("./contracts/BasicIdentityManager.sol");
var proxy = artifacts.require("./contracts/Proxy.sol");

module.exports = function(deployer) {
  deployer.deploy(aim);
  deployer.deploy(bim);
  deployer.deploy(proxy);
};
