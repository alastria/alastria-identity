pragma solidity 0.4.15;

import "uport-identity/contracts/IdentityManager.sol";
import "contracts/AlastriaIdentityProvider.sol";
import "contracts/AlastriaIdentityAttestator.sol";


contract AlastriaIdentityManager is IdentityManager(3600, 129600, 1200), AlastriaIdentityProvider, AlastriaIdentityAttestator {

    mapping(address => uint) internal accessTokens;
    uint internal timeToLive = 10000;

    event AccessTokenGenerated(address indexed signAddress);

    event OperationWasNotSupported(string indexed method);

    modifier isOnTimeToLiveAndIsFromCaller(address _signAddress) {
        require(accessTokens[_signAddress] > 0 && accessTokens[_signAddress] > now);
        _;
    }

    function generateAccessToken(address _signAddress) public onlyIdentityProvider(msg.sender) {

        accessTokens[_signAddress] = now + timeToLive;
        AccessTokenGenerated(_signAddress);

    }

    function createAlastriaIdentity() public validAddress(msg.sender) isOnTimeToLiveAndIsFromCaller(msg.sender) {
        //FIXME: This first version don't have the call to the registry.
        accessTokens[msg.sender] = 0;
        super.createIdentity(msg.sender, address(this));

    }
    
    function createIdentity(address owner, address recoveryKey) public {
        OperationWasNotSupported("createIdentity");
    }

    function createIdentityWithCall(address owner, address recoveryKey, address registryAddress, bytes data) public {

        OperationWasNotSupported("createIdentityWithCall");

    }

}
