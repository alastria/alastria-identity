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
var config = require('./config')
//const { encodeCall } = require('@openzeppelin/upgrades');


module.exports = async function(deployer, network, accounts) {
  async function saveABIs(data) {
    if (network == 'development'){
      return
    }
    let contractAbiName, type
    let contractName = data.contract_name
    let contractABI = JSON.stringify(data.abi)
    if (contractName == 'Eidas' || contractName == 'Owned') {
      type = 'libs'
    } else if (contractName === 'AlastriaCredentialRegistry' || contractName === 'AlastriaPresentationRegistry' || contractName === 'AlastriaPublicKeyRegistry') {
      type = 'registry'
    } else {
      type = 'identityManager'
    }
    contractAbiName = `__contracts_${type}_${contractName}_sol_${contractName}.abi`
    fs.writeFileSync(`${config.abisPath}${contractAbiName}`, contractABI) ;
    contractAbiName = `__contracts_${type}_${contractName}_sol_${contractName}.abi`
    fs.writeFileSync(`${config.abisPath}${contractAbiName}`, contractABI)
  }

  async function saveAddresesInfo(address, contracsName) {
    if (network == 'development'){
      return
    }
    let contracInfo, contractInfoHeaders
    let urlABI = config.urlABI
    let contractName = contracsName
    contractInfoHeaders = `| Contract Name | Address | ABI |\n| :------------ | :-------| :--- |\n`
    if (contractName == 'Eidas' || contractName == 'Owned') {
      type = 'libs'
    } else if (contractName === 'AlastriaCredentialRegistry' || contractName === 'AlastriaPresentationRegistry' || contractName === 'AlastriaPublicKeyRegistry') {
      type = 'registry'
    } else {
      type = 'identityManager'
    }
    contractAbiName = `__contracts_${type}_${contractName}_sol_${contractName}.abi`
    contracInfo = `| ${contractName} | ${address} | ${urlABI}${contractAbiName} |\n`
      console.log(config.contractInfoPath, contracInfo)
    if (contractName == 'Eidas') {
      await fs.writeFileSync(config.contractInfoPath, contractInfoHeaders)
      await fs.appendFileSync(config.contractInfoPath, contracInfo)
      console.log(`${contractName} address info saved!`)
    } else {
      await fs.appendFileSync(config.contractInfoPath, contracInfo)
      console.log(`${contractName} address info saved!`)
    }
  }


  if (AlastriaIdentityManager.network_id === '19535753591') {
    web3.personal.unlockAccount(web3.eth.accounts[0], "Passw0rd");
  }

  await saveABIs(Eidas)
  let eidas = await Eidas.deployed()
  await saveAddresesInfo(eidas, config.eidas)

  await deployer.link(Eidas, AlastriaIdentityIssuer);
  await deployer.link(Eidas, AlastriaIdentityManager);

  let serviceProvider =await AlastriaIdentityServiceProvider.new();
  console.log("serviceProvider deployed: ", serviceProvider.address)
  await saveABIs(AlastriaIdentityServiceProvider)
  await saveAddresesInfo(serviceProvider.address, config.serviceProvider)
  
  let identityIssuer = await AlastriaIdentityIssuer.new();
  console.log("identityIssuer deployed: ", identityIssuer.address)
  await saveABIs(AlastriaIdentityIssuer)
  await saveAddresesInfo(identityIssuer.address, config.identityIssuer)

  let alastriaProxy = await AlastriaProxy.new()
  console.log("alastriaProxy deployed: ", alastriaProxy.address)
  await saveABIs(AlastriaProxy)
  await saveAddresesInfo(alastriaProxy.address , config.alastriaProxy)

  let identityEntity = await AlastriaIdentityEntity.new()
  console.log("identityEntity deployed: ", identityEntity.address)
  await saveABIs(AlastriaIdentityEntity)
  await saveAddresesInfo(identityEntity.address , config.identityEntity)
  
  /*const USER_TIME_LOCK = 3600
  const ADMIN_TIME_LOCK = 129600
  const ADMIN_RATE = 1200

  deployer.deploy(AlastriaIdentityManager, USER_TIME_LOCK, ADMIN_TIME_LOCK, ADMIN_RATE);*/
  let credentialRegistry = await AlastriaCredentialRegistry.new('0x0000000000000000000000000000000000000000')
  console.log("credentialRegistry deployed: ", credentialRegistry.address)
  await saveABIs(AlastriaCredentialRegistry)
  await saveAddresesInfo(credentialRegistry.address, config.credential)

  let presentationRegistry = await AlastriaPresentationRegistry.new('0x0000000000000000000000000000000000000000')
  console.log("presentationRegistry deployed: ", presentationRegistry.address)
  await saveABIs(AlastriaPresentationRegistry)
  await saveAddresesInfo(presentationRegistry.address, config.presentation)

  let publicKeyRegistry = await AlastriaPublicKeyRegistry.new()
  let proxy = await Proxy.new(publicKeyRegistry.address, accounts[0], [])
  publicKeyRegistry = await AlastriaPublicKeyRegistry.at(proxy.address)
  await publicKeyRegistry.initialize('0x0000000000000000000000000000000000000000', {from: accounts[1]})
  console.log("publicKeyRegistry deployed: ", publicKeyRegistry.address)
  await saveABIs(AlastriaPublicKeyRegistry)
  await saveAddresesInfo(publicKeyRegistry.address, config.publicKey)

  identityManager = await AlastriaIdentityManager.new(0, credentialRegistry.address, presentationRegistry.address, publicKeyRegistry.address);
  console.log("identityManager deployed: ", identityManager.address)
  await saveABIs(AlastriaIdentityManager)
  await saveAddresesInfo(identityManager.address, config.manager)
};


