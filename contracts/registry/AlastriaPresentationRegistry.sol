pragma solidity 0.5.17;

import "../openzeppelin/Initializable.sol";


contract AlastriaPresentationRegistry is Initializable {

    // Subject Presentation actions are registered under subjectPresentationHash = hash(Presentation)
    // in a (subject, subjectPresentationHash) mapping
    // Receiver (ussually a Service Provider) Presentation Actions are registered
    // under receiverPresentationHash = hash(Presentations + PresentationSignature) in a (receiver, receiverPresentationHash) mapping
    // A List of Subject Presentation Hashes is gathered in a (subject) mapping
    // To Review: Subject Presentations  could be iterated instead of returned as an array


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


    // Presentation: Initially set to Valid
    // Updates as allowed in *allow arrays
    struct SubjectPresentation {
        bool exists;
        Status status;
        string URI;
    }
    // Mapping subject, subjectPresentationHash (Complete JSON Presentation)
    mapping(address => mapping(bytes32 => SubjectPresentation)) public subjectPresentationRegistry;
    mapping(address => bytes32[]) public subjectPresentationListRegistry;

    struct ReceiverPresentation {
        bool exists;
        Status status;
    }
    // Mapping receiver, receiverPresentationHash (Complete JSON Presentation + PresentationSignature)
    mapping(address => mapping(bytes32 => ReceiverPresentation)) private receiverPresentationRegistry;


    // Events. Just for changes, not for initial set
    event PresentationUpdated (bytes32 hash, Status status);


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
    function initialize(address _previousPublishedVersion) public initializer {
        version = 4;
        previousPublishedVersion = _previousPublishedVersion;
    }

    //
    //Subject functions
    function addSubjectPresentation(bytes32 subjectPresentationHash, string memory URI) public {
        require(!subjectPresentationRegistry[msg.sender][subjectPresentationHash].exists);
        subjectPresentationRegistry[msg.sender][subjectPresentationHash] = SubjectPresentation(true, Status.Valid, URI);
        subjectPresentationListRegistry[msg.sender].push(subjectPresentationHash);
    }

    function updateSubjectPresentation(bytes32 subjectPresentationHash, Status status) public validStatus(status) {
        SubjectPresentation storage value = subjectPresentationRegistry[msg.sender][subjectPresentationHash];
        // Check existence and backtransitions, should be requires?
        if (!value.exists) {
            return;
        }
        if (!backTransitionsAllowed && status <= value.status) {
            return;
        }
        if (subjectAllowed[uint(status)]) {
            value.status = status;
            emit PresentationUpdated(subjectPresentationHash, status);
        }
    }

    // If the Presentation does not exists the return is a void Presentation
    // If we want a log, should we add an event?
    function getSubjectPresentationStatus(address subject, bytes32 subjectPresentationHash) view public validAddress(subject) returns (bool exists, Status status) {
        SubjectPresentation storage value = subjectPresentationRegistry[subject][subjectPresentationHash];
        return (value.exists, value.status);
    }

    function getSubjectPresentationList(address subject) public view returns (uint, bytes32[] memory) {
        return (subjectPresentationListRegistry[subject].length, subjectPresentationListRegistry[subject]);
    }

    //
    //Receiver functions
    function updateReceiverPresentation(bytes32 receiverPresentationHash, Status status) public validStatus(status) {
        ReceiverPresentation storage value = receiverPresentationRegistry[msg.sender][receiverPresentationHash];
        // No previous existence required. Check backward transition
        if (!backTransitionsAllowed && status <= value.status) {
            return;
        }
        if (receiverAllowed[uint(status)]) {
            value.exists = true;
            value.status = status;
            emit PresentationUpdated(receiverPresentationHash, status);
        }
    }

    // If the Presentation does not exists the return is a void Presentation
    // If we want a log, should we add an event?
    function getReceiverPresentationStatus(address receiver, bytes32 receiverPresentationHash) view public validAddress(receiver) returns (bool exists, Status status) {
        ReceiverPresentation storage value = receiverPresentationRegistry[receiver][receiverPresentationHash];
        return (value.exists, value.status);
    }

    // Utility function
    // Defining three status functions avoids linking the Subject to the Receiver or the corresponding hashes
    function getPresentationStatus(Status subjectStatus, Status receiverStatus) pure public validStatus(subjectStatus) validStatus(receiverStatus) returns (Status){
        if (subjectStatus >= receiverStatus) {
            return subjectStatus;
        } else {
            return receiverStatus;
        }
    }
}