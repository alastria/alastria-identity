const fs = require('fs');
const keythereum = require('keythereum');
const password = 'Passw0rd';
const adminPath = './mocked-identity-keys/admin-6e3976aeaa3a59e4af51783cc46ee0ffabc5dc11';
const serviceProviderPath = './mocked-identity-keys/serviceProvider-643266eb3105f4bf8b4f4fec50886e453f0da9ad';
const issuerPath = './mocked-identity-keys/issuer-806bc0d7a47b890383a831634bcb92dd4030b092';
const identity1Path = './mocked-identity-keys/identity1-a9728125c573924b2b1ad6a8a8cd9bf6858ced49';
const identity2Path = './mocked-identity-keys/identity2-ad88f1a89cf02a32010b971d8c8af3a2c7b3bd94';
const identity3Path = './mocked-identity-keys/identity3-de7ab34219563ac50ccc7b51d23b9a61d22a383e';

module.exports = {
    admin: {
        privateKey: keythereum.recover(password, JSON.parse(fs.readFileSync(adminPath, 'utf8'))),
        address: `0x${JSON.parse(fs.readFileSync(adminPath, 'utf8')).address}`
    },
    issuer: {
        privateKey: keythereum.recover(password, JSON.parse(fs.readFileSync(issuerPath, 'utf8'))),
        address: `0x${JSON.parse(fs.readFileSync(issuerPath, 'utf8')).address}`
    },
    serviceProvider: {
        privateKey: keythereum.recover(password, JSON.parse(fs.readFileSync(serviceProviderPath, 'utf8'))),
        address: `0x${JSON.parse(fs.readFileSync(serviceProviderPath, 'utf8')).address}`
    },
    identity1: {
        privateKey: keythereum.recover(password, JSON.parse(fs.readFileSync(identity1Path, 'utf8'))),
        address: `0x${JSON.parse(fs.readFileSync(identity1Path, 'utf8')).address}`
    },
    identity2: {
        privateKey: keythereum.recover(password, JSON.parse(fs.readFileSync(identity2Path, 'utf8'))),
        address: `0x${JSON.parse(fs.readFileSync(identity2Path, 'utf8')).address}`
    },
    identity3: {
        privateKey: keythereum.recover(password, JSON.parse(fs.readFileSync(identity3Path, 'utf8'))),
        address: `0x${JSON.parse(fs.readFileSync(identity3Path, 'utf8')).address}`
    },
}