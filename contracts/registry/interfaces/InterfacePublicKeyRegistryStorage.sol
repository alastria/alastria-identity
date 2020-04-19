pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

interface InterfacePublicKeyRegistryStorage_v0 {  
    // Initially Valid: could only be changed to DeletedBySubject for the time being.
    enum Status {Valid, RevokedBySubject}
    struct PublicKey {
        bool exists;
        Status status; // Deleted keys shouldnt be used, not even to check previous signatures.
        uint startDate;
        uint endDate;
        string key;
        string algorithm;
    }

    function setPublicKeyRegistry(address subject, bytes32 keyIndex, PublicKey calldata key) external;

    function getPublicKeyRegistry(address subject, bytes32 keyIndex) external view returns(PublicKey memory); 

    function getPublicKeyRegistryList(address subject, uint256 index) external view returns(bytes32);

    function lentghPublicKeyList(address subject) external view returns(uint256);
}