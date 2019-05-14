// Libraries
const fs = require('fs');
const path = require('path');
const solc = require('solc');
const log = require('../helpers/logger');

// Variables
const appRoot = `${__dirname}/../../`;
const accountIdPath = path.resolve(appRoot, 'contracts', 'AccountId.sol');
const accountIdFactoryPath = path.resolve(appRoot, 'contracts', 'AccountIdFactory.sol');
const communicationChannelPath = path.resolve(appRoot, 'contracts', 'CommunicationChannel.sol');
const globalFactoryPath = path.resolve(appRoot, 'contracts', 'GlobalFactory.sol');
const accountIdSource = fs.readFileSync(accountIdPath, 'UTF-8');
const accountIdFactorySource = fs.readFileSync(accountIdFactoryPath, 'UTF-8');
const communicationChannelSource = fs.readFileSync(communicationChannelPath, 'UTF-8');
const globalFactorySource = fs.readFileSync(globalFactoryPath, 'UTF-8');

// 'solc' compiler input
const input = {
  language: 'Solidity',
  sources: {
    'AccountId.sol': {
      content: accountIdSource,
    },
    'AccountIdFactory.sol': {
      content: accountIdFactorySource,
    },
    'CommunicationChannel.sol': {
      content: communicationChannelSource,
    },
    'GlobalFactory.sol': {
      content: globalFactorySource,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

/* function findImportedSmartContracts (importPath) {
    if (importPath === 'AccountId.sol') {
      console.log('findImportedSmartContracts1');
      return { contents: accountIdSource };
    }
    if (importPath === 'CommunicationChannel.sol') {
      console.log('findImportedSmartContracts2');
      return { contents: communicationChannelSource };
    }
    if (importPath === 'AccountIdFactory.sol') {
        console.log('findImportedSmartContracts3');
      return { contents: accountIdFactorySource };
    }
    return { error: 'File not found' };
} */

// PUBLIC METHOD
function compileSmartContracts() {
  log.TraceHeader('compileSmartContracts', []);
  try {
    const output = JSON.parse(solc.compileStandardWrapper(JSON.stringify(input)));
    // fs.writeFile(`${appRoot}/contracts/output.json`, JSON.stringify(output), (err) => {
    //   if (err) {
    //     return log.Err(`Error saving compilation output: ${err}`);
    //   }
    //   log.Info(`New compiled output.json was saved in ${appRoot}contracts/output.json`);
    // });
    for (const contractName in output.contracts['GlobalFactory.sol']) {
      var binGlobalFactory = output.contracts['GlobalFactory.sol'][contractName].evm.bytecode.object;
      var abiGlobalFactory = output.contracts['GlobalFactory.sol'][contractName].abi;
      var deployedBinGlobalFactory = output.contracts['GlobalFactory.sol'][contractName].evm.deployedBytecode.object;
    }
    for (const contractName in output.contracts['AccountIdFactory.sol']) {
      var binAccountIdFactory = output.contracts['AccountIdFactory.sol'][contractName].evm.bytecode.object;
      var abiAccountIdFactory = output.contracts['AccountIdFactory.sol'][contractName].abi;
      var deployedBinAccountIdFactory = output.contracts['AccountIdFactory.sol'][contractName].evm.deployedBytecode.object;
    }
    for (const contractName in output.contracts['CommunicationChannel.sol']) {
      var binCommunicationChannel = output.contracts['CommunicationChannel.sol'][contractName].evm.bytecode.object;
      var abiCommunicationChannel = output.contracts['CommunicationChannel.sol'][contractName].abi;
      var deployedBinCommunicationChannel = output.contracts['CommunicationChannel.sol'][contractName].evm.deployedBytecode.object;
    }
    for (const contractName in output.contracts['AccountId.sol']) {
      var binAccountId = output.contracts['AccountId.sol'][contractName].evm.bytecode.object;
      var abiAccountId = output.contracts['AccountId.sol'][contractName].abi;
      var deployedBinAccountId = output.contracts['AccountId.sol'][contractName].evm.deployedBytecode.object;
    }
    const compiledInfo = {
      binGlobalFactory,
      abiGlobalFactory,
      deployedBinGlobalFactory,
      binAccountIdFactory,
      abiAccountIdFactory,
      deployedBinAccountIdFactory,
      binCommunicationChannel,
      abiCommunicationChannel,
      deployedBinCommunicationChannel,
      binAccountId,
      abiAccountId,
      deployedBinAccountId,
    };
    return compiledInfo;
  } catch (err) {
    log.Err(err);
    throw err;
  }
}

module.exports = {
  compileSmartContracts,
};
