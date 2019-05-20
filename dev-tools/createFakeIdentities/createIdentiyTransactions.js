const accounts = require('./accounts');
var alastriaIdentityManager = '0xee91a06dc0b8ca8a2e3a499c42fae538e0287701';

const createPublicKeyDidDocument = (PublicKey, identity, _nonce) => {
    return {
        from: accounts[identity].address,
        to: alastriaIdentityManager,
        data: `0x60e6cfd8${PublicKey}`,
        nonce: _nonce
    }
}

const giveAccesToken = (address, _nonce) => {
    return {
        from: accounts.serviceProvider.address,
        to: alastriaIdentityManager,
        data: `0x4284f8d4000000000000000000000000${address.slice(2,40)}`,
        nonce: _nonce
    }
}

const setServiceProviderTransaction = (_nonce, address) => {
    return {
        from: accounts.admin.address,
        to: alastriaIdentityManager,
        data: `0x0ebbbffc000000000000000000000000${address.slice(2,40)}`,
        nonce: _nonce
    }
}

const setIssuerTransaction = (_nonce, address, hexUint) => {
    return {
        from: accounts.admin.address,
        to: alastriaIdentityManager,
        data: `0x889776a8000000000000000000000000${address.slice(2,40)}00000000000000000000000000000000000000000000000000000000000000${hexUint}`,
        nonce: _nonce
    }
}


const symbol = "__./contracts/libs/Eidas.sol:Eidas______";

const deployIdentityManagerTransaction = (_nonce, deployIdentityManagerData) => {
    return {
        from: accounts.admin.address,
        to: null,
        data: deployIdentityManagerData.split(symbol).join('3796f3f14262b5983eb6c2d283f3a514bd835343'),
        gas: 4900000,
        gasPrice: 0,
        nonce: _nonce
    }
}

const deployEidasLibTransaction = (_nonce, eidasBin) => {
    return {
        from: accounts.admin.address,
        to: null,
        data: eidasBin,
        gas: 3000000,
        gasPrice: 0,
        nonce: _nonce
    }
}

module.exports = {
    giveAccesToken,
    createPublicKeyDidDocument,
    deployIdentityManagerTransaction,
    deployEidasLibTransaction,
    setServiceProviderTransaction,
    setIssuerTransaction,
    alastriaIdentityManager
}