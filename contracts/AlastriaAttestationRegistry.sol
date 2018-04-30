pragma solidity ^0.4.8;

contract AlastriaAttestationRegistry{
  //Variables
  struct attestation {
    bool exists;
    bytes32 status;
    bytes32 revocationChallenge;
    string URI;
  }

  mapping (address => mapping(bytes32 => attestation)) private registry;

  //Events

  //Modifiers
  modifier validAddress(address addr) { //protects against some weird attacks
      require(addr != address(0));
      _;
  }

  modifier onlyAllowed (address subject, bytes32 rKey) {
    require(msg.sender == subject || revocationChallenge()); //Cortocircuito?? ejecuta revocationChallenge inlcuso con issuer ok
    _;
  }

  //Functions
  function set(bytes32 dataHash, bytes32 revocationChallenge, string URI) {
    require(!registry[msg.sender][dataHash].exists);
    var value = attestation(true, "Valid", revocationChallenge, URI);
    registry[msg.sender][dataHash] = value;
  }

  //If the attestation does not exists the return is a void attestation
  //If we want a log, should we add an event?
  function get(bytes32 dataHash, address subject) constant public returns (attestation) {
    return registry[subject][dataHash];
  }

  function revoke(address subject, bytes32 dataHash, bytes32 status, bytes32 rKey) onlyAllowed(subject, rKey) {
    var value = registry[subject][dataHash];
    //Need verification and message standarization
    if(status == "Revoked") {
      value.status = "Revoked";
    } else if(status == "Deleted") {
      if(msg.sender == subject){
        value.status = "Deleted";
      }
    } else if(status != "Valid") {
      value.status = status;
    }
  }

  //Mocked implemantation with fixed value
  function revocationChallenge() returns (bool) {
    return true;
  }
}
