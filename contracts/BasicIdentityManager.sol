pragma solidity ^0.4.8;
import "./proxy.sol";


contract BasicIdentityManager {
    uint adminTimeLock;
    uint userTimeLock;
    uint adminRate;
    address registry;

    event LogIdentityCreated(
        address indexed identity,
        address indexed creator,
        address owner
        );

    event newRegistryAdded(
        address newRegistry
      );

    mapping(address => mapping(address => uint)) owners;

    modifier onlyOwner(address identity, address sender) {
        require(isOwner(identity, sender));
        _;
    }

    modifier validAddress(address addr) { //protects against some weird attacks
        require(addr != address(0));
        _;
    }

    /// @dev Contract constructor sets initial timelocks and meta-tx relay address
    /// @param _userTimeLock Time before new owner added by recovery can control proxy
    /// @param _adminTimeLock Time before new owner can add/remove owners
    /// @param _adminRate Time period used for rate limiting a given key for admin functionality
    /// @param _registry The registry contract used
    function BasicIdentityManager(uint _userTimeLock, uint _adminTimeLock, uint _adminRate, address _registry) {
        require(_adminTimeLock >= _userTimeLock);
        adminTimeLock = _adminTimeLock;
        userTimeLock = _userTimeLock;
        adminRate = _adminRate;
        registry = _registry;
    }

    /// @dev Creates a new proxy contract for an owner and recovery
    /// @param owner Key who can use this contract to control proxy. Given full power
    /// Gas cost of ~300,000
    function createIdentity(address owner) public{
        proxy identity = new proxy();
        owners[identity][owner] = now - adminTimeLock; // This is to ensure original owner has full power from day one
        LogIdentityCreated(identity, msg.sender, owner);
    }

    /// @dev Allows a user to forward a call through their proxy.
    function forwardTo(address sender, proxy identity, address destination, uint value, bytes data) public
        onlyOwner(identity, sender)
    {
        identity.forward(destination, value, data);
    }

    // @dev Change the address of the target registry used
    // @param _newRegistry New Registry address
    function changeRegistryPoint(address _newRegistry){
      registry = _newRegistry;
      newRegistryAdded(_newRegistry);
    }

    //Checks that address a is the first input in msg.data.
    //Has very minimal gas overhead.
    function checkMessageData(address a) internal constant returns (bool t) {
        if (msg.data.length < 36) return false;
        assembly {
            let mask := 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
            t := eq(a, and(mask, calldataload(4)))
        }
    }

    function isOwner(address identity, address owner) public constant returns (bool) {
        return (owners[identity][owner] > 0 && (owners[identity][owner] + userTimeLock) <= now);
    }
}
