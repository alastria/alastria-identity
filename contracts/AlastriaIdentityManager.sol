pragma solidity ^0.4.23;

import('./proxy.sol');

contract AlastriaIdentityManager {
//Variables
mapping(address => address) public identityKeys; //change to alastriaID created check bool
mapping(address => bool) identityProvider;
uint256 public version;
address public previousPublishedVersion;
proxy public identityManagerId;

//Modifiers
modifier onlyOwner(address identity) {
    require(isOwner(identity, msg.sender));
    _;
}

modifier validAddress(address addr) { //protects against some weird attacks
    require(addr != address(0));
    _;
}

modifier onlyIdentityProvider () {
  require(identityProvider[msg.sender]);
  _;
}

//Events
event LogIdentityCreated(
    address indexed identity,
    address indexed creator,
    address owner);

event LogOwnerChanged(
  address indexed identity,
  address indexed newOner,
  address by);

//Functions
constructor(uint256 _version, address _previousVersion) {
  //TODO require(_version > getPreviousVersion(_previousVersion));
  proxy identity = new proxy();
  identityKeys[identity] = msg.sender;
  identity.forward(destination, 0, data);
  indentity.transfer(msg.sender);
  identityProvider[identity] = true;
  version = _version;
  previousPublishedVersion = _previousVersion;
  if (_version == 0) {
    proxy identityManagerId = new proxy();
  } else {
    identityManagerId.transfer(address(this));
  }
}

/// @dev Creates a new proxy contract for an owner and recovery and allows an initial forward call which would be to set the registry in our case
/// @param owner Key who can use this contract to control proxy. Given full power
/// @param destination Address of contract to be called after proxy is created
/// @param data of function to be called at the destination contract
function createIdentityWithCall(address owner, address destination, bytes data) public onlyIdentityProvider validAddress(owner){
    proxy identity = new proxy();
    identityKeys[identity] = owner;
    identity.forward(destination, 0, data);//must be alastria registry call
    indentity.transfer(owner);
    emit LogIdentityCreated(identity, msg.sender, owner);
}

/// @dev Change the owner of an identity, can only be called by an identityProvider
/// @param identity Identity affected by the owner change
/// @param newowner New owner for the identity
function changeOwner(proxy identity, address newOwner) public onlyIdentityProvider {
    require(newOwner != identityKeys[identity]);
    indentity.transfer(newOwner);
    emit LogOwnerChanged(identity, newOwner, msg.sender);
}

/// @dev Allows an idenity provider to set a new identity identityProvider
/// @param identityProvider The alastria ID of the new identity provider
/// TODO: Add checks for the identity provider
function newIdentityProvider(address identityProvider) public onlyIdentityProvider validAddress(identityProvider) {
  require(identityKeys[identityProvider] != address(0))
  identityProvider[identityProvider] = true;
}

//TODO: fallback revoke

//Internals
//Checks that address a is the first input in msg.data.
//Has very minimal gas overhead.
function checkMessageData(address a) internal constant returns (bool t) {
    if (msg.data.length < 36) return false;
    assembly {
        let mask := 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
        t := eq(a, and(mask, calldataload(4)))
    }
}

}
