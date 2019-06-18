
# ALASTRIA IDENTITY 0.1
Self-sovereign identity (SSI) implementation on Alastria network.

At this moment, this solution is being developed and tested for Quorum (Geth) on Alastria T-Network. More information about its nodes and the network in the [alastria-node repository](https://github.com/alastria/alastria-node). In the future, the objetive is that this works with other Alastria networks: Parity, Hyperledger Fabric...

A mobile Alastria Wallet on IONIQ has been developed as a reference implementation to exploit and explore the self-sovereign identity concept. It has the logic for managing credentials to be stored and sended when required. Also, the app asks for user aceptance. Code is available on the [alastria-wallet repository](https://github.com/alastria/alastria-wallet).

To interact with the identity contracts, there is a library to use from the wallet in the [alastria-identity-lib repository](https://github.com/alastria/alastria-identity-lib).

## Alastria Self-Sovereign Identity Model
To deepen the model, you have all the information in [the wiki](https://github.com/alastria/alastria-identity/wiki). 

## Contracts
Contracts must be deployed by Alastria. The version, the addresses and the ABIs of the deployed contracts are always updated at [./contracts/ContractInfo.md](https://github.com/alastria/alastria-identity/blob/develop/contracts/ContractInfo.md) and at the [contracts/abi](https://github.com/alastria/alastria-identity/tree/develop/contracts/abi) directory. If you want to deploy them in your test-environment you can use dev-tools/deployContracts.

Any contribution must follow the [code quality rules](./CODE_QUALITY.md) for developers

This SSI model has been implemented with three groups of contracts:
### 1. Identity Manager
|Contract      | What it does          | 
| :------------- |:-------------| 
| AlastriaIdentityManager.sol     |It generate access tokens, creates identities, deploy an AlastriaProxy for each identity and sends transactions through the proxy of the sender| 
| AlastriaProxy.sol     |It is the Alastria ID itself. Only receive transactions from the IdentityManager and resend them to the target  | 
| AlastriaIdentityIssuer.sol     | It keeps a registry of the issuers identities | 
| AlastriaIdentityServiceProvider.sol     |It keeps a registry of the service providers identities | 

### 2. Registry
|Contract      | What it does          | 
|:------------- |:-------------| 
| AlastriaCredentialRegistry.sol     |It manages all the credentials and keeps the registry and the status | 
| AlastriaPresentationRegistry.sol     |It manages all the presentations and keeps the registry and the status | 
| AlastriaPublicKeyRegistry.sol     | It manages all the public keys and keeps the registry | 

### 3. Libs 
 The previous contracts use the same lib/contracts which are:
 
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
| createFakeIdentities     | Create some fake Alastria identities to play with. You have 5 mock-identities already created! | 
| deployContracts      | Deploy the contracts on the chosen network and, if it is Alastria T-Network, it updates their address, ABI and version on this repository|  
| serviceprovider | Service Provider page, capable of doing login and sending credentials |   


## Need Help?
Our identity core team will be happy to listen to you at [slack #identidaddigital](https://github.com/alastria/alastria-node/wiki/HELP)

