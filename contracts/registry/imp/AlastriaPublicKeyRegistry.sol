pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import "../../libs/Ownable.sol";
import "../../libs/Upgradeable.sol";

enum Status {Valid, RevokedBySubject}

struct PublicKey {
    bool exists;
    Status status; // Deleted keys shouldnt be used, not even to check previous signatures.
    uint startDate;
    uint endDate;
    string key;
    string algorithm;
}
    
interface InterfacePublicKeyRegistryStorage_v0 {  
    // Initially Valid: could only be changed to DeletedBySubject for the time being.

    function setPublicKeyRegistry(address subject, bytes32 keyIndex, PublicKey calldata key) external;

    function getPublicKeyRegistry(address subject, bytes32 keyIndex) external view returns(PublicKey memory); 

    function getPublicKeyRegistryList(address subject, uint256 index) external view returns(bytes32);

    function lentghPublicKeyList(address subject) external view returns(uint256);
}

interface InterfacePublicKeyRegistry_v0 {
    
    function getCurrentPublicKey(address subject) view external returns (string memory, string memory);

    function getPublicKeyStatus(address subject, bytes32 publicKeyId) view external returns(bool exists, Status status, uint startDate, uint endDate);
    
    function addKey(string calldata publicKey, string calldata algorithm) external;

    function revokePublicKey(string calldata publicKey) external;

    function deletePublicKey(string calldata publicKey) external;
}

// This contracts registers and makes publicly avalaible the AlastriaID Public Keys hash and status, current and past.
contract AlastriaPublicKeyRegistry is Ownable, Upgradeable, InterfacePublicKeyRegistry_v0 {
    
    // Storage
    InterfacePublicKeyRegistryStorage_v0 private _storagePublicKey;
    
    //Events, just for revocation and deletion
    event PublicKeyDeleted (string publicKey);
    event PublicKeyRevoked (string publicKey);

    //Modifiers
    modifier validAddress(address addr) {//protects against some weird attacks
        require(addr != address(0));
        _;
    }

    //Functions
    constructor (address _lastVersion, address _storage) public Upgradeable(_lastVersion) {
        _storagePublicKey = InterfacePublicKeyRegistryStorage_v0(_storage);
    }

    function getCurrentPublicKey(address subject) view public override
    validAddress(subject) 
    isLastVersion 
    onlyOwner 
    returns (string memory, string memory) {
        uint256 _length = _storagePublicKey.lentghPublicKeyList(subject);
        require(_length > 0,"PUBLIC_KEY_REGISTRY: there is no keys associated");
        bytes32 _index = _storagePublicKey.getPublicKeyRegistryList(msg.sender, _length - 1);
        PublicKey memory _key = _storagePublicKey.getPublicKeyRegistry(msg.sender,_index);
        return (_key.key, _key.algorithm);
    }

    function getKeyHash(string memory inputKey) internal pure returns(bytes32){
        bytes memory _data = bytes(inputKey);
        return keccak256(_data);
    }
    
    function getPublicKeyStatus(address subject, bytes32 publicKeyId) view public 
    validAddress(subject) 
    isLastVersion 
    onlyOwner 
    override
    returns (bool exists, Status status, uint startDate, uint endDate) {
        PublicKey memory _key = _storagePublicKey.getPublicKeyRegistry(subject, publicKeyId);
        return (_key.exists, _key.status, _key.startDate, _key.endDate);
    }
    
    // Sets new key and revokes previous
    function addKey(string memory publicKey, string memory algorithm) public 
    isLastVersion 
    onlyOwner 
    override {
        PublicKey memory _key = _storagePublicKey.getPublicKeyRegistry(msg.sender,getKeyHash(publicKey));
        require(!_key.exists);
        (string memory _currentKey, string memory _algorithm) = getCurrentPublicKey(msg.sender);
        revokePublicKey(_currentKey);
        _key = PublicKey(
            true,
            Status.Valid,
            now,
            0,
            publicKey,
            algorithm
        );
        bytes32 _keyId = getKeyHash(publicKey);
        _storagePublicKey.setPublicKeyRegistry(msg.sender, _keyId, _key);
    }

    function revokePublicKey(string memory publicKey) public 
    isLastVersion 
    onlyOwner 
    override {
        bytes32 _keyId = getKeyHash(publicKey);
        PublicKey memory _key = _storagePublicKey.getPublicKeyRegistry(msg.sender,_keyId);
        // only existent no backtransition
        require (_key.exists && _key.status != Status.RevokedBySubject,"PUBLIC_KEY_REGISTRY: key can not be revoked"); 
        _key.endDate = now;
        _key.status = Status.RevokedBySubject;
        _storagePublicKey.setPublicKeyRegistry(msg.sender, _keyId, _key);
        emit PublicKeyRevoked(publicKey);
    }

    function deletePublicKey(string memory publicKey) public override {
        bytes32 _keyId = getKeyHash(publicKey);
        PublicKey memory _key = _storagePublicKey.getPublicKeyRegistry(msg.sender,_keyId);
        // only existent no backtransition
        require (_key.exists ,"PUBLIC_KEY_REGISTRY: key can not be deleted");
        _key.exists = false;
        _key.endDate = now;
        _key.status = Status.RevokedBySubject;
        _key.key = "";
        _key.algorithm = "";
        _storagePublicKey.setPublicKeyRegistry(msg.sender, _keyId, _key);
        emit PublicKeyRevoked(publicKey);
    }
}
