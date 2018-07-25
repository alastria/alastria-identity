pragma solidity ^0.4.15;


contract AlastriaClaimRegistry {

    // Subject Claim actions are registered under dataHash = hash(Claim)
    // in a (subject, hash) mapping
    // Receiver (ussually a Service Provider) Claim Actions are registered
    // under dualHash = Hash (Claims + ClaimSignature) in a (receiver, hash) mapping
    // A List of Subject Claim Hashes is gathered in a (subject) mapping
    // To Review: User Claims  could be iterated instead of returned as an array


    // Variables
    int public version;
    address public previousPublishedVersion;


    // Status definition, should be moved to a Library.
    enum Status {Valid, Received, AskDeletion, DeletionConfirmation}
    Status constant STATUS_FIRST = Status.Valid;
    Status constant STATUS_LAST = Status.DeletionConfirmation;
    int constant STATUS_SIZE = 4;
    bool[STATUS_SIZE] subjectAllowed = [
        true,
        false,
        true,
        false
    ];
    bool[STATUS_SIZE] receiverAllowed = [
        false,
        true,
        false,
        true
    ];
    bool backTransitionsAllowed = false;


    // Claim: Initially set to Valid
    // Updates as allowed in *allow arrays
    struct SubjectClaim {
        bool exists;
        Status status;
        string URI;
    }
    // Mapping subject, hash (Complete JSON Claim)
    mapping(address => mapping(bytes32 => SubjectClaim)) private subjectClaimRegistry;
    mapping(address => bytes32[]) private subjectClaimListRegistry;

    struct ReceiverClaim {
        bool exists;
        Status status;
    }
    // Mapping issuer, hash (Complete JSON Claim + ClaimSignature)
    mapping(address => mapping(bytes32 => ReceiverClaim)) private receiverClaimRegistry;


    // Events. Just for changes, not for initial set
    event ClaimUpdated (bytes32 hash, Status status);


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

    //
    //Subject functions
    function set(bytes32 dataHash, string URI) public {
        require(!subjectClaimRegistry[msg.sender][dataHash].exists);
        subjectClaimRegistry[msg.sender][dataHash] = SubjectClaim(true, Status.Valid, URI);
        subjectClaimListRegistry[msg.sender].push(dataHash);
    }

    function subjectUpdateClaim(bytes32 dataHash, Status status) public validStatus(status) {
        SubjectClaim storage value = subjectClaimRegistry[msg.sender][dataHash];
        // Check existence and backtransitions, should be requires?
        if (!value.exists) {
            return;
        }
        if (!backTransitionsAllowed && status <= value.status) {
            return;
        }
        if (subjectAllowed[uint(status)]) {
            value.status = status;
            emit ClaimUpdated(dataHash, status);
        }
    }

    // If the Claim does not exists the return is a void Claim
    // If we want a log, should we add an event?
    function subjectClaimStatus(address subject, bytes32 dataHash) view public validAddress(subject) returns (bool exists, Status status) {
        SubjectClaim storage value = subjectClaimRegistry[subject][dataHash];
        return (value.exists, value.status);
    }

    function subjectClaimList() public view returns (uint, bytes32[]) {
        return (subjectClaimListRegistry[msg.sender].length, subjectClaimListRegistry[msg.sender]);
    }

    //
    //Receiver functions
    function receiverUpdateClaim(bytes32 dualHash, Status status) public validStatus(status) {
        ReceiverClaim storage value = receiverClaimRegistry[msg.sender][dualHash];
        // No previous existence required. Check backward transition
        if (!backTransitionsAllowed && status <= value.status) {
            return;
        }
        if (receiverAllowed[uint(status)]) {
            value.exists = true;
            value.status = status;
            emit ClaimUpdated(dualHash, status);
        }
    }

    // If the Claim does not exists the return is a void Claim
    // If we want a log, should we add an event?
    function receiverClaimStatus(address issuer, bytes32 dualHash) view public validAddress(issuer) returns (bool exists, Status status) {
        ReceiverClaim storage value = receiverClaimRegistry[issuer][dualHash];
        return (value.exists, value.status);
    }

    // Utility function
    // Defining three status functions avoids linking the subject to the Receiver or the corresponding hashes
    function claimStatus(Status subjectStatus, Status receiverStatus)
        pure
        public
        validStatus(subjectStatus)
        validStatus(receiverStatus)
        returns (Status)
    {
        if (subjectStatus >= receiverStatus) {
            return subjectStatus;
        } else {
            return receiverStatus;
        }
    }
}
