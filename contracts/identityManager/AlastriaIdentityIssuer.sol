pragma solidity ^0.4.23;

import "../libs/Eidas.sol";

contract AlastriaIdentityIssuer {

    using Eidas for Eidas.EidasLevel;

    struct IdentityIssuer {
        Eidas.EidasLevel level;
        bool active;
    }

    mapping(address => IdentityIssuer) internal issuers;

    modifier onlyIdentityIssuer(address _identityIssuer) {
        require (issuers[_identityIssuer].active);
        _;
    }

    modifier notIdentityIssuer(address _identityIssuer) {
        require (!issuers[_identityIssuer].active);
        _;
    }

    modifier alLeastLow(Eidas.EidasLevel _level) {
        require (_level.atLeastLow());
        _;
    }

    constructor () public {
        // FIXME: This must be an Alastria_ID created from AlastriaIdentityManager.
        addIdentityIssuer(msg.sender, Eidas.EidasLevel.High);
    }

    function addIdentityIssuer(address _identityIssuer, Eidas.EidasLevel _level) public alLeastLow(_level) notIdentityIssuer(_identityIssuer) {
        IdentityIssuer storage identityIssuer = issuers[_identityIssuer];
        identityIssuer.level = _level;
        identityIssuer.active = true;

    }

    function updateIdentityIssuerEidasLevel(address _identityIssuer, Eidas.EidasLevel _level) public alLeastLow(_level) onlyIdentityIssuer(_identityIssuer) {
        IdentityIssuer storage identityIssuer = issuers[_identityIssuer];
        identityIssuer.level = _level;
    }

    function deleteIdentityIssuer(address _identityIssuer) public onlyIdentityIssuer(_identityIssuer) {
        IdentityIssuer storage identityIssuer = issuers[_identityIssuer];
        identityIssuer.level = Eidas.EidasLevel.Null;
        identityIssuer.active = false;
    }

    function getEidasLevel(address _identityIssuer) public constant onlyIdentityIssuer(_identityIssuer) returns (Eidas.EidasLevel) {
        return issuers[_identityIssuer].level;
    }

}
