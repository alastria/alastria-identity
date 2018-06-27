var aim = artifacts.require("./contracts/AlastriaIdentityManager.sol");
var bim = artifacts.require("./contracts/BasicIdentityManager.sol");
var proxy = artifacts.require("./contracts/proxy.sol");
var txrelay = artifacts.require("./contracts/TxRelay.sol");
var im = artifacts.require("./contracts/IdentityManager.sol");
var mim = artifacts.require("./contracts/MetaIdentityManager.sol");
var AlastriaRegistry = artifacts.require("./contracts/AlastriaRegistry.sol");
var UportRegistry = artifacts.require("./contracts/UportRegistry.sol");

function deployUport(deployer){
  deployer.deploy(im);
  deployer.deploy(mim);
  deployer.deploy(proxy);
  deployer.deploy(UportRegistry);
  deployer.deploy(txrelay);
};

function deployAlastriaIdentity(deployer){
  deployer.deploy(aim);
  deployer.deploy(bim);
  deployer.deploy(proxy);
  deployer.deploy(AlastriaRegistry);
};

module.exports = function(deployer, network) {

  if (network === 'alastria.uport') {
    deployUport(deployer);
  }
  else if (network === 'alastria.identity') {
    deployAlastriaIdentity(deployer);
  }

};
