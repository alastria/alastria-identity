pragma solidity ^0.4.19;

contract AlastriaAttestationRegistry{

  // Attestation are registered under Hash(Attestation) in a (subject, hash) mapping
  // Revocations are registered under Hash (Attestations + AttestationSignature) in a (issuer, hash) mapping
  // A List of User attestation Hashes is gathered in a (subject) mapping
  // To Do: Return attestation URI. Should only be available to user. Mainly as a backup or main index when there are more than one device.
     // Could be done from attestation mapping in another get function only for subject
     // or in subjectAttestationList (changing URI from one mapping to the other)


   //Variables
  
  int public version; 
  address public previousPublishedVersion;

  // Attestation: Initially Valid: Only DeletedByUser
  // Revocations: Initially Valid: Only AskIssuer or Revoked, no backwards transitions.
  enum Status {Valid, AskIssuer, Revoked, DeletedByUser}
  struct Attestation {
    bool exists;
    Status status;
    string URI;
  }
  // Mapping subject, hash (JSON attestation)
  mapping (address => mapping(bytes32 => Attestation)) private attestationRegistry;
  mapping (address => bytes32[]) private attestationList;
  
  struct Revocation {
    bool exists;
    Status status;
  }
  // Mapping issuer, hash (JSON attestation + AttestationSignature)
  mapping (address => mapping(bytes32 => Revocation)) private revocationRegistry;


  //Events

  //Modifiers
  modifier validAddress(address addr) { //protects against some weird attacks
      require(addr != address(0));
      _;
  }

  //Functions
  function AlastriaAttestationRegistry (address _previousPublishedVersion) public {
    version = 3;
    previousPublishedVersion = _previousPublishedVersion;
  }

  function set(bytes32 dataHash, string URI) public {
    require(!attestationRegistry[msg.sender][dataHash].exists);
    attestationRegistry[msg.sender][dataHash] = Attestation(true, Status.Valid, URI);
    attestationList[msg.sender].push(dataHash);
  }

  function deleteAttestation (bytes32 dataHash) public {
    Attestation storage value = attestationRegistry[msg.sender][dataHash];
    // only existent
    if (value.exists) {
        value.status = Status.DeletedByUser;
    }
  }

  //If the attestation does not exists the return is a void attestation
  //If we want a log, should we add an event?
  function subjectAttestationStatus (address subject, bytes32 dataHash) constant public returns (bool exists, Status status) {
    Attestation storage value = attestationRegistry[subject][dataHash];
    return (value.exists, value.status);
  }

  function subjectAttestationList () public view returns (uint, bytes32[]) {
    return (attestationList[msg.sender].length, attestationList[msg.sender]);
  }

  function revokeAttestation(bytes32 revHash, Status status) public {
    Revocation storage value = revocationRegistry[msg.sender][revHash];
    //No backward transition, only AskIssuer or Revoked
    if (status > value.status) {
        if (status == Status.AskIssuer || status == Status.Revoked) {
            value.exists = true;
            value.status = status;
        }
    }
  }

  //If the attestation does not exists the return is a void attestation
  //If we want a log, should we add an event?
  function issuerRevocationStatus(address issuer, bytes32 revHash) constant public returns (bool exists, Status status) {
    Revocation storage value = revocationRegistry[issuer][revHash];
    return (value.exists, value.status);
  }

  // Utility functions
  // Defining three status functions avoid linking the subject to the issuer or the corresponding hashes
  function attestationStatus (Status userStatus, Status issuerStatus) pure public returns (Status) {
     if (userStatus >= issuerStatus) {
        return userStatus;
     } else {
        return issuerStatus;
     }
  } 

  function solidityHash(bytes data) public pure returns (bytes32) {
	return keccak256 (data);
  }

  function solidityHash(bytes32 data1, bytes32 data2) public pure returns (bytes32) {
	return keccak256 (data1, data2);
  }
}
