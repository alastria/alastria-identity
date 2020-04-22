pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

// Status for a presentation
enum Status {Valid, Received, AskDeletion, DeletionConfirmation}

// Presentation structs
struct ReceiverPresentation {
    bool exists;
    Status status;
}

// Presentation: Initially set to Valid
// Updates as allowed in *allow arrays
struct SubjectPresentation {
    bool exists;
    Status status;
    string URI;
}

interface InterfacePresentationRegistryStorage_v0 {

    function setSubjectPresentationRegistry(address subject, bytes32 presentationIndex, SubjectPresentation calldata presentation) external;

    function getSubjectPresentationRegistry(address subject, bytes32 presentationIndex) external returns(SubjectPresentation memory);

    function setSubjectPresentationList(address subject, bytes32 presentationIndex) external;

    function getSubjectPresentationList(address subject, uint256 _index) external returns(bytes32);
    
    function lengthSubjectPresentationList(address issuer) external view returns(uint256);

    function setReceiverPresentationRegistry(address subject, bytes32 presentationIndex, ReceiverPresentation calldata presentation) external;

    function getReceiverPresentationRegistry(address subject, bytes32 presentationIndex) external returns(ReceiverPresentation memory);
}

interface InterfacePresentationRegistry_v0 {

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