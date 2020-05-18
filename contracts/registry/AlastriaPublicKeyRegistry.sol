pragma solidity 0.5.17;

import "../openzeppelin/Initializable.sol";


contract AlastriaPublicKeyRegistry is Initializable{

    // This contracts registers and makes publicly avalaible the AlastriaID Public Keys hash and status, current and past.

    //To Do: Should we add RevokedBySubject Status?

    //Variables
    int public version;
    address public previousPublishedVersion;

    // Initially Valid: could only be changed to DeletedBySubject for the time being.
    enum Status {Valid, DeletedBySubject}
    struct PublicKey {
        bool exists;
        Status status; // Deleted keys shouldnt be used, not even to check previous signatures.
        uint startDate;
        uint endDate;
    }

    // Mapping (subject, publickey)
    mapping(address => mapping(bytes32 => PublicKey)) private publicKeyRegistry;
    // mapping subject => publickey
    mapping(address => string[]) public publicKeyList;

    //Events, just for revocation and deletion
    event PublicKeyDeleted (string publicKey);
    event PublicKeyRevoked (string publicKey);

    //Modifiers
    modifier validAddress(address addr) {//protects against some weird attacks
        require(addr != address(0));
        _;
    }

    function initialize(address _previousPublishedVersion) initializer public{
        version = 4;
        previousPublishedVersion = _previousPublishedVersion;
    }

    // Sets new key and revokes previous
    function addKey(string memory publicKey) public {
        require(!publicKeyRegistry[msg.sender][getKeyHash(publicKey)].exists);
        uint changeDate = now;
        revokePublicKey(getCurrentPublicKey(msg.sender));
        publicKeyRegistry[msg.sender][getKeyHash(publicKey)] = PublicKey(
            true,
            Status.Valid,
            changeDate,
            0
        );
        publicKeyList[msg.sender].push(publicKey);
    }

    function revokePublicKey(string memory publicKey) public {
        PublicKey storage value = publicKeyRegistry[msg.sender][getKeyHash(publicKey)];
        // only existent no backtransition
        if (value.exists && value.status != Status.DeletedBySubject) {
            value.endDate = now;
            emit PublicKeyRevoked(publicKey);
        }
    }

    function deletePublicKey(string memory publicKey) public {
        PublicKey storage value = publicKeyRegistry[msg.sender][getKeyHash(publicKey)];
        // only existent
        if (value.exists) {
            value.status = Status.DeletedBySubject;
            value.endDate = now;
            emit PublicKeyDeleted(publicKey);
        }
    }

    function getCurrentPublicKey(address subject) view public validAddress(subject) returns (string memory) {
        if (publicKeyList[subject].length > 0) {
            return publicKeyList[subject][publicKeyList[subject].length - 1];
        } else {
            return "";
        }
    }

    function getPublicKeyStatus(address subject, bytes32 publicKey) view public validAddress(subject)
        returns (bool exists, Status status, uint startDate, uint endDate){
        PublicKey storage value = publicKeyRegistry[subject][publicKey];
        return (value.exists, value.status, value.startDate, value.endDate);
    }
    
    function getKeyHash(string memory inputKey) internal pure returns(bytes32){
        return keccak256(abi.encodePacked(inputKey));
    }

}
