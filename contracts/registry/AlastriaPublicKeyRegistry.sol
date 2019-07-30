pragma solidity ^0.4.23;


contract AlastriaPublicKeyRegistry {

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
    mapping(address => bytes32[]) public publicKeyList;

    //Events, just for revocation and deletion
    event PublicKeyDeleted (bytes32 publicKeyHash);
    event PublicKeyRevoked (bytes32 publicKeyHash);

    //Modifiers
    modifier validAddress(address addr) {//protects against some weird attacks
        require(addr != address(0));
        _;
    }

    //Functions
    constructor (address _previousPublishedVersion) public {
        version = 3;
        previousPublishedVersion = _previousPublishedVersion;
    }

    // Sets new key and revokes previous
    function addKey(string publicKey) public {
        require(!publicKeyRegistry[msg.sender][getStringHash(publicKey)].exists);
        uint changeDate = now;
        revokePublicKey(getCurrentPublicKey(msg.sender));
        publicKeyRegistry[msg.sender][getStringHash(publicKey)] = PublicKey(
            true,
            Status.Valid,
            changeDate,
            0
        );
        publicKeyList[msg.sender].push(publicKey);
    }

    function revokePublicKey(string publicKey) public {
        PublicKey storage value = publicKeyRegistry[msg.sender][getStringHash(publicKey)];
        // only existent no backtransition
        if (value.exists && value.status != Status.DeletedBySubject) {
            value.endDate = now;
            emit PublicKeyRevoked(publicKey);
        }
    }

    function deletePublicKey(string publicKey) public {
        PublicKey storage value = publicKeyRegistry[msg.sender][getStringHash(publicKey)];
        // only existent
        if (value.exists) {
            value.status = Status.DeletedBySubject;
            value.endDate = now;
            emit PublicKeyDeleted(publicKey);
        }
    }

    function getCurrentPublicKey(address subject) view public validAddress(subject) returns (bytes32) {
        if (publicKeyList[subject].length > 0) {
            return publicKeyList[subject][publicKeyList[subject].length - 1];
        } else {
            return 0;
        }
    }

    function getPublicKeyStatus(address subject, string publicKey) view public validAddress(subject)
        returns (bool exists, Status status, uint startDate, uint endDate){
        PublicKey storage value = publicKeyRegistry[subject][getStringHash(publicKey)];
        return (value.exists, value.status, value.startDate, value.endDate);
    }

    function getStringHash(string memory inputString) internal pure returns(bytes32) {
        return keccak256(inputString);
    }
    
}
