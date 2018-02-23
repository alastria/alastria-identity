pragma solidity 0.4.15;
import "./Proxy.sol";


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

    mapping(address => mapping(address => uint)) owners;

    ///TxRelay linked to realay || checkMessageData(msg.sender)
    modifier onlyAuthorized() {
        require(msg.sender == checkMessageData(msg.sender));
        _;
    }

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
    /// @param _relayAddress Address of meta transaction relay contract remove in first implementation
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
        Proxy identity = new Proxy();
        owners[identity][owner] = now - adminTimeLock; // This is to ensure original owner has full power from day one
        LogIdentityCreated(identity, msg.sender, owner);
    }

    /// @dev Allows a user to forward a call through their proxy.
    function forwardTo(address sender, Proxy identity, address destination, uint value, bytes data) public
        onlyAuthorized
        onlyOwner(identity, sender)
    {
        identity.forward(destination, value, data);
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
