pragma solidity 0.5.17;

import "../openzeppelin/Initializable.sol";

contract AlastriaCredentialRegistry is Initializable {

    // SubjectCredential are registered under Hash(Credential) in a (subject, hash) mapping
    // IssuerCredentials are registered under Hash (Credentials + SubjectCredentialSignature) in a (issuer, hash) mapping
    // A List of Subject credential hashes is gathered in a (subject) mapping
    // To Think About: Make a unique Credential struct and just one mapping subjectCredentialRegistry instead one for subjects and one for issuers
    // To Do: Return credential URI. Should only be available to Subject. Mainly as a backup or main index when there are more than one device.
    // Could be done from credential mapping in another get function only for subject
    // or in getSubjectCredentialList (changing URI from one mapping to the other)
    // To Do: make AlastriaCredentialRegistry similar to AlastriaClaimRegistry.

    // Variables
    int public version;
    address public previousPublishedVersion;

    // SubjectCredential: Initially Valid: Only DeletedBySubject
    // IssuerCredentials: Initially Valid: Only AskIssuer or Revoked, no backwards transitions.
    enum Status {Valid, AskIssuer, Revoked, DeletedBySubject}
    Status constant STATUS_FIRST = Status.Valid;
    Status constant STATUS_LAST = Status.DeletedBySubject;

    struct SubjectCredential {
        bool exists;
        Status status;
        string URI;
    }

    // Mapping subject, hash (JSON credential)
    mapping(address => mapping(bytes32 => SubjectCredential)) public subjectCredentialRegistry;
    mapping(address => bytes32[]) public subjectCredentialList;

    struct IssuerCredential {
        bool exists;
        Status status;
    }

    // Mapping issuer, hash (JSON credential + CredentialSignature)
    mapping(address => mapping(bytes32 => IssuerCredential)) private issuerCredentialRegistry;
    mapping(address => bytes32[]) public issuerCredentialList;

    // Events. Just for changes, not for initial set
    event SubjectCredentialDeleted (bytes32 subjectCredentialHash);
    event IssuerCredentialRevoked (bytes32 issuerCredentialHash, Status status);

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
    // Constructor
    function initialize(address _previousPublishedVersion) public initializer {
        version = 3;
        previousPublishedVersion = _previousPublishedVersion;
    }

    function addSubjectCredential(bytes32 subjectCredentialHash, string memory URI) public {
        require(!subjectCredentialRegistry[msg.sender][subjectCredentialHash].exists);
        subjectCredentialRegistry[msg.sender][subjectCredentialHash] = SubjectCredential(true, Status.Valid, URI);
        subjectCredentialList[msg.sender].push(subjectCredentialHash);
    }

    function addIssuerCredential(bytes32 issuerCredentialHash) public {
        require(!issuerCredentialRegistry[msg.sender][issuerCredentialHash].exists);
        issuerCredentialRegistry[msg.sender][issuerCredentialHash] = IssuerCredential(true, Status.Valid);
        issuerCredentialList[msg.sender].push(issuerCredentialHash);
    }

    function deleteSubjectCredential(bytes32 subjectCredentialHash) public {
        SubjectCredential storage value = subjectCredentialRegistry[msg.sender][subjectCredentialHash];
        // only existent
        if (value.exists && value.status != Status.DeletedBySubject) {
            value.status = Status.DeletedBySubject;
            emit SubjectCredentialDeleted(subjectCredentialHash);
        }
    }

    // If the credential does not exists the return is a void credential
    // If we want a log, should we add an event?
    function getSubjectCredentialStatus(address subject, bytes32 subjectCredentialHash) view public validAddress(subject) returns (bool exists, Status status) {
        SubjectCredential storage value = subjectCredentialRegistry[subject][subjectCredentialHash];
        return (value.exists, value.status);
    }

    function getSubjectCredentialList(address subject) public view returns (uint, bytes32[] memory) {
        return (subjectCredentialList[subject].length, subjectCredentialList[subject]);
    }

    function updateCredentialStatus(bytes32 issuerCredentialHash, Status status) validStatus (status) public {
        IssuerCredential storage value = issuerCredentialRegistry[msg.sender][issuerCredentialHash];
        // No backward transition, only AskIssuer or Revoked
        if (status > value.status) {
            if (status == Status.AskIssuer || status == Status.Revoked) {
                value.exists = true;
                value.status = status;
                emit IssuerCredentialRevoked(issuerCredentialHash, status);
            }
        }
    }

    // If the credential does not exists the return is a void credential
    // If we want a log, should we add an event?
    function getIssuerCredentialStatus(address issuer, bytes32 issuerCredentialHash) view public validAddress(issuer) returns (bool exists, Status status) {
        IssuerCredential storage value = issuerCredentialRegistry[issuer][issuerCredentialHash];
        return (value.exists, value.status);
    }

    // Utility function
    // Defining three status functions avoid linking the subject to the issuer or the corresponding hashes
    function getCredentialStatus(Status subjectStatus, Status issuerStatus) pure public validStatus(subjectStatus) validStatus(issuerStatus) returns (Status){
        if (subjectStatus >= issuerStatus) {
            return subjectStatus;
        } else {
            return issuerStatus;
        }
    }
}
