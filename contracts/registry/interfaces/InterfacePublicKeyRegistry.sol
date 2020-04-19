pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

interface InterfacePublicKeyRegistry_v0 {
    
    enum Status {Valid, RevokedBySubject}
    
    struct PublicKey {
        bool exists;
        Status status; // Deleted keys shouldnt be used, not even to check previous signatures.
        uint startDate;
        uint endDate;
        string key;
        string algorithm;
    }
    
    function getCurrentPublicKey(address subject) view external returns (string memory, string memory);

    function getKeyHash(string calldata inputKey) external returns(bytes32);
    
    function getPublicKeyStatus(address subject, bytes32 publicKeyId) view external;
    
    function addKey(string calldata publicKey, string calldata algorithm) external;

    function revokePublicKey(string calldata publicKey) external;

    function deletePublicKey(string calldata publicKey) external;
}