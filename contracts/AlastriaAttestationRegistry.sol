pragma solidity ^0.4.19;

contract AlastriaAttestationRegistry{
  //Variables
  
  int public version;	
  address public previousPublishedVersion;

  enum Status {Valid, AskIssuer, Revoked, DeletedByUser} // Initially Valid, no backwards transitions allowed.
  struct attestation {
    bool exists;
    Status status;
    bytes32 revocationChallenge;
    string URI;
  }

  mapping (address => mapping(bytes32 => attestation)) private registry;

  //Events
   event RevocationChallenge(
    address indexed subject,
    bytes32 indexed dataHash,
	bytes32 revocationKey,
 	bytes32 revocationChallenge,
 	bytes32 calculatedRevocationChallenge
	);


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
    function AlastriaAttestationRegistry (address _previousPublishedVersion) public {
    version = 3;
    previousPublishedVersion = _previousPublishedVersion;
    }

  function set(bytes32 dataHash, bytes32 revocationChallenge, string URI) public {
    require(!registry[msg.sender][dataHash].exists);
    registry[msg.sender][dataHash] = attestation(true, Status.Valid, revocationChallenge, URI);
  }

  //If the attestation does not exists the return is a void attestation
  //If we want a log, should we add an event?
  function get(address subject, bytes32 dataHash) constant public returns (bool exists, Status status) {
    attestation storage value = registry[subject][dataHash];
    return (value.exists, value.status);
  }

  function revoke(address subject, bytes32 dataHash, Status status, bytes32 rKey) public onlyAllowed(subject, dataHash, rKey) {
    attestation storage value = registry[subject][dataHash];
	
    //Need verification
    if (status <= value.status) {
        // Do nothing, no backwards transitions allowed
    } else if (status == Status.DeletedByUser && msg.sender == subject) {
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
  
  // Utility function 
  function revocationHash(bytes32 dataHash, bytes32 rKey) public pure returns (bytes32) {
	return keccak256 (dataHash, rKey);
  }
}