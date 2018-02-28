pragma solidity ^0.4.8;
import "./BasicIdentityManager.sol";
import "./proxy.sol";


contract AlastriaIdentityManager is BasicIdentityManager{

    struct Attest {
      bytes32 attHash;
      bytes32 attUri;
    }

    mapping(address => mapping(address => uint)) eidasLevel;

      modifier onlyOlderOwner(address identity, address sender) {
        require(isOlderOwner(identity, sender));
        _;
    }

    modifier onlyRecovery(Proxy identity, address sender, bytes32 _data) {
        uint eidasLevel;
        eidasLevel = forwardTo(msg.sender, identity, registry, 0, _data);
        require( eidasLevel == 3);
        _;
    }

    modifier rateLimited(Proxy identity, address sender) {
        require(limiter[identity][sender] < (now - adminRate));
        limiter[identity][sender] = now;
        _;
    }

    /// @dev Allows a recoveryKey to add a new owner with userTimeLock waiting time
    function addOwnerFromRecovery(address sender, Proxy identity, address newOwner) public
        onlyRecovery(identity, sender)  //eIDAS
        rateLimited(identity, sender)
    {
        require(!isOwner(identity, newOwner));
        owners[identity][newOwner] = now;
        LogOwnerAdded(identity, newOwner, sender);
    }

    /// @dev Allows an olderOwner to add a new owner instantly
    function addOwner(address sender, Proxy identity, address newOwner) public
        onlyOlderOwner(identity, sender)
        rateLimited(identity, sender)
    {
        require(!isOwner(identity, newOwner));
        owners[identity][newOwner] = now - userTimeLock;
        LogOwnerAdded(identity, newOwner, sender);
    }

    /// @dev Allows an owner to remove another owner instantly
    function removeOwner(address sender, Proxy identity, address owner) public
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
