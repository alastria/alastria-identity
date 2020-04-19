pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import "../../libs/Ownable.sol";
import "../interfaces/InterfacePublicKeyRegistryStorage.sol";

contract PresentationRegistryStorage is Ownable, InterfacePresentationRegistryStorage_v0 {

  mapping(address => mapping(bytes32 => PublicKey)) private publicKeyRegistry;
  mapping(address => bytes32[]) private publicKeyList;

  function setPublicKeyRegistry(address subject, bytes32 keyIndex, PublicKey memory key) public onlyOwner override{
    publicKeyRegistry[subject][keyIndex] = key;
    publicKeyList[subject].push(keyIndex);
  }

  function getPublicKeyRegistry(address subject, bytes32 keyIndex) public view onlyOwner override returns(PublicKey memory){
    return publicKeyRegistry[subject][keyIndex];
  }

  function getPublicKeyRegistryList(address subject, uint256 index) public view onlyOwner override returns(bytes32) {
    return publicKeyList[subject][index];
  }

  /**
   * @Dev Returns the length if the list of public key
   * @Param {address} subject to return public key list length
   * @returns {uint256} the length of the public key list
   */
  function lentghPublicKeyList(address subject) public view onlyOwner override returns(uint256) {
    return publicKeyList[subject].length;
  }

}