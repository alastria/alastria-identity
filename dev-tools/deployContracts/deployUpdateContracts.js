
const Web3 = require('web3')
const fs = require('fs')
const solc = require('solc')
const ora = require('ora')
const truffleFlattener = require('truffle-flattener')

let rawdata = fs.readFileSync('./config.json')
let config = JSON.parse(rawdata)

let web3
let nodeUrl = config.nodeURLLocal  // you can change the URL node in config.

web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl))

let solidityEidas = fs.readFileSync(config.contractEidas, 'utf8')
let solidityManager = fs.readFileSync(config.contractManager, 'utf8')
let address = web3.eth.accounts[config.addressPosition]  // yopu can change the address in config
let password = config.addressPwdLocal  // you can change the password address in config
let files = config.filesManager
let filePath = config.filePath
let writeTofile = true

function unlockAccount() {
  web3.personal.unlockAccount(address, password)
}

function lockAcount() {
  web3.personal.lockAccount(address)
}

function flatten(files, filePath, writeTofile) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Flattening .sol file ${filePath} ...`).start()
    truffleFlattener(files)
    .then(flattened => {
      if(writeTofile) {
        fs.writeFileSync(filePath, flattened)
        spinner.succeed()
        console.log(`Flattened file ${filePath} written!`)
        resolve(flattened)
      } else {
        spinner.fail()
      }
    })
    .catch(error => {
      spinner.fail()
      reject(error)
    })
  })
}

function compileContract(solidity) {
  console.log('Compiling Contract ...')
  return new Promise((resolve, reject) => {
    let output = solc.compile(solidity, 1);
    let results = {};
    if (!output.contracts) {
      console.log(`Error compiling solidity -> ${output.errors.toString()}`);
      reject(output.errors.toString());
    } else {
      var promises = [];
      for(var contractName in output.contracts){
        var result = {
          name: contractName.substr(1, contractName.length).split(':').pop(),
          hexBytecode: output.contracts[contractName].bytecode,
          abi: JSON.parse(output.contracts[contractName].interface)
        };
        var parseContractName = contractName.split(':'); //Este split es porque el solc añade : al nombre del contrato
        if(parseContractName.length > 1){
          results[parseContractName[1]] = result;
        }
        else{
          results[parseContractName[0]] = result;
        }
        promises.push(result)
      }
      resolve(promises)
    }
  })
}

function deployEidas(address, compiled) {
  console.log('Deploying Eidas Contract ...')
  return new Promise((resolve, reject) => {
    let contractObject
    compiled.map(item => {
      if(item['name'] === 'Eidas') {
        contractObject = item
      }
    })
    let hexByteCode = `0x${contractObject.hexBytecode}`
    let abi = contractObject.abi
    let contractFactory = web3.eth.contract(abi);
    contractFactory.new({
      from: address,
      data: hexByteCode,
      gas: 200000
    }, function(e, contract) {
      if(typeof contract.address !== 'undefined') {
        resolve(contract.address)
      }
    })
  })
}

function deployManager(address, compiled, contractEidas) {
  console.log('Deploying Manager Contract ...')
  return new Promise((resolve, reject) => {
    let symbol = config.symbolEidas
    let eidasAddress = contractEidas.substr(2)
    let hexByteCode, abi, contractObject
    compiled.map(item => {
      if(item['name'] === 'AlastriaIdentityManager') {
        contractObject = item
      }
    })
    hexByteCode = `0x${contractObject.hexBytecode.split(symbol).join(eidasAddress)}`
    abi = contractObject.abi
    let contractFactory = web3.eth.contract(abi);
    contractFactory.new({
      from: address,
      data: hexByteCode,
      gas: 6721975
    }, function(e, contract) {
      if(typeof contract.address !== 'undefined') {
        resolve(contract.address)
      }
    })
  })
}

function saveDataInFile(address, data) {
  console.log('Saving contract data ...')
  let contractAbiName, contracInfo, contractInfoHeaders, type
  let urlABI = config.urlABI
  let contractName = data.name
  let contractABI = JSON.stringify(data.abi)
  contractInfoHeaders = `| Contract Name | Address | ABI |\n| :------------ | :-------| :--- |\n`
  contracInfo = `| ${contractName} | ${address} | ${urlABI}${contractAbiName} |\n`
  if (contractName == 'Eidas') {
    type = 'libs'
    contractAbiName = `__contracts_${type}_${contractName}_sol_${contractName}.abi`
    fs.writeFile(`${config.abisPath}${contractAbiName}`, contractABI, error => {
      if(error) throw error;
      console.log(`${type} ABI saved successfully!!`)
    })
    fs.writeFile(config.contractInfoPath, contractInfoHeaders, function(err) {
      if(err) throw err;
    })
    fs.appendFile(config.contractInfoPath, contracInfo, function(err) {
      if(err) throw err;
      console.log('Contract data saved!!')
    })
  } else {
    type = 'identityManager'
    contractAbiName = `__contracts_${type}_${contractName}_sol_${contractName}.abi`
    fs.writeFile(`${config.abisPath}${contractAbiName}`, contractABI, error => {
      if(error) throw error;
      console.log(`${type} ABI saved successfully!!`)
    })
    fs.appendFile(config.contractInfoPath, contracInfo, function(err) {
      if(err) throw err;
      console.log('Contract data saved!!')
    })
  }
}

function init() {
  flatten(files, filePath, writeTofile)
  .then(flattenedFile => {
    console.log('Starting compiling contracs')
    compileContract(solidityEidas)
    .then(compiledEidas => {
      compiledEidas.map(item => {
        if(item['name'] === 'Eidas') {
          eidasData = item
        }
      })
      console.log('Contract Eidas compiled successfuly')
      unlockAccount()
      deployEidas(address, compiledEidas)
      .then(eidas => {
        console.log('Contract Eidas deployed successfuly. Address: ', eidas)
        contractEidas = eidas
        saveDataInFile(contractEidas, eidasData)
        compileContract(solidityManager)
        .then(compiledManager => {
          compiledManager.map(item => {
            if(item['name'] === 'AlastriaIdentityManager') {
              managerData = item
            }
          })
          console.log('Contract Manager compiled successfuly')
          deployManager(address, compiledManager, contractEidas)
          .then(contractManager => {
            lockAcount()
            saveDataInFile(contractManager, managerData)
            console.log('Contract Manager deployed successfuly. Address: ', contractManager)
          })
          .catch(error => {
            lockAcount()
            console.log('ERROR ------> ', error)
          })
        })
        .catch(error => {
          console.log('ERROR ------> ', error)
        })
      })
      .catch(error => {
        console.log('ERROR ------> ', error)
      })
    })
    .catch(error => {
      console.log('ERROR ------> ', error)
    })
  })
  .catch(error => {
    console.log('ERROR ------> ', error)
  })
}

init()