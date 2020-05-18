
# ALASTRIA IDENTITY 0.1
Self-sovereign identity (SSI) implementation on Alastria network.

At this moment, this solution is being developed and tested for Quorum (Geth) on the Alastria T-Network. More information about its nodes and the network can be found in the [alastria-node repository](https://github.com/alastria/alastria-node). In the future, the objetive is that this works with other Alastria networks such as Parity or Hyperledger Fabric.

A mobile Alastria Wallet on IONIC has been developed as a reference implementation to exploit and explore the self-sovereign identity concept. It has the logic for managing credentials to be stored and sended when required. Also, the app asks for user aceptance. Code is available on the [alastria-wallet repository](https://github.com/alastria/alastria-wallet).

To interact with the identity contracts, there is a library to use from the wallet in the [alastria-identity-lib repository](https://github.com/alastria/alastria-identity-lib).

## Alastria Self-Sovereign Identity Model
To deepen the model, you have all the information in [the wiki](https://github.com/alastria/alastria-identity/wiki). 

## Contracts
Contracts must be deployed by Alastria Core Identity Team. The version, the addresses and the ABIs of the deployed contracts are always updated at [ContractInfo.md](https://github.com/alastria/alastria-identity/blob/develop/contracts/ContractInfo.md) and at the [contracts/abi](https://github.com/alastria/alastria-identity/tree/develop/contracts/abi) folder. If you want to deploy them in your test-environment you can use [dev-tools/deployContracts](https://github.com/alastria/alastria-identity/tree/develop/dev-tools/deployContracts).

The [GIST ID to open these smart contracts on Remix](https://remix.ethereum.org/#version=soljson-v0.4.23+commit.124ca40d.js&optimize=false&gist=65747824fd972fcde14bac5101489032) is 65747824fd972fcde14bac5101489032. Any contribution must follow the code quality rules for developers.

This SSI model has been implemented with three groups of contracts:
### 1. Identity Manager
|Contract      | What it does          | 
| :------------- |:-------------| 
| AlastriaIdentityManager.sol     |It generates access tokens, creates identities, deploys an AlastriaProxy for each identity and sends transactions through the proxy of the sender| 
| AlastriaProxy.sol     |It is the Alastria ID itself. Only receives transactions from the IdentityManager and resends them to the target  | 
| AlastriaIdentityIssuer.sol     | It keeps a registry of the issuers identities | 
| AlastriaIdentityServiceProvider.sol     |It keeps a registry of the service providers identities | 
| AlastriaIdentityEntity.sol     |It keeps a registry of the entities | 

### 2. Registry
|Contract      | What it does          | 
|:------------- |:-------------| 
| AlastriaCredentialRegistry.sol     |It manages all the credentials and keeps the registry and the status | 
| AlastriaPresentationRegistry.sol     |It manages all the presentations and keeps the registry and the status | 
| AlastriaPublicKeyRegistry.sol     | It manages all the public keys and keeps the registry | 

### 3. Libs 
 The previous contracts use some libraries which are:
 
| Contract      | What it does          | 
|:------------- |:-------------| 
| Eidas.sol     | It manages Eidas level of assurance for credentials| 
| Owned.sol     | It assures that just the account which deployed a contract can update the version | 

## Up & Running
Download and install:
```
$ git clone https://github.com/alastria/alastria-identity.git
$ cd alastria-identity
$ npm install
```

## Developers tools
On the dev-tools directory you can find some interesting functionalities for developers and quick testing:

| dev-tool      | What it does          | 
|:------------- |:-------------| 
| createFakeIdentities     | Creates some fake Alastria identities to play with. You already have 5 mock-identities to play with! | 
| deployContracts      | Deploys the contracts on the chosen network and, if it is Alastria T-Network, it updates their address, ABI and version on this repository|  
| serviceprovider | Service Provider site, capable of doing login and sending credentials |   

## How to test AlastriaID compliant
As the AlastriaID is a ID Model, plus an Reference Implementation of the SC and APIs and, additionally, a demo wallet and a demo entity provider, it is highly recommended that all the identity projects that will aim to use the AlastriaID Model or even the SC or the API, will pass a test to verify compatibility with the AlastriaID reference implementation.
This test will be detailed soon to be used by all the projects.

## Need Help?
Our identity core team will be happy to listen to you at [slack #identidaddigital](https://github.com/alastria/alastria-node/wiki/HELP)

