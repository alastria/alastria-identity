pragma solidity ^0.4.23;

import "contracts/identityManager/AlastriaIdentityServiceProvider.sol";
import "contracts/identityManager/AlastriaIdentityIssuer.sol";
import "contracts/identityManager/AlastriaProxy.sol";
import "contracts/libs/Owned.sol";

contract AlastriaIdentityManager is AlastriaIdentityServiceProvider, AlastriaIdentityIssuer, Owned {
    //Variables
    uint256 public version;
    uint internal timeToLive = 10000;
    mapping(address => address) public identityKeys; //change to alastriaID created check bool
    mapping(address => uint) internal accessTokens;

    //Events
    event AccessTokenGenerated(address indexed signAddress);

    event OperationWasNotSupported(string indexed method);

    event IdentityCreated(address indexed identity, address indexed creator, address owner);

    //Modifiers
    modifier isOnTimeToLiveAndIsFromCaller(address _signAddress) {
        require(accessTokens[_signAddress] > 0 && accessTokens[_signAddress] > now);
        _;
    }

    modifier validAddress(address addr) { //protects against some weird attacks
        require(addr != address(0));
        _;
    }

    //Constructor
    constructor (uint256 _version) public{
        //TODO require(_version > getPreviousVersion(_previousVersion));
        version = _version;
    }

    //Methods
    function generateAccessToken(address _signAddress) public onlyIdentityServiceProvider(msg.sender) {
        accessTokens[_signAddress] = now + timeToLive;
        emit AccessTokenGenerated(_signAddress);
    }

    // TODO: Document this function
    function createAlastriaIdentity() public validAddress(msg.sender) isOnTimeToLiveAndIsFromCaller(msg.sender) {
        //FIXME: This first version don't have the call to the registry.
        accessTokens[msg.sender] = 0;
        createIdentity(msg.sender, address(this));
    }

    // TODO: Document this function
    function createIdentity(address owner, address recoveryKey) public {
        AlastriaProxy identity = new AlastriaProxy();
        identityKeys[msg.sender] = identity;
        emit IdentityCreated(identity, recoveryKey, owner);
    }

    /// @dev Creates a new AlastriaProxy contract for an owner and recovery and allows an initial forward call which would be to set the registry in our case
    /// @param owner Key who can use this contract to control AlastriaProxy. Given full power
    /// @param destination Address of contract to be called after AlastriaProxy is created
    /// @param data of function to be called at the destination contract
    function createIdentityWithCall(address owner, address destination, bytes data) public validAddress(msg.sender) isOnTimeToLiveAndIsFromCaller(msg.sender) {
        AlastriaProxy identity = new AlastriaProxy();
        identityKeys[identity] = owner;
        identity.forward(destination, 0, data);//must be alastria registry call
        identity.transfer(owner);
       emit IdentityCreated(identity, msg.sender, owner);
    }

    //Internals TODO: warning recommending change visibility to pure
    //Checks that address a is the first input in msg.data.
    //Has very minimal gas overhead.
    function checkMessageData(address a) internal constant returns (bool t) {
        if (msg.data.length < 36) return false;
        assembly {
            let mask := 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
            t := eq(a, and(mask, calldataload(4)))
        }
    }
}
