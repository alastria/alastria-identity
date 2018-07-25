pragma solidity ^0.4.24;


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
    event PublicKeyDeleted (bytes32 publicKey);
    event PublicKeyRevoked (bytes32 publicKey);

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
    function set(bytes32 publicKey) public {
        require(!publicKeyRegistry[msg.sender][publicKey].exists);
        uint changeDate = now;
        revokePublicKey(currentPublicKey(msg.sender));
        publicKeyRegistry[msg.sender][publicKey] = PublicKey(
            true,
            Status.Valid,
            changeDate,
            0
        );
        publicKeyList[msg.sender].push(publicKey);
    }

    function revokePublicKey(bytes32 publicKey) public {
        PublicKey storage value = publicKeyRegistry[msg.sender][publicKey];
        // only existent no backtransition
        if (value.exists && value.status != Status.DeletedBySubject) {
            value.endDate = now;
            emit PublicKeyRevoked(publicKey);
        }
    }

    function deletePublicKey(bytes32 publicKey) public {
        PublicKey storage value = publicKeyRegistry[msg.sender][publicKey];
        // only existent
        if (value.exists) {
            value.status = Status.DeletedBySubject;
            value.endDate = now;
            emit PublicKeyDeleted(publicKey);
        }
    }

    function currentPublicKey(address subject) view public validAddress(subject) returns (bytes32) {
        if (publicKeyList[subject].length > 0) {
            return publicKeyList[subject][publicKeyList[subject].length - 1];
        } else {
            return 0;
        }
    }

    function publicKeyStatus(address subject, bytes32 publicKey)
        view
        public
        validAddress(subject)
        returns (bool exists, Status status, uint startDate, uint endDate)
    {
        PublicKey storage value = publicKeyRegistry[subject][publicKey];
        return (value.exists, value.status, value.startDate, value.endDate);
    }

}
