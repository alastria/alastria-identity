pragma solidity 0.4.23;

import "../identityManager/AlastriaIdentityServiceProvider.sol";
import "../identityManager/AlastriaIdentityIssuer.sol";
import "../identityManager/AlastriaProxy.sol";
import "../libs/Owned.sol";

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

    /// @dev Creates a new AlastriaProxy contract for an owner and recovery and allows an initial forward call which would be to set the registry in our case
    /// @param destination Address of contract to be called after AlastriaProxy is created
    /// @param publicKeyData of function to be called at the destination contract
    function createAlastriaIdentity(address destination, bytes publicKeyData) public validAddress(msg.sender) isOnTimeToLiveAndIsFromCaller(msg.sender) {
        AlastriaProxy identity = createIdentity(msg.sender, address(this));
        accessTokens[msg.sender] = 0;
        identity.forward(destination, 0, publicKeyData);//must be alastria registry call
    } 

    /// @dev This method would be private in production
    function createIdentity(address owner, address recoveryKey) public returns (AlastriaProxy identity){
        identity = new AlastriaProxy();
        identityKeys[msg.sender] = identity;
        emit IdentityCreated(identity, recoveryKey, owner);
    }

    //Internals TODO: warning recommending change visibility to pure
    //Checks that address a is the first input in msg.data.
    //Has very minimal gas overhead.
    function checkMessageData(address a) internal pure returns (bool t) {
        if (msg.data.length < 36) return false;
        assembly {
            let mask := 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
            t := eq(a, and(mask, calldataload(4)))
        }
    }
}