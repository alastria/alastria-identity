# Compile and deploy Alastria Contracts

## What it does

This scripts allow compile and deploy the SmartContract AlastriaIdentityManager.sol and save in [ContractInfo.md](../../contracts/ContractInfo.md) the name, address and the ABIs URLs in GitHub of that contract. Also save the ABIs of each contract in the *ABIs directory* **(../../contracts/abi/)**

## How to use

- Install the dependecies

```sh
npm install
```

- First, run the `1.flattenContracts.js` script to get the last changes, if they are, of the contracts.

```sh
node 1.flattenContracts.js
```

- Once the previous script is finished, run the `2.deployUpdateContracts.js` script to compile and deploy the contracts

```sh
node 2.deployUpdateContracts.js
```

The result is:

```sh
Starting compiling contracs
Compiling Contract ...
Contract Eidas compiled successfuly
Deploying Eidas Contract ...
Contract Eidas deployed successfuly. Address:  0x3ec2a7c8e9b7ec53f820fa558833f3ad21be8c55
Eidas ABI saved!
Compiling Contract ...
AlastriaCredentialRegistry ABI saved!
AlastriaIdentityEntity ABI saved!
AlastriaIdentityIssuer ABI saved!
AlastriaIdentityManager ABI saved!
AlastriaIdentityServiceProvider ABI saved!
AlastriaPresentationRegistry ABI saved!
AlastriaProxy ABI saved!
AlastriaPublicKeyRegistry ABI saved!
Eidas ABI saved!
Owned ABI saved!
Contract Manager compiled successfuly
Deploying Manager Contract ...
Eidas address info saved!
Contract AlastriaIdentityManager deployed successfuly. Address:  0x89b0292a1382ed26c658204da1a72871ba7490a9
Contract AlastriaCredentialRegistry deployed successfuly. Address:  0x54a0967f44fedf2d979c9ad6b1e8a9975876ed3a
Contract AlastriaPresentationRegistry deployed successfuly. Address:  0x18cd8f9e41503b986b53613ea0ad4966c1ef72bc
Contract AlastriaPublicKeyManager deployed successfuly. Address:  0x7beacd007647f6abcfe255f2ff48f3dd1d58fb04
AlastriaIdentityManager address info saved!
AlastriaPresentationRegistry address info saved!
AlastriaCredentialRegistry address info saved!
AlastriaPublicKeyRegistry address info saved!
```
