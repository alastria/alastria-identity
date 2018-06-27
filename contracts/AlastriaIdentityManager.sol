pragma solidity ^0.4.8;
import "./BasicIdentityManager.sol";
import "./proxy.sol";


contract AlastriaIdentityManager is BasicIdentityManager{

    struct Attest {
      bytes32 attHash;
      bytes32 attUri;
    }

      mapping(address => mapping(address => uint)) limiter;

      modifier onlyOlderOwner(address identity, address sender) {
        require(isOlderOwner(identity, sender));
        _;
    }

    modifier onlyRecovery(proxy identity, address sender, bytes _data) {
        uint eidasLevel;
        uint _valueFix;
        eidasLevel = 3; //Requesting eidasLevel needed
        require( eidasLevel == 3);
        _;
    }

    modifier rateLimited(proxy identity, address sender) {
        require(limiter[identity][sender] < (now - adminRate));
        limiter[identity][sender] = now;
        _;
    }

    event LogOwnerRemoved(proxy identity, address owner, address sender);
    event LogOwnerAdded(proxy identity, address newOwner, address sender);

    // @dev Inherit Basic constructor declaration
    function AlastriaIdentityManager(uint _userTimeLock, uint _adminTimeLock, uint _adminRate, address _registry)
     BasicIdentityManager(_userTimeLock, _adminTimeLock, _adminRate, _registry) {
    }

    /// @dev Allows a recoveryKey to add a new owner with userTimeLock waiting time
    function addOwnerFromRecovery(address sender, proxy identity, address newOwner, bytes _data) public
        onlyRecovery(identity, sender, _data)  //eIDAS
        rateLimited(identity, sender)
    {
        require(!isOlderOwner(identity, newOwner));
        owners[identity][newOwner] = now;
        LogOwnerAdded(identity, newOwner, sender);
    }

    /// @dev Allows an olderOwner to add a new owner instantly
    function addOwner(address sender, proxy identity, address newOwner) public
        onlyOlderOwner(identity, sender)
        rateLimited(identity, sender)
    {
        require(!isOwner(identity, newOwner));
        owners[identity][newOwner] = now - userTimeLock;
        LogOwnerAdded(identity, newOwner, sender);
    }

    /// @dev Allows an owner to remove another owner instantly
    function removeOwner(address sender, proxy identity, address owner) public
        onlyOlderOwner(identity, sender)
        rateLimited(identity, sender)
    {
        // an owner should not be allowed to remove itself
        require(sender != owner);
        delete owners[identity][owner];
        LogOwnerRemoved(identity, owner, sender);
    }

    function isOlderOwner(address identity, address owner) public constant returns (bool) {
        return (owners[identity][owner] > 0 && (owners[identity][owner] + adminTimeLock) <= now);
    }

}
