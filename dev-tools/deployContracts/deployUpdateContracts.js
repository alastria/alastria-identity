
const Web3 = require('web3')
const fs = require('fs')
const solc = require('solc')
const adminPath = './mocked-identity-keys/admin-6e3976aeaa3a59e4af51783cc46ee0ffabc5dc11';
const { networks } = require('../../truffle');

let web3
let nodeUrl = 'http://127.0.0.1:8545'

// const web3 = new Web3(new Web3.providers.HttpProvider(`http://${networks.alastria.host}:${networks.alastria.port}`));
web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl))

let solidityEidas = fs.readFileSync('../../contracts/libs/Eidas.sol', 'utf8')
let solidityManager = fs.readFileSync('./ContractsFlattened.sol', 'utf8')

function unlockAccount() {
  // let addressAdmin = `0x${JSON.parse(fs.readFileSync(adminPath, 'utf8')).address}`
  // let passwordAdmin = 'Passw0rd'
  let address = web3.eth.accounts[0]
  let password = ''
  web3.personal.unlockAccount(address, password, '0x0')
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
    let hexByteCode = "0x" + contractObject.hexBytecode
    let abi = contractObject.abi
    
    let contractFactory = web3.eth.contract(abi);
    contractFactory.new({
      from: address,
      data: hexByteCode,
      gas: 5000000
    }, function(e, contract) {
      if (!e) {
        setTimeout(function() {
          if(contract.address) {
            resolve(contract.address)
          }
        }, 500)
      } else {
        console.log(`Contract not deployed -> ${e}`);
        reject(e);
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

    let hexByteCode = "0x" + contractObject.hexBytecode.split(symbol).join(eidasAddress)
    let abi = contractObject.abi
    
    let contractFactory = web3.eth.contract(abi);
    contractFactory.new({
      from: address,
      data: hexByteCode,
      gas: 5000000
    }, function(e, contract) {
      if (!e) {
        setTimeout(function() {
          if(contract.address) {
            resolve(contract.address)
          }
        }, 500)
      } else {
        console.log(`Contract not deployed -> ${e}`);
        reject(e);
      }
    })
  })
}

function saveDataInFile(address, data) {
  console.log('Saving contract data ...')
  // let contract = {
  //   name: data.name,
  //   address: address, 
  //   abi: data.abi
  // }
  // fs.appendFile('ContractInfo.json', JSON.stringify(contract), function(err) {
  
    let contractInfo = `${data.name} -- ${address} -- ${JSON.stringify(data.abi)}\n\n`
  fs.appendFile('ContractInfo.md', contractInfo, function(err) {
    if(err) throw err;
    console.log('Contract data saved!!')
  })
}

function findEidas() {
  return new Promise((resolve, reject) => {
    try {
      // let file = fs.readFileSync('ContractInfo.json', 'utf-8')
      // let eidasName = file.substr(9, 5)
      // let eidasAddress = file.substr(27,42)
      let file = fs.readFileSync('ContractInfo.md', 'utf-8')
      let eidasName = file.substr(0, 5)
      let eidasAddress = file.substr(9, 42)
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
  let address = web3.eth.accounts[0]
  let eidasAddress
  let contractEidas, eidasData, managerData
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
              saveDataInFile(contractManager, managerData)
              console.log('Contract Manager deployed successfuly. Address: ', contractManager)
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
        deployManager(address, compiledManager, eidasAddress)
        .then(contractManager => {
          saveDataInFile(contractManager, managerData)
          console.log('Contract Manager deployed successfuly. Address: ', contractManager)
        })
        .catch(error => {
          console.log('ERROR ------> ', error)
        })
      })
      .catch(error => {
        console.log('ERROR ------> ', error)
      })
    }
  })
  
}

init()

