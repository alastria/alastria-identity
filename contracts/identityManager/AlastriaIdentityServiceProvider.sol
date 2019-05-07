pragma solidity ^0.4.23;

import "../libs/Eidas.sol";

contract AlastriaIdentityServiceProvider {

    using Eidas for Eidas.EidasLevel;

    mapping(address => bool) internal providers;

    modifier onlyIdentityServiceProvider(address _identityServiceProvider) {
        require (isIdentityServiceProvider(_identityServiceProvider));
        _;
    }

    modifier notIdentityServiceProvider(address _identityServiceProvider) {
        require (!isIdentityServiceProvider(_identityServiceProvider));
        _;
    }

    constructor () public {
        // FIXME: This must be an Alastria_ID created from AlastriaIdentityManager.
        addIdentityServiceProvider(msg.sender);
    }

    function addIdentityServiceProvider(address _identityServiceProvider) public notIdentityServiceProvider(_identityServiceProvider) {
        providers[_identityServiceProvider] = true;
    }

    function deleteIdentityServiceProvider(address _identityServiceProvider) public onlyIdentityServiceProvider(_identityServiceProvider) {
        providers[_identityServiceProvider] = false;
    }

    function isIdentityServiceProvider(address _identityServiceProvider) public constant returns (bool) {
        return providers[_identityServiceProvider];
    }

}
