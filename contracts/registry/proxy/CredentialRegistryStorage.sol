pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import "../../libs/Ownable.sol";
import "../interfaces/InterfaceCredentialRegistry.sol";

contract CredentialRegistryStorage is Ownable, InterfaceAlastriaCredentialRegistryStorage_v0 {

    // Mapping issuer, hash (JSON credential + CredentialSignature)
    mapping(address => mapping(bytes32 => IssuerCredential)) private issuerCredentialRegistry;
    mapping(address => bytes32[]) private issuerCredentialList;

    /**
     * @Dev: Mapping issuer, hash (JSON credential + CredentialSignature)
     */
    mapping(address => mapping(bytes32 => SubjectCredential)) private subjectCredentialRegistry;
    mapping(address => bytes32[]) private subjectCredentialList;

    function setIssuerCredentialRegistry(address issuer, bytes32 credentialIndex, IssuerCredential memory credential) public onlyOwner override {
        issuerCredentialRegistry[issuer][credentialIndex] = credential;
    }
    
    function getIssuerCredentialRegistry(address issuer, bytes32 credentialIndex) public onlyOwner override returns(IssuerCredential memory) {
        return issuerCredentialRegistry[issuer][credentialIndex];
    }
    
    function setIssuerCredentialRegistryList(address issuer, bytes32 credentialIndex) public onlyOwner override {
        issuerCredentialList[issuer].push(credentialIndex);
    }
    
    function getIssuerCredentialRegistryList(address issuer, uint256 _index) public onlyOwner override returns(bytes32) {
        return issuerCredentialList[issuer][_index];
    }
    
    function lengthIssuerCredentialRegistryList(address issuer) public onlyOwner override returns(uint256) {
        return issuerCredentialList[issuer].length;
    }

    function setSubjectCredentialRegistry(address subject, bytes32 credentialIndex, SubjectCredential memory credential) public onlyOwner override {
        subjectCredentialRegistry[subject][credentialIndex] = credential;
    }

    function getSubjectCredentialRegistry(address subject, bytes32 credentialIndex) public onlyOwner override returns(SubjectCredential memory) {
        return subjectCredentialRegistry[subject][credentialIndex];
    }
    
    function setSubjectCredentialRegistryList(address subject, bytes32 credentialIndex) public onlyOwner override {
        subjectCredentialList[subject].push(credentialIndex);
    }
    
    function getSubjectCredentialRegistryList(address subject, uint256 _index) public onlyOwner override returns(bytes32) {
        return subjectCredentialList[subject][_index];
    }
    
    function lengthSubjectCredentialRegistryList(address subject) public onlyOwner override returns(uint256) {
        return subjectCredentialList[subject].length;
    }
}