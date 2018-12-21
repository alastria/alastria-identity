pragma solidity 0.4.15;


library Eidas {

    enum EidasLevel { Null, Reputational, Low, Substantial, High }

    /*function onlyReputational(EidasLevel _eidasLevel) returns (bool) {
        return (_eidasLevel == EidasLevel.Reputational);
    }

    function onlyLow(EidasLevel _eidasLevel) returns (bool) {
        return (_eidasLevel == EidasLevel.Low);
    }

    function onlySubstantial(EidasLevel _eidasLevel) returns (bool) {
        return (_eidasLevel == EidasLevel.Substantial);
    }

    function onlyHigh(EidasLevel _eidasLevel) returns (bool) {
        return (_eidasLevel == EidasLevel.High);
    }*/

    function atLeastLow(EidasLevel _eidasLevel) returns (bool) {
        return atLeast(_eidasLevel, EidasLevel.Low);
    }

    /*function alLeastSubstantial(EidasLevel _eidasLevel) returns (bool) {
        return atLeast(_eidasLevel, EidasLevel.Substantial);
    }

    function alLeastHigh(EidasLevel _eidasLevel) returns (bool) {
        return atLeast(_eidasLevel, EidasLevel.High);
    }*/

    function atLeast(EidasLevel _eidasLevel, EidasLevel _level) returns (bool) {
        return (uint(_eidasLevel) >= uint(_level));
    }
/*
    function notNull(EidasLevel _eidasLevel) returns (bool) {
        return _eidasLevel != EidasLevel.Null;
    }

    function toEidasLevel(uint _level) returns (EidasLevel) {
        return EidasLevel(_level);
    }*/

}