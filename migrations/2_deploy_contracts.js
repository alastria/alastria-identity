var registry = artifacts.require("./contracts/UportRegistry.sol");
var idManager = artifacts.require("./contracts/MetaIdentityManager.sol");
var proxy = artifacts.require("./contracts/Proxy.sol");

module.exports = function(deployer) {
  deployer.deploy(registry);
  deployer.deploy(idManager);
  deployer.deploy(proxy);
};
