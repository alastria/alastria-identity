
# ALASTRIA IDENTITY V.0.1
Self-sovereign identity (SSI) implementation on Alastria network.

At this moment, this solution is being developed and tested for Quorum (Geth) on Alastria T-Network. More information about its nodes and the network in the [alastria-node repository](https://github.com/alastria/alastria-node).

To interact with the identity contracts, you have a library in the [alastria-identity-lib repository (https://github.com/alastria/alastria-identity-lib).

A mobile Alastria Wallet on IONIQ has been developed as a reference implementation to exploit and explore the self-sovereign identity concept. It is the one that has the logic for management the credential to be stored and sended when required. Also, the app asks for user aceptance. Code is available on the alastria-wallet repository](https://github.com/alastria/alastria-wallet).

## Alastria Self-Sovereign Identity Model
To deepen the model, you have all the information in [the wiki](https://github.com/alastria/alastria-identity/wiki). 

## Contracts
The version, the addresses and the ABIs of the deployed contracts are always updated at (./CODE_QUALITY.md). Any contribution must follow the [code quality rules] for developers(./CODE_QUALITY.md)

This SSI model has been implemented with three groups of contracts:
### 1. Identity Manager
   #### 1.1 AlastriaIdentityManager.sol
   #### 1.2 AlastriaProxy.sol
   Is the AlastriaID itself
   Is the interface with the world for an AlastriaID
   Only receive transactions and resend them to the target
   #### 1.3 AlastriaIdentityIssuer.sol
   #### 1.4 AlastriaIdentityServiceProvider.sol
### 2. Registry
   #### 2.1 AlastriaCredentialRegistry.sol
   Has all the information about the IDs
   Has the proccess to create, validate and revoke attestations for the users
   The attestations points to off-chain resources (URI)
   #### 2.2 AlastriaPresentationRegistry.sol
   #### 2.3 AlastriaPublicKeyRegistry.sol
### 3. Libs 
 The previous contracts use the same lib/contracts which are:
   #### 3.1 Eidas.sol
   #### 3.2 Owned.sol

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
| ------------- |:-------------:| 
| createFakeIdentities     | Create some fake Alastria identities to play with | 
| deployContracts      | Deploy the contracts on the chosen network and, if it is Alastria T-Network, it updates their address, ABI and version on this repository|  
| serviceprovider | TODO |   


# Need Help?
Our SCRUM team will be happy to listen to you at [Slack #identidaddigital](https://github.com/alastria/alastria-node/wiki/HELP)

