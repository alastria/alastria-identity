const fs = require('fs')
var Eidas = artifacts.require("contracts/libs/Eidas.sol");
var AlastriaIdentityManager = artifacts.require("contracts/identityManager/AlastriaIdentityManager.sol");
var AlastriaIdentityServiceProvider = artifacts.require("contracts/identityManager/AlastriaIdentityServiceProvider.sol");
var AlastriaIdentityIssuer = artifacts.require("contracts/identityManager/AlastriaIdentityIssuer.sol");
var AlastriaProxy = artifacts.require("contracts/identityManager/AlastriaProxy.sol");
var Proxy = artifacts.require("./contracts/openzeppelin/upgradeability/AdminUpgradeabilityProxy.sol")
var AlastriaIdentityEntity = artifacts.require("contracts/identityManager/AlastriaIdentityEntity.sol");

var AlastriaCredentialRegistry = artifacts.require("contracts/registry/AlastriaCredentialRegistry.sol");
var AlastriaPresentationRegistry  = artifacts.require("contracts/registry/AlastriaPresentationRegistry.sol");
var AlastriaPublicKeyRegistry = artifacts.require("contracts/registry/AlastriaPublicKeyRegistry.sol");

module.exports = function (deployer) {

    deployer.then(
        async () => {
            proxyContractAddresses = ['0x4ed27a121F41c5DEd0fE1B67979eC273D70220E9', '0x918Bc92C68AE9d3CA920e4B08E85D938E0EF4B65']
            await updateContracts(AlastriaCredentialRegistry, proxyContractAddresses);
        }
    );

    async function updateContracts(contractType, proxyContractAddresses){
        let newLogicContract = await contractType.new()
        promises = []
        for (var i=0; i<proxyContractAddresses.length; i++){
            let proxyContract = await ProxyContract.at(proxyContractAddresses[i])
            promises.push(proxyContract.upgradeTo(newLogicContract.address))
        }
        await Promise.all(promises);
    }
}