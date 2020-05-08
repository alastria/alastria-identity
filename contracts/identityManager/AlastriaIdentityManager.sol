pragma solidity 0.6.4;

import "./AlastriaIdentityServiceProvider.sol";
import "./AlastriaIdentityIssuer.sol";
import "./AlastriaProxy.sol";
import "./AlastriaIdentityEntity.sol";
import "../registry/AlastriaCredentialRegistry.sol";
import "../registry/AlastriaPresentationRegistry.sol";
import "../registry/AlastriaPublicKeyRegistry.sol";
import "../libs/Owned.sol";

contract AlastriaIdentityManager is AlastriaIdentityServiceProvider, AlastriaIdentityIssuer, AlastriaIdentityEntity, Owned {
    //Variables
    uint256 public version;
    uint internal timeToLive = 10000;
    AlastriaCredentialRegistry public alastriaCredentialRegistry;
    AlastriaPresentationRegistry public alastriaPresentationRegistry;
    AlastriaPublicKeyRegistry public alastriaPublicKeyRegistry;
    mapping(address => address payable) public identityKeys; //change to alastriaID created check bool
    mapping(address => uint) public pendingIDs;

    //Events
    event PreparedAlastriaID(address indexed signAddress);

    event OperationWasNotSupported(string indexed method);

    event IdentityCreated(address indexed identity, address indexed creator, address owner);

    event IdentityRecovered(address indexed oldAccount, address newAccount, address indexed serviceProvider);

    //Modifiers
    modifier isPendingAndOnTime(address _signAddress) {
        require(pendingIDs[_signAddress] > 0 && pendingIDs[_signAddress] > now);
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
        alastriaCredentialRegistry = new AlastriaCredentialRegistry(address(0));
        alastriaPresentationRegistry = new AlastriaPresentationRegistry(address(0));
        alastriaPublicKeyRegistry = new AlastriaPublicKeyRegistry(address(0));
    }

    //Methods
    function prepareAlastriaID(address _signAddress) public onlyIdentityIssuer(msg.sender) {
        pendingIDs[_signAddress] = now + timeToLive;
        emit PreparedAlastriaID(_signAddress);
    }

    /// @dev Creates a new AlastriaProxy contract for an owner and recovery and allows an initial forward call which would be to set the registry in our case
    /// @param addPublicKeyCallData of the call to addKey function in AlastriaPublicKeyRegistry from the new deployed AlastriaProxy contract
    function createAlastriaIdentity(bytes memory addPublicKeyCallData) public validAddress(msg.sender) isPendingAndOnTime(msg.sender) {
        AlastriaProxy identity = new AlastriaProxy();
        identityKeys[msg.sender] = identity.owner;
        pendingIDs[msg.sender] = 0;
        identity.forward(address(alastriaPublicKeyRegistry), 0, addPublicKeyCallData);//must be alastria registry call
    }

    /// @dev This method send a transaction trough the proxy of the sender
    function delegateCall(address _destination, uint256 _value, bytes memory _data) public {
        require(identityKeys[msg.sender]!=address(0));
        AlastriaProxy identity = AlastriaProxy(address(identityKeys[msg.sender]));
        identity.forward(_destination,_value,_data);
    }

    function recoverAccount(address accountLost, address newAccount) public onlyIdentityIssuer(msg.sender) {
        identityKeys[newAccount] = identityKeys[accountLost];
        identityKeys[accountLost] = address(0);
        IdentityRecovered(accountLost,newAccount,msg.sender);
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
