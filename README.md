# UPORT BASED ALASTRIA IDENTITY V.0.0.0
Uport platform adapted to Alastria network

## UportRaw contracts
The adresses of the contracts (as Uport provide them) in the alastria test-net are:
```
  IdentityManager: 0xb08c53b75030eb406f4c856a524f57a35410f474
  MetaIdentityManager: 0x28d38d5cfe3c721506665fe2c1ca165ea3c81ea6
  proxy: 0xfc5940d3180fd294aad65d2fcc6b8c7664828cf8
  UportRegistry: 0x4dedc4b2e4122158d0df02c3cfdd5f07326497c0
  TxRelay: 0x815af292ba858a3256fc0d03e40b75b07fcdf317
```

## Basic Identity Manager
Forked from uPort

This is the basic identity which gives the Alastria identity manager the main features for working in the blockchain.

The migrate feature has been disable for this version of alastria ID. Need to set the ownership and responsability of the identity creation.

The recovery feature has been moved to the Alastria Identity Manager, to be managed with the eIDAS level.

The registerIdentity feature has been removed for this version, there is not supposed to exists multiple id in multiple identity managers to be moved.

This contract is not used by it self, only inherited by the Alastria Identity Manager.

## Alastria Identity Manager
Inherit from Basic Identity Manager

Allows user to interface the main functions of the registry

Allows user to manage different wallets o

## AlastriaRegistry
Has all the information about the IDs

Has the proccess to create, validate and revoke attestations for the users

The attestations points to off-chain resources (URI)

## proxy
Is the AlastriaID itself

Is the interface with the world for an AlastriaID

Only receive transactions and resend them to the target

## How to use
For creating an identity, the sequence diagram is the one that follows

![alt text](https://github.com/alastria/alastria-identity/blob/develop/Docs/NewIdentity.png)

In which the User app is the mobile phone app from the user, that is the one that has the logic for management the attestation to be stored and sended when required. Also, the app asks for user aceptance.

# NOTAS

Riot channel
