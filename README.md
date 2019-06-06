
# ALASTRIA IDENTITY 0.1
Self-sovereign identity (SSI) implementation on Alastria network.

At this moment, this solution is being developed and tested for Quorum (Geth) on Alastria T-Network. More information about its nodes and the network in the [alastria-node repository](https://github.com/alastria/alastria-node). In the future, the objetive is that this works with other Alastria networks: Parity, Hyperledger Fabric...

A mobile Alastria Wallet on IONIQ has been developed as a reference implementation to exploit and explore the self-sovereign identity concept. It is the one that has the logic for management the credential to be stored and sended when required. Also, the app asks for user aceptance. Code is available on the [alastria-wallet repository](https://github.com/alastria/alastria-wallet).

To interact with the identity contracts, there is a library to use from the wallet in the [alastria-identity-lib repository](https://github.com/alastria/alastria-identity-lib).

## Alastria Self-Sovereign Identity Model
To deepen the model, you have all the information in [the wiki](https://github.com/alastria/alastria-identity/wiki). 

## Contracts
The version, the addresses and the ABIs of the deployed contracts are always updated at [TODO](./CODE_QUALITY.md). Any contribution must follow the [code quality rules](./CODE_QUALITY.md) for developers

This SSI model has been implemented with three groups of contracts:
### 1. Identity Manager
| Contract      | What it does          | 
| ------------- |:-------------| 
| AlastriaIdentityManager.sol     | Create some fake Alastria identities to play with | 
| AlastriaProxy.sol     | Create some fake Alastria identities to play with | 
| AlastriaIdentityIssuer.sol     | Create some fake Alastria identities to play with | 
| AlastriaIdentityServiceProvider.sol     | Create some fake Alastria identities to play with | 

### 2. Registry
| Contract      | What it does          | 
| ------------- |:-------------| 
| AlastriaCredentialRegistry.sol     | Create some fake Alastria identities to play with | 
| AlastriaPresentationRegistry.sol     | Create some fake Alastria identities to play with | 
| AlastriaPublicKeyRegistry.sol     | Create some fake Alastria identities to play with | 

### 3. Libs 
 The previous contracts use the same lib/contracts which are:
 | Contract      | What it does          | 
| ------------- |:-------------| 
| Eidas.sol     | Create some fake Alastria identities to play with | 
| Owned.sol     | Create some fake Alastria identities to play with | 

## Up & Running
Download and istall:
```
$ git clone https://github.com/alastria/alastria-identity.git
$ cd alastria-identity
$ npm install
```

## Developers tools
On the dev-tools directory you can find some interesting functionalities for developers and quick testing:

| dev-tool      | What it does          | 
| ------------- |:-------------| 
| createFakeIdentities     | Create some fake Alastria identities to play with | 
| deployContracts      | Deploy the contracts on the chosen network and, if it is Alastria T-Network, it updates their address, ABI and version on this repository|  
| serviceprovider | TODO |   


## Need Help?
Our SCRUM team will be happy to listen to you at [slack #identidaddigital](https://github.com/alastria/alastria-node/wiki/HELP)

