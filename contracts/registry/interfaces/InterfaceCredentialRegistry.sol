pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

enum Status {Valid, AskIssuer, Revoked, DeletedBySubject}

struct SubjectCredential {
    bool exists;
    Status status;
    string URI;
}

struct IssuerCredential {
    bool exists;
    Status status;
}

interface InterfaceAlastriaCredentialRegistryStorage_v0  {

    function setIssuerCredentialRegistry(address issuer, bytes32 credentialIndex, IssuerCredential calldata credential) external;

    function getIssuerCredentialRegistry(address issuer, bytes32 credentialIndex) external view returns(IssuerCredential memory);
    
    function setIssuerCredentialRegistryList(address issuer, bytes32 credentialIndex) external;
    
    function getIssuerCredentialRegistryList(address issuer, uint256 _index) external view returns(bytes32);
    
    function lengthIssuerCredentialRegistryList(address issuer) external view returns(uint256);
    
    function setSubjectCredentialRegistry(address subject, bytes32 credentialIndex, SubjectCredential calldata credential) external;

    function getSubjectCredentialRegistry(address subject, bytes32 credentialIndex) external view returns(SubjectCredential memory);
    
    function setSubjectCredentialRegistryList(address subject, bytes32 credentialIndex) external;
    
    function getSubjectCredentialRegistryList(address subject, uint256 _index) external view returns(bytes32);
    
    function lengthSubjectCredentialRegistryList(address subject) external view returns(uint256);

}

interface InterfaceAlastriaCredentialRegistry_v0 {

    function addSubjectCredential(bytes32 subjectCredentialHash, string calldata URI) external;

    function deleteSubjectCredential(bytes32 subjectCredentialHash) external;
    
    function getSubjectCredentialList(address subject, uint256 _index) view external returns (bytes32);
    
    function lengthSubjectCredentialList(address subject) external view returns (uint256);

    function updateIssuerCredentialStatus(bytes32 issuerCredentialHash, Status status) external;
    
    function getSubjectCredentialStatus(address subject, bytes32 subjectCredentialHash) view external returns (bool, Status); 

    function getIssuerCredentialStatus(address issuer, bytes32 issuerCredentialHash) view external returns (bool, Status);

    function getCredentialStatus(Status subjectStatus, Status issuerStatus) view external returns (Status);

    event SubjectCredentialDeleted (bytes32 subjectCredentialHash);
    
    event IssuerCredentialRevoked (bytes32 issuerCredentialHash, Status status);

}