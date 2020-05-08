var Eidas = artifacts.require('contracts/libs/Eidas.sol');


module.exports = function(deployer, network, accounts) {
  deployer.deploy(Eidas);
};
