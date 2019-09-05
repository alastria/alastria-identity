
const Web3 = require('web3')
const fs = require('fs')
const solc = require('solc')
const ora = require('ora')
const truffleFlattener = require('truffle-flattener')
// const adminPath = './mocked-identity-keys/admin-6e3976aeaa3a59e4af51783cc46ee0ffabc5dc11';

let web3
let nodeUrl = 'http://63.33.206.111/rpc'
// let nodeUrl = 'http://127.0.0.1:8545'

web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl))

let solidityEidas = fs.readFileSync('../../contracts/libs/Eidas.sol', 'utf8')
let solidityManager = fs.readFileSync('./ContractsFlattened.sol', 'utf8')
let address = web3.eth.accounts[0]
let contractEidas, eidasData, managerData, eidasAddress
let files = [
  '../../contracts/identityManager/AlastriaIdentityManager.sol'
]
let filePath = './ContractsFlattened.sol'
let writeTofile = true

function unlockAccount() {
  let address = web3.eth.accounts[0]
  // let password = ''
  let password = 'Passw0rd'
  web3.personal.unlockAccount(address, password)
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
        console.log('Contrato Eidas minado! ' + contract.address);
        console.log('Tx Hash ' + contract.transactionHash);
        resolve(contract.address)
      }
    })
  })
}

function deployManager(address, compiled, contractEidas) {
  console.log('Deploying Manager Contract ...')
  return new Promise((resolve, reject) => {
    let symbol = "__:Eidas________________________________"
    let eidasAddress = contractEidas.substr(2)
    let contractObject

    compiled.map(item => {
      if(item['name'] === 'AlastriaIdentityManager') {
        contractObject = item
      }
    })

    let hexByteCode = `0x${contractObject.hexBytecode.split(symbol).join(eidasAddress)}`
    let abi = contractObject.abi

    let contractFactory = web3.eth.contract(abi);
    contractFactory.new({
      from: address,
      data: hexByteCode,
      gas: 30000000
    }, function(e, contract) {
      if(typeof contract.address !== 'undefined') {
        console.log('Contrato Identity Manager minado! ' + contract.address);
        console.log('Tx Hash ' + contract.transactionHash);
        resolve(contract.address)
      }
    })
  })
}

function saveDataInFile(address, data) {
  console.log('Saving contract data ...')
  let contractAbiName, contracInfo, type
  let urlABI = 'https://github.com/alastria/alastria-identity/blob/develop/contracts/abi/'
  let contractName = data.name
  let contractABI = JSON.stringify(data.abi)
  if (contractName == 'Eidas') {
    type = 'libs'
    contractAbiName = `__contracts_${type}_${contractName}_sol_${contractName}.abi`
    contracInfo = `| ${contractName} | ${address} | ${urlABI}${contractAbiName} |\n`
    fs.writeFile(`../../contracts/abi/${contractAbiName}`, contractABI, error => {
      if(error) throw error;
      console.log('Eidas ABI saved successfully!!')
    })
    fs.appendFile('../../contracts/ContractInfo.md', contracInfo, function(err) {
      if(err) throw err;
      console.log('Contract data saved!!')
    })
  } else {
    type = 'identityManager'
    contractAbiName = `__contracts_${type}_${contractName}_sol_${contractName}.abi`
    contracInfo = `| ${contractName} | ${address} | ${urlABI}${contractAbiName} |\n`
    fs.writeFile(`../../contracts/abi/${contractAbiName}`, contractABI, error => {
      if(error) throw error;
      console.log('Eidas ABI saved successfully!!')
    })
    fs.appendFile('../../contracts/ContractInfo.md', contracInfo, function(err) {
      if(err) throw err;
      console.log('Contract data saved!!')
    })
  }

}

function findEidas() {
  return new Promise((resolve, reject) => {
    try {
      let file = fs.readFileSync('../../contracts/ContractInfo.md', 'utf-8')
      let eidasName, eidasAddress
      let findEidas = file.search('Eidas')
      if (findEidas > 0) {
        eidasName = file.substr(71, 5)
        eidasAddress = file.substr(79, 42)
      }

      let eidasData = {
        name: eidasName,
        address: eidasAddress
      }
      resolve(eidasData)
    } catch(error) {
      eidasData = {
        name: '',
        address: ''
      }
      resolve(eidasData)
    }
    
  })
}

function init() {
  console.log('[Funtion Init] ---> Initciando el Script de despliegue de contratos')
  flatten(files, filePath, writeTofile)
  .then(flattenedFile => {
    console.log('Starting compiling contracs')
    findEidas()
    .then(eidas => {
      eidasAddress = eidas.address ? eidas.address : ''
      if(eidas.name != 'Eidas') {
        console.log('Contract Eidas not found. Compiling and deploying Eidas contract')
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
                web3.personal.lockAccount(address)
                saveDataInFile(contractManager, managerData)
                console.log('Contract Manager deployed successfuly. Address: ', contractManager)
              })
              .catch(error => {
                web3.personal.lockAccount(address)
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
      } else {
        console.log('Contract Eidas found. Compiling and deploying Manager contract')
        compileContract(solidityManager)
        .then(compiledManager => {
          compiledManager.map(item => {
            if(item['name'] === 'AlastriaIdentityManager') {
              managerData = item
            }
          })
          console.log('Contract Manager compiled successfuly')
          unlockAccount()
          deployManager(address, compiledManager, eidasAddress)
          .then(contractManager => {
            web3.personal.lockAccount(address)
            saveDataInFile(contractManager, managerData)
            console.log('Contract Manager deployed successfuly. Address: ', contractManager)
          })
          .catch(error => {
            web3.personal.lockAccount(address)
            console.log('ERROR ------> ', error)
          })
        })
        .catch(error => {
          console.log('ERROR ------> ', error)
        })
      }
    })
  })
  
}

init()

