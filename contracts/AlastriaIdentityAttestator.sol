pragma solidity 0.4.15;

import "contracts/libs/Eidas.sol";


/** We use 0.4.15 for UPORT compatibility.
 * It must on board identity providers and remove then. 
 */
contract AlastriaIdentityAttestator {

    using Eidas for Eidas.EidasLevel;

    struct IdentityAttestator {
        Eidas.EidasLevel level;
        bool active;
    }

    mapping(address => IdentityAttestator) internal providers;

    modifier onlyIdentityAttestator(address _identityAttestator) {
        require (providers[_identityAttestator].active);
        _;
    }

    modifier notIdentityAttestator(address _identityAttestator) {
        require (!providers[_identityAttestator].active);
        _;
    }

    modifier alLeastLow(Eidas.EidasLevel _level) {
        require (_level.atLeastLow());
        _;
    }

    function AlastriaIdentityAttestator() {
        // FIXME: This must be an Alastria_ID created from AlastriaIdentityManager.
        addIdentityAttestator(msg.sender, Eidas.EidasLevel.High);
    }

    function addIdentityAttestator(address _identityAttestator, Eidas.EidasLevel _level) public alLeastLow(_level) notIdentityAttestator(_identityAttestator) {

        IdentityAttestator storage identityAttestator = providers[_identityAttestator];
        identityAttestator.level = _level;
        identityAttestator.active = true;

    }

    function modifyIdentityAttestatorEidasLevel(address _identityAttestator, Eidas.EidasLevel _level) public alLeastLow(_level) onlyIdentityAttestator(_identityAttestator) {

        IdentityAttestator storage identityAttestator = providers[_identityAttestator];
        identityAttestator.level = _level;

    }

    function removeIdentityAttestator(address _identityAttestator) public onlyIdentityAttestator(_identityAttestator) {

        IdentityAttestator storage identityAttestator = providers[_identityAttestator];
        identityAttestator.level = Eidas.EidasLevel.Null;
        identityAttestator.active = false;

    }

    function getEidasLevel(address _identityAttestator) public constant onlyIdentityAttestator(_identityAttestator) returns (Eidas.EidasLevel) {
        return providers[_identityAttestator].level;
    }

}
