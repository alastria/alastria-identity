# UPORT BASED ALASTRIA IDENTITY V.0.0.0
Uport platform adapted to Alastria network

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

##proxy
Is the AlastriaID itself

Is the interface with the world for an AlastriaID

Only receive transactions and resend them to the target

##How to use
