pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;

import "../../libs/Ownable.sol";
import "../interfaces/InterfacePresentationRegistryStorage.sol";

contract PresentationRegistryStorage is Ownable, InterfacePresentationRegistryStorage_v0 {

    // Mapping subject, subjectPresentationHash (Complete JSON Presentation)
    mapping(address => mapping(bytes32 => SubjectPresentation)) public subjectPresentationRegistry;
    mapping(address => bytes32[]) public subjectPresentationListRegistry;

    // Mapping receiver, receiverPresentationHash (Complete JSON Presentation + PresentationSignature)
    mapping(address => mapping(bytes32 => ReceiverPresentation)) private receiverPresentationRegistry;
    
    function setSubjectPresentationRegistry (address subject, bytes32 presentationIndex, SubjectPresentation memory presentation) public onlyOwner override{
        subjectPresentationRegistry[subject][presentationIndex] = presentation;
    }

    function getSubjectPresentationRegistry (address subject, bytes32 presentationIndex) public override 
    onlyOwner 
    returns(SubjectPresentation memory) {
        return subjectPresentationRegistry[subject][presentationIndex];
    }

    function setSubjectPresentationList (address subject, bytes32 presentationIndex) public override onlyOwner {
        subjectPresentationListRegistry[subject].push(presentationIndex);
    }

    function getSubjectPresentationList (address subject, uint256 _index) public override 
    onlyOwner
    returns(bytes32) {
        return subjectPresentationListRegistry[subject][_index];
    }    
    
    function lengthSubjectPresentationList(address issuer) public view
    onlyOwner
    returns(uint256) {
        return subjectPresentationListRegistry[subject].length;
    }
    
    
    function setReceiverPresentationRegistry (address subject, bytes32 presentationIndex, ReceiverPresentation memory presentation) public onlyOwner override{
        receiverPresentationRegistry[subject][presentationIndex] = presentation;
    }

    function getReceiverPresentationRegistry (address subject, bytes32 presentationIndex) public onlyOwner override returns(ReceiverPresentation memory) {
        return receiverPresentationRegistry[subject][presentationIndex];
    }
}