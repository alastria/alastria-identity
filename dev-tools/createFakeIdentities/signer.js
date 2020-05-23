const Web3 = require('web3');
const utils = require('web3/lib/utils/utils');
const EthereumTx = require('ethereumjs-tx');
const fs = require('fs');
const accounts = require('./accounts');
const {
    networks
} = require('../../truffle');
const pkey = '7fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e';

const web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:22000`));

const transactions = [{
        from: "0xa9728125c573924b2b1ad6a8a8cd9bf6858ced49",
        to: "0xf18bd0f5a4f3944f3074453ce2015e8af12ed196",
        data: "0x6d69d99a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002460e6cfd87fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e00000000000000000000000000000000000000000000000000000000",
        nonce: 4,
        gas: 600000
    },
    {
        from: "0xad88f1a89cf02a32010b971d8c8af3a2c7b3bd94",
        to: "0xf18bd0f5a4f3944f3074453ce2015e8af12ed196",
        data: "0x6d69d99a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002460e6cfd87fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e00000000000000000000000000000000000000000000000000000000",
        nonce: 4,
        gas: 600000
    },
    {
        from: "0xde7ab34219563ac50ccc7b51d23b9a61d22a383e",
        to: "0xf18bd0f5a4f3944f3074453ce2015e8af12ed196",
        data: "0x6d69d99a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002460e6cfd87fdf96e9f8749d267319088775ad1cc245e5cd9fa0d6567426788a3ea10e675e00000000000000000000000000000000000000000000000000000000",
        nonce: 4,
        gas: 600000
    }
]

/**
 * Sign the payload data
 * @param {object} transaction transaction to be signed
 * @return {string} tx hash
 */
const signTransaction = (transaction, privateKey) => {
    try {
        const tx = new EthereumTx(transaction);
        tx.sign(privateKey);
        const signedTx = `0x${tx.serialize().toString('hex')}`;
        return signedTx;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

var signedTx = [];

signedTx.push(signTransaction(transactions[0],accounts.identity1.privateKey));
signedTx.push(signTransaction(transactions[1],accounts.identity2.privateKey));
signedTx.push(signTransaction(transactions[2],accounts.identity3.privateKey));

console.log(signedTx);
// signedTx.forEach((tx)=>{
//     web3.eth.sendRawTransaction(tx,(e,r)=>{
//         console.log(e);
//         console.log(r);
//     })
// });