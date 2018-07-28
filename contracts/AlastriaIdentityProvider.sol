pragma solidity 0.4.15;

import "contracts/libs/Eidas.sol";


/** We use 0.4.15 for UPORT compatibility.
 * It must on board identity providers and remove then. 
 */
contract AlastriaIdentityProvider {

    using Eidas for Eidas.EidasLevel;

    struct IdentityProvider {
        Eidas.EidasLevel level;
        bool active;
    }

    mapping(address => IdentityProvider) internal providers;

    modifier onlyIdentityProvider(address _identityProvider) {
        require (providers[_identityProvider].active);
        _;
    }

    modifier notIdentityProvider(address _identityProvider) {
        require (!providers[_identityProvider].active);
        _;
    }

    modifier alLeastLow(Eidas.EidasLevel _level) {
        require (_level.atLeastLow());
        _;
    }

    function AlastriaIdentityProvider() {
        // FIXME: This must be an Alastria_ID created from AlastriaIdentityManager.
        addIdentityProvider(msg.sender, Eidas.EidasLevel.High);
    }

    function addIdentityProvider(address _identityProvider, Eidas.EidasLevel _level) public alLeastLow(_level) notIdentityProvider(_identityProvider) {

        IdentityProvider storage identityProvider = providers[_identityProvider];
        identityProvider.level = _level;
        identityProvider.active = true;

    }

    function modifyIdentityProviderEidasLevel(address _identityProvider, Eidas.EidasLevel _level) public alLeastLow(_level) onlyIdentityProvider(_identityProvider) {

        IdentityProvider storage identityProvider = providers[_identityProvider];
        identityProvider.level = _level;

    }

    function removeIdentityProvider(address _identityProvider) public onlyIdentityProvider(_identityProvider) {

        IdentityProvider storage identityProvider = providers[_identityProvider];
        identityProvider.level = Eidas.EidasLevel.Null;
        identityProvider.active = false;

    }

    function getEidasLevel(address _identityProvider) public constant onlyIdentityProvider(_identityProvider) returns (Eidas.EidasLevel) {
        return providers[_identityProvider].level;
    }

}
