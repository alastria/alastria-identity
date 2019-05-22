# Compile and deploy Alastria Contracts

## What it does?

This script allow compile and deploy the SmartContract AlastriaIdentityManager.sol and save in [ContractInfo.md](./ContractInfo.md) the name, address and ABI of that contract.

First of all check if the contract Eidas.sol is deployed. 

- If it not deployed, start deploying this contract, save the data in the ContractInfo.md and then deploy the Alastriaidentitymanager.sol contract.
- If it is deployed, star deploying directly the AlastriaIdentityManager.sol contract.

In both cases, it saves the data in ContractInfo.md

## How to use

- Install the dependecies

```sh
npm install
```

- Execute the script

```sh
node deployUpdateContracts.js
```

The result is:

```sh
Contract Eidas not found. Compiling and deploying Eidas contract
Compiling Contract ...
Contract Eidas compiled successfuly
Deploying Eidas Contract ...
Contract Eidas deployed successfuly. Address:  0x2d4eec767bf66ca70843d9d9a7f357b02c44f8cd
Saving contract data ...
Compiling Contract ...
Contract Manager compiled successfuly
Deploying Manager Contract ...
Contract data saved!!
Saving contract data ...
Contract Manager deployed successfuly. Address:  0xac932a6d64b985506abcea2b0cc952c525ba7c9e
Contract data saved!!
```