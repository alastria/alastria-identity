pragma solidity ^0.4.20;

contract AlastriaAttestationRegistry{
  //Variables

  enum Status {Valid, AskIssuer, Revoked, DeletedByUser} // Initially Valid, no backwards transitions allowed.
  struct attestation {
    bool exists;
    Status status;
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
    // Only Subject or Issuer (Revocation Key Owner)
    require(msg.sender == subject || revocationChallenge(subject, dataHash, rKey));
    _;
  }

  //Functions
  function set(bytes32 dataHash, bytes32 revocationChallenge, string URI) public {
    require(!registry[msg.sender][dataHash].exists);
    registry[msg.sender][dataHash] = attestation(true, Status.Valid, revocationChallenge, URI);
  }

  //If the attestation does not exists the return is a void attestation
  //If we want a log, should we add an event?
  function get(bytes32 dataHash, address subject) constant public returns (bool exists, Status status) {
    attestation storage value = registry[subject][dataHash];
    return (value.exists, value.status);
  }

  function revoke(address subject, bytes32 dataHash, Status status, bytes32 rKey) public onlyAllowed(subject, dataHash, rKey) {
    attestation storage value = registry[subject][dataHash];

    //Need verification
    if (status <= value.status) {
        // Do nothing, no backwards transitions allowed
    } else if (value.status == Status.DeletedByUser && msg.sender == subject) {
      value.status = status;
    } else if(status == Status.Revoked) {
        value.status = status;
    } else if(status == Status.AskIssuer && msg.sender != subject) {
        value.status = status;
    }
  }

  // Simple implementation
  function revocationChallenge(address subject, bytes32 dataHash, bytes32 rKey) public view returns (bool) {
    return keccak256 (dataHash, rKey) == registry[subject][dataHash].revocationChallenge;
  }
}
