pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import "../interfaces/InterfaceCredentialRegistry.sol";
import "../../libs/Ownable.sol";
import "../../libs/Upgradeable.sol";

contract AlastriaCredentialRegistry is InterfaceAlastriaCredentialRegistry_v0, Ownable, Upgradeable {
    
    // Variables
    InterfaceAlastriaCredentialRegistryStorage_v0 private _credentialStorage;
    
    // Modifiers
    modifier validAddress(address addr) {//protects against some weird attacks
        require(addr != address(0));
        _;
    }
    
    Status constant STATUS_FIRST = Status.Valid;
    Status constant STATUS_LAST = Status.DeletedBySubject;
    modifier validStatus (Status status) {
        require (status >= STATUS_FIRST && status <= STATUS_LAST);
        _;
    }
    
    // Functions
    constructor (address _storage, address _lastVersion) Upgradeable(_lastVersion) public {
        _credentialStorage = InterfaceAlastriaCredentialRegistryStorage_v0(_storage);
    }

    function addSubjectCredential(bytes32 subjectCredentialHash, string memory URI) public override 
    isLastVersion 
    onlyOwner {
        SubjectCredential memory _credential = _credentialStorage.getSubjectCredentialRegistry(msg.sender, subjectCredentialHash);
        require(!_credential.exists,"CREDENTIAL_REGISTRY: credential already exists");
        _credential = SubjectCredential(true, Status.Valid, URI);
        _credentialStorage.setSubjectCredentialRegistry(msg.sender, subjectCredentialHash, _credential);
        _credentialStorage.setSubjectCredentialRegistryList(msg.sender, subjectCredentialHash);
    }

    function deleteSubjectCredential(bytes32 subjectCredentialHash) public override
    isLastVersion 
    onlyOwner {
        SubjectCredential memory _credential = _credentialStorage.getSubjectCredentialRegistry(msg.sender, subjectCredentialHash);
        // only existent
        require(_credential.exists && _credential.status != Status.DeletedBySubject,"CREDENTIAL_REGISTRY: credential can't be deleted"); 
        _credential.status = Status.DeletedBySubject;
        _credentialStorage.setIssuerCredentialRegistryList(msg.sender, subjectCredentialHash);
        emit SubjectCredentialDeleted(subjectCredentialHash);
    }

    function lengthSubjectCredentialList(address subject) public view override 
    isLastVersion
    returns (uint256) {
        return (_credentialStorage.lengthSubjectCredentialRegistryList(subject));
    }
    
    function getSubjectCredentialList(address subject, uint256 _index) public view override 
    isLastVersion
    returns (bytes32) {
        return _credentialStorage.getSubjectCredentialRegistryList(subject, _index);
    }

    function updateIssuerCredentialStatus(bytes32 issuerCredentialHash, Status status) public override
    validStatus(status)
    isLastVersion {
        IssuerCredential memory _credential = _credentialStorage.getIssuerCredentialRegistry(msg.sender, issuerCredentialHash);
        require(status > _credential.status, "CREDENTIAL_REGISTRY: status can't be updated");
        require(status == Status.AskIssuer || status == Status.Revoked, "CREDENTIAL_REGISTRY: status is not allowed");
        _credential.exists = true;
        _credential.status = status;
        emit IssuerCredentialRevoked(issuerCredentialHash, status);
    }
    
    function getIssuerCredentialStatus(address issuer, bytes32 issuerCredentialHash) public view override
    validAddress(issuer)
    isLastVersion
    returns (bool exists, Status status) {
        IssuerCredential memory _credential = _credentialStorage.getIssuerCredentialRegistry(issuer, issuerCredentialHash);
        return (_credential.exists, _credential.status);
    }
    
    function getSubjectCredentialStatus(address subject, bytes32 subjectCredentialHash) public view override 
    validAddress(subject) 
    isLastVersion 
    onlyOwner 
    returns (bool exists, Status status) {
        SubjectCredential memory _credential = _credentialStorage.getSubjectCredentialRegistry(msg.sender, subjectCredentialHash);
        return (_credential.exists, _credential.status);
    }

    function getCredentialStatus(Status subjectStatus, Status issuerStatus) view public override
    validStatus(subjectStatus) 
    validStatus(issuerStatus)
    isLastVersion
    returns (Status) {
        if (subjectStatus >= issuerStatus) {
            return subjectStatus;
        } else {
            return issuerStatus;
        }
    }
    
    function initMigration() public onlyOwner {
        _initMigration();
    }
    
    function cancelMigration() public onlyOwner {
        _cancelMigration();
    }
    
    function endMigration(address nextVersion) public onlyOwner {
        Ownable _sto = Ownable(address(_credentialStorage));
        _endMigration(nextVersion);
        _sto.transferOwnership(nextVersion);
    }
}