pragma solidity 0.4.15;

import "contracts/AlastriaIdentityProvider.sol";
import "contracts/AlastriaIdentityAttestator.sol";
import "contracts/proxy.sol";
import "contracts/libs/Owned.sol";

contract AlastriaIdentityManager is AlastriaIdentityProvider, AlastriaIdentityAttestator, Owned {
    //Variables
    mapping(address => address) public identityKeys; //change to alastriaID created check bool
    uint256 public version;
    mapping(address => uint) internal accessTokens;
    uint internal timeToLive = 10000;

    //Events
    event AccessTokenGenerated(address indexed signAddress);

    event OperationWasNotSupported(string indexed method);

    event LogIdentityCreated(
    address indexed identity,
    address indexed creator,
    address owner);

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
    function AlastriaIdentityManager(uint256 _version) {
        //TODO require(_version > getPreviousVersion(_previousVersion));
        version = _version;
    }

    //Methods
    function generateAccessToken(address _signAddress) public onlyIdentityProvider(msg.sender) {

        accessTokens[_signAddress] = now + timeToLive;
        emit AccessTokenGenerated(_signAddress);

    }

    /// @dev Creates a new proxy contract for an owner and recovery and allows an initial forward call which would be to set the registry in our case
    /// @param owner Key who can use this contract to control proxy. Given full power
    /// @param destination Address of contract to be called after proxy is created
    /// @param data of function to be called at the destination contract
    function createIdentityWithCall(address owner, address destination, bytes data) public validAddress(msg.sender) isOnTimeToLiveAndIsFromCaller(msg.sender) {
        proxy identity = new proxy();
        identityKeys[identity] = owner;
        identity.forward(destination, 0, data);//must be alastria registry call
        indentity.transfer(owner);
        emit LogIdentityCreated(identity, msg.sender, owner);
    }

    //Internals
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