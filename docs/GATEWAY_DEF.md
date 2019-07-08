# GateWay

## Alastria, permissioned blockchain
* In a permissioned network as Alastria, nodes can only be run by members. Alastria network can only be accessed through those nodes.
* A Gateway is required to provide fine grained exposure of RPC API.
* The Gateway is meant to give access to:
  * Personal users
  * Members not running a node 
  * Affiliated service providers that are not Alastria members
* The GW should be as transparent as possible:
  * Providing TLS
  * Exposing selected RPC API and filtering everything else
  * No added value or combining Smart Contracts calls
*The GW should be able to detect and and react to DoS attacks.

## Gateway accessible RPC
* RPC should be carefully analized
* Initial approach
  * Admin & Personal RPC should be filtered
  * Call & SendRawTransaction should be allowed
  * Remaining RPC API functions should be filtered unless required  
  * For Members willing to provide just AlastriaIdentity access
    * All SendRawTransactions should be addressed to the most current AlastriaIdentityManager
    
