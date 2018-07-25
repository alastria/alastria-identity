pragma solidity ^0.4.15;


contract AlastriaAttestationRegistry {

    // Attestation are registered under Hash(Attestation) in a (subject, hash) mapping
    // Revocations are registered under Hash (Attestations + AttestationSignature) in a (issuer, hash) mapping
    // A List of Subject attestation Hashes is gathered in a (subject) mapping
    // To Do: Return attestation URI. Should only be available to Subject. Mainly as a backup or main index when there are more than one device.
    // Could be done from attestation mapping in another get function only for subject
    // or in subjectAttestationList (changing URI from one mapping to the other)
    // To Do: make AlastriaAttestationRegistry similar to AlastriaClaimRegistry.

    // Variables
    int public version;
    address public previousPublishedVersion;

    // Attestation: Initially Valid: Only DeletedBySubject
    // Revocations: Initially Valid: Only AskIssuer or Revoked, no backwards transitions.
    enum Status {Valid, AskIssuer, Revoked, DeletedBySubject}
    Status constant STATUS_FIRST = Status.Valid;
    Status constant STATUS_LAST = Status.DeletedBySubject;

    struct Attestation {
        bool exists;
        Status status;
        string URI;
    }
    // Mapping subject, hash (JSON attestation)
    mapping(address => mapping(bytes32 => Attestation)) private attestationRegistry;
    mapping(address => bytes32[]) private attestationList;

    struct Revocation {
        bool exists;
        Status status;
    }
    // Mapping issuer, hash (JSON attestation + AttestationSignature)
    mapping(address => mapping(bytes32 => Revocation)) private revocationRegistry;


    // Events. Just for changes, not for initial set
    event AttestationDeleted (bytes32 dataHash);
    event AttestationRevoked (bytes32 revHash, Status status);

    //Modifiers
    modifier validAddress(address addr) {//protects against some weird attacks
        require(addr != address(0));
        _;
    }

    modifier validStatus (Status status) { // solidity currently check on use not at function call
        require (status >= STATUS_FIRST && status <= STATUS_LAST);
        _;
    }

    // Functions
    constructor (address _previousPublishedVersion) public {
        version = 3;
        previousPublishedVersion = _previousPublishedVersion;
    }

    function set(bytes32 dataHash, string URI) public {
        require(!attestationRegistry[msg.sender][dataHash].exists);
        attestationRegistry[msg.sender][dataHash] = Attestation(true, Status.Valid, URI);
        attestationList[msg.sender].push(dataHash);
    }

    function deleteAttestation(bytes32 dataHash) public {
        Attestation storage value = attestationRegistry[msg.sender][dataHash];
        // only existent
        if (value.exists && value.status != Status.DeletedBySubject) {
            value.status = Status.DeletedBySubject;
            emit AttestationDeleted(dataHash);
        }
    }

    // If the attestation does not exists the return is a void attestation
    // If we want a log, should we add an event?
    function subjectAttestationStatus(address subject, bytes32 dataHash) view public validAddress(subject) returns (bool exists, Status status) {
        Attestation storage value = attestationRegistry[subject][dataHash];
        return (value.exists, value.status);
    }

    function subjectAttestationList() public view returns (uint, bytes32[]) {
        return (attestationList[msg.sender].length, attestationList[msg.sender]);
    }

    function revokeAttestation(bytes32 revHash, Status status) validStatus (status) public {
        Revocation storage value = revocationRegistry[msg.sender][revHash];
        // No backward transition, only AskIssuer or Revoked
        if (status > value.status) {
            if (status == Status.AskIssuer || status == Status.Revoked) {
                value.exists = true;
                value.status = status;
                emit AttestationRevoked(revHash, status);
            }
        }
    }

    // If the attestation does not exists the return is a void attestation
    // If we want a log, should we add an event?
    function issuerRevocationStatus(address issuer, bytes32 revHash) view public validAddress(issuer) returns (bool exists, Status status) {
        Revocation storage value = revocationRegistry[issuer][revHash];
        return (value.exists, value.status);
    }

    // Utility function
    // Defining three status functions avoid linking the subject to the issuer or the corresponding hashes
    function attestationStatus(Status subjectStatus, Status issuerStatus)
        pure
        public
        validStatus(subjectStatus)
        validStatus(issuerStatus)
        returns (Status)
    {
        if (subjectStatus >= issuerStatus) {
            return subjectStatus;
        } else {
            return issuerStatus;
        }
    }
}
