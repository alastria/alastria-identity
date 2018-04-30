pragma solidity ^0.4.20;

contract AlastriaAttestationRegistry{
  //Variables

  // ¿Should we add Level of Assurance? 
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

  modifier onlyAllowed (address subject, bytes32 dataHash, bytes32 rKey) {
    require(msg.sender == subject || revocationChallenge(subject, dataHash, rKey)); //Cortocircuito?? ejecuta revocationChallenge inlcuso con issuer ok
    _;
  }

  //Functions
  function set(bytes32 dataHash, bytes32 revocationChallenge, string URI) public {
    require(!registry[msg.sender][dataHash].exists);
    registry[msg.sender][dataHash] = attestation(true, "Valid", revocationChallenge, URI);
  }

  //If the attestation does not exists the return is a void attestation
  //If we want a log, should we add an event?
  function get(bytes32 dataHash, address subject) constant public returns (bool exists, bytes32 status) {
    attestation storage value = registry[subject][dataHash];
    return (value.exists, value.status);
  }

  function revoke(address subject, bytes32 dataHash, bytes32 status, bytes32 rKey) public onlyAllowed(subject, dataHash, rKey) {
    attestation storage value = registry[subject][dataHash];
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

  // Simple implementation
  function revocationChallenge(address subject, bytes32 dataHash, bytes32 rKey) public view returns (bool) {
    return keccak256 (dataHash, rKey) == registry[subject][dataHash].revocationChallenge;
  }
}
