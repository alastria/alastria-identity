pragma solidity ^0.4.23;

import "contracts/libs/Eidas.sol";

contract AlastriaIdentityServiceProvider {

    using Eidas for Eidas.EidasLevel;

    mapping(address => bool) internal providers;

    modifier onlyIdentityProvider(address _identityProvider) {
        require (isIdentityProvider(_identityProvider));
        _;
    }

    modifier notIdentityProvider(address _identityProvider) {
        require (!isIdentityProvider(_identityProvider));
        _;
    }

    constructor () public {
        // FIXME: This must be an Alastria_ID created from AlastriaIdentityManager.
        addIdentityProvider(msg.sender);
    }

    function addIdentityProvider(address _identityProvider) public notIdentityProvider(_identityProvider) {
        providers[_identityProvider] = true;
    }

    function deleteIdentityProvider(address _identityProvider) public onlyIdentityProvider(_identityProvider) {
        providers[_identityProvider] = false;
    }

    function isIdentityProvider(address _identityProvider) public constant returns (bool) {
        return providers[_identityProvider];
    }

}
