pragma solidity 0.6 .4;

import "../../libs/Ownable.sol";
import "../interfaces/InterfacePublicKeyRegistryStorage.sol";

contract PresentationRegistryStorage is Ownable, InterfacePublicKeyRegistryStorage {

  mapping(address => mapping(bytes32 => PublicKey)) private publicKeyRegistry;
  mapping(address => bytes32[]) public publicKeyList;

  function setPublicKeyRegistry(address subject, bytes32 keyIndex, PublicKey memory key) public onlyOwner {
    publicKeyRegistry[subject][keyIndex] = key;
    publicKeyList[subject].push(keyIndex);
  }

  function getPublicKeyRegistry(address subject, bytes32 keyIndex) public view returns(PublicKey memory) public onlyOwner {
    return publicKeyRegistry[subject][keyIndex];
  }

  function getPublicKeyRegistryList(address subject) public view onlyOwner returns(bytes32[] memory) {
    return publicKeyList[subject];
  }

  function lentghPublicKeyList(address subject) public view onlyOwner returns(uint256) {
    return publicKeyList[subject].length;
  }

}