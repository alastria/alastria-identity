pragma solidity ^0.4.8;
import "./BasicIdentityManager.sol";


contract AlastriaIdentityManager is BasicIdentityManager{

    struct Attest {
      bytes32 attHash;
      bytes32 attUri;
    }

    mapping(bytes32 => uint) attestId;

    event ev_newAtestaion(bytes32 _attHash, string _attUri);

    Attest[] public Atestation;
    uint public numAtestation;

    modifier onlyOlderOwner(address identity, address sender) {
        require(isOlderOwner(identity, sender));
        _;
    }

    modifier onlyRecovery(address identity, address sender) {
        require(recoveryKeys[identity] == sender);
        _;
    }

    modifier rateLimited(Proxy identity, address sender) {
        require(limiter[identity][sender] < (now - adminRate));
        limiter[identity][sender] = now;
        _;
    }

    /// @dev Allows an identity to linked attestations
    /// @param _attHash Hash of the attestation
    /// @param _attUri Uri allocating attestation
    function newAtestation(bytes32 _attHash, string _attUri) public {
      Atestation.push(Attest({
        attHash: _attHash,
        attUri: _attUri})
      );
      attestId[_attHash] = numAtestation;
      numAtestation = numAtestation + 1;
      ev_newAtestaion(_attHash, _attUri);
    }

    /// @dev Allows a recoveryKey to add a new owner with userTimeLock waiting time
    function addOwnerFromRecovery(address sender, Proxy identity, address newOwner) public
        onlyAuthorized
        onlyRecovery(identity, sender)  //eIDAS
        rateLimited(identity, sender)
    {
        require(!isOwner(identity, newOwner));
        owners[identity][newOwner] = now;
        LogOwnerAdded(identity, newOwner, sender);
    }

    /// @dev Allows an olderOwner to add a new owner instantly
    function addOwner(address sender, Proxy identity, address newOwner) public
        onlyAuthorized
        onlyOlderOwner(identity, sender)
        rateLimited(identity, sender)
    {
        require(!isOwner(identity, newOwner));
        owners[identity][newOwner] = now - userTimeLock;
        LogOwnerAdded(identity, newOwner, sender);
    }

    /// @dev Allows an owner to remove another owner instantly
    function removeOwner(address sender, Proxy identity, address owner) public
        onlyAuthorized
        onlyOlderOwner(identity, sender)
        rateLimited(identity, sender)
    {
        // an owner should not be allowed to remove itself
        require(sender != owner);
        delete owners[identity][owner];
        LogOwnerRemoved(identity, owner, sender);
    }

    /// @dev Allows to recover attestations without burning gas
    /// @param _id identification number for an attestation
    function getAtestationById(uint _id) constant internal returns(Attest){
      forwardTo(msg.sender, identity, registry, value, data)
      return Attest[_id];
    }

    /// @dev Allows to recover attestations without burning gas
    /// @param _attHash hash index in mapping for attestation
    function getAtestationByHash(bytes32 _attHash) constant internal returns (Attest){
      return getAtestationById(attestId[_attHash]);
    }

    function isOlderOwner(address identity, address owner) public constant returns (bool) {
        return (owners[identity][owner] > 0 && (owners[identity][owner] + adminTimeLock) <= now);
    }

    function isRecovery(address recoveryKey) public constant returns (bool) {
        return idasLvl[recoveryKey] == 3;
    }

}
