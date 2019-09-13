
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
let address = web3.eth.accounts[2]
// let password = ''
let password = 'Passw0rd'
let files = [
  '../../contracts/identityManager/AlastriaIdentityManager.sol'
]
let filePath = './ContractsFlattened.sol'
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

function deploy(address, compiled, contractEidas) {
  console.log('Deploying Contract ...')
  return new Promise((resolve, reject) => {
    let symbol = "__:Eidas________________________________"
    let eidasAddress
    let hexByteCode, abi, contractObject
    compiled.map(item => {
      if(item['name'] === 'AlastriaIdentityManager') {
        contractObject = item
        eidasAddress = contractEidas.substr(2)
        hexByteCode = `0x${item.hexBytecode.split(symbol).join(eidasAddress)}`
      } else {
        contractObject = item
        hexByteCode = `0x${item.hexBytecode}`
      }
    })
    abi = contractObject.abi
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

function saveDataInFile(address, data) {
  console.log('Saving contract data ...')
  let contractAbiName, contracInfo, type
  let urlABI = 'https://github.com/alastria/alastria-identity/blob/develop/contracts/abi/'
  let contractName = data.name
  let contractABI = JSON.stringify(data.abi)
  if (contractName == 'Eidas' || contractName === 'Owned') {
    type = 'libs'
  } else if (contractName === 'AlastriaCredentialRegistry' || contractName === 'AlastriaPresentationRegistry' || contractName === 'AlastriaPublicKeyRegistry') {
    type = 'registry'
  } else {
    type = 'identityManager'
  }
  contractAbiName = `__contracts_${type}_${contractName}_sol_${contractName}.abi`
  contracInfo = `| ${contractName} | ${address} | ${urlABI}${contractAbiName} |\n`
  fs.writeFile(`../../contracts/abi/${contractAbiName}`, contractABI, error => {
    if(error) throw error;
    console.log(`${type} ABI saved successfully!!`)
  })
  fs.appendFile('../../contracts/ContractInfo.md', contracInfo, function(err) {
    if(err) throw err;
    console.log('Contract data saved!!')
  })
}

function init() {
  flatten(files, filePath, writeTofile)
  .then(flattenedFile => {
    console.log('Starting compiling contracs')
    compileContract(solidityEidas)
    .then(compiledEidas => {
      unlockAccount()
      deploy(address, compiledEidas)
      .then(eidasAddress => {
        compileContract(solidityManager)
        .then(compiledContracts => {
          compiledContracts.map(item => {
            console.log('Contract compiled successfuly')
            deploy(address, compiledContracts, eidasAddress)
            .then(contractAddress => {
              lockAcount()
              saveDataInFile(contractAddress, item)
              console.log(`Contract ${item.name} deployed successfuly. Address:  ${contractAddress}`)
            })
            .catch(error => {
              lockAcount()
              console.log('ERROR ------> ', error)
            })
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
  
}

init()

