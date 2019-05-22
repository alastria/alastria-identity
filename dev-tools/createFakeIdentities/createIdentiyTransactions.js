const accounts = require('./accounts');
var alastriaIdentityManager = '0xf18bd0f5a4f3944f3074453ce2015e8af12ed196';

const createPublicKeyDidDocument = (identity, _nonce) => {
    return {
        from: accounts[identity].address,
        to: alastriaIdentityManager,
        //TODO: formating for any publickey
        data: `0x6d69d99a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002460e6cfd87fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e00000000000000000000000000000000000000000000000000000000`,
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